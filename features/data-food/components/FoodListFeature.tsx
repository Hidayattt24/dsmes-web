"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { FoodStatsCards } from "@/features/data-food/components/FoodStatsCards";
import { FoodFilters } from "@/features/data-food/components/FoodFilters";
import { FoodTable } from "@/features/data-food/components/FoodTable";
import { FoodRequestTable } from "@/features/data-food/components/FoodRequestTable";
import { FoodImportModal } from "@/features/data-food/components/FoodImportModal";
import { FoodDetailModal } from "@/features/data-food/components/FoodDetailModal";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useToast } from "@/components/ui/Toast";
import { foodService } from "@/features/data-food/services/foodService";
import type {
  FoodMaster,
  FoodListParams,
  ExcelImportPreviewResponse,
  FoodStats,
  CreateFoodDTO,
} from "@/features/data-food/types/food";

export function FoodListFeature() {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"master" | "requests">("master");
  const [pendingRequestsCount, setPendingRequestsCount] = useState<number>(0);

  const [foods, setFoods] = useState<FoodMaster[]>([]);
  const [stats, setStats] = useState<FoodStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Modals
  const [detailFood, setDetailFood] = useState<FoodMaster | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FoodMaster | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [importPreview, setImportPreview] = useState<ExcelImportPreviewResponse | null>(null);
  const [importing, setImporting] = useState<boolean>(false);

  const fetchFoods = useCallback(async () => {
    try {
      setLoading(true);
      const params: FoodListParams = {
        page,
        limit,
        q: searchQuery || undefined,
        status: statusFilter || undefined,
      };
      const res = await foodService.getFoods(params);
      setFoods(res.data);
      setTotalItems(res.pagination.total_items);
      setTotalPages(
        res.pagination.total_pages || Math.ceil(res.pagination.total_items / limit) || 1
      );
    } catch {
      showToast({
        type: "error",
        title: "Gagal",
        description: "Gagal memuat data makanan.",
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, statusFilter, showToast]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await foodService.getStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch food stats", err);
    }
  }, []);

  const fetchRequestStats = useCallback(async () => {
    try {
      const data = await foodService.getFoodRequestStats();
      setPendingRequestsCount(data.pending || 0);
    } catch {
      // non-critical
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFoods();
    fetchStats();
    fetchRequestStats();
  }, [fetchFoods, fetchStats, fetchRequestStats]);


  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await foodService.deleteFood(deleteTarget.id);
      showToast({
        type: "success",
        title: "Berhasil Hapus",
        description: `Data makanan "${deleteTarget.name}" berhasil dihapus.`,
      });
      fetchFoods();
      fetchStats();
    } catch {
      showToast({
        type: "error",
        title: "Gagal",
        description: "Gagal menghapus data makanan.",
      });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handlePreviewImport = async (file: File) => {
    setImporting(true);
    try {
      const preview = await foodService.previewImport(file);
      setImportPreview(preview);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(error.response?.data?.message || "Gagal memproses file Excel");
    } finally {
      setImporting(false);
    }
  };

  const handleConfirmImport = async (items: CreateFoodDTO[]) => {
    setImporting(true);
    try {
      await foodService.confirmImport(items);
      showToast({
        type: "success",
        title: "Impor Berhasil",
        description: `${items.length} data makanan berhasil diimpor ke database.`,
      });
      setIsImportOpen(false);
      setImportPreview(null);
      fetchFoods();
      fetchStats();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(error.response?.data?.message || "Gagal melakukan impor data");
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async (format: "xlsx" | "csv" = "xlsx") => {
    try {
      const blob = await foodService.exportFoods(
        { q: searchQuery, status: statusFilter },
        format
      );
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `data_makanan_${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast({
        type: "success",
        title: "Ekspor Berhasil",
        description: "File data makanan berhasil diunduh.",
      });
    } catch {
      showToast({
        type: "error",
        title: "Gagal Ekspor",
        description: "Gagal mengunduh file data makanan.",
      });
    }
  };

  const handleToggleStatus = async (food: FoodMaster) => {
    const nextStatus = food.status === "active" ? "inactive" : "active";
    try {
      await foodService.updateFood(food.id, {
        name: food.name,
        manufacturer: food.manufacturer || "",
        serving_size: food.serving_size,
        energy_kcal: food.energy_kcal,
        protein_g: food.protein_g,
        carbohydrate_g: food.carbohydrate_g,
        fat_g: food.fat_g,
        status: nextStatus,
      });
      showToast({
        type: "success",
        title: "Status Diperbarui",
        description: `Status data makanan "${food.name}" berhasil diubah menjadi ${
          nextStatus === "active" ? "Aktif" : "Draft"
        }.`,
      });
      fetchFoods();
      fetchStats();
    } catch {
      showToast({
        type: "error",
        title: "Gagal Memperbarui",
        description: "Gagal memperbarui status makanan.",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A202C]">Data Makanan</h2>
          <p className="text-xs font-medium text-[#718096] mt-1">
            Kelola master data makanan, nilai gizi, serta usulan penambahan makanan dari pasien
          </p>
        </div>

        {activeTab === "master" && (
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => handleExport("xlsx")}
              className="h-11 px-4 rounded-xl border border-[#E2E8F0] bg-white text-[#4A5568] hover:bg-[#F8FAFC] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-lg select-none">download</span>
              <span>Ekspor Excel</span>
            </button>
            <button
              onClick={() => setIsImportOpen(true)}
              className="h-11 px-4 rounded-xl border border-[#3B67FC] bg-[#EEF2FF] text-[#3B67FC] hover:bg-[#3B67FC] hover:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-lg select-none">file_upload</span>
              <span>Impor Excel</span>
            </button>
            <Link
              href={`${ROUTES.DATA_MAKANAN}/tambah`}
              className="h-11 px-5 rounded-xl bg-[#3B67FC] text-white text-xs font-bold hover:bg-[#1A63ED] transition-all flex items-center gap-2 cursor-pointer shadow-xs shadow-[#3B67FC]/20"
            >
              <span className="material-symbols-outlined text-lg select-none">add</span>
              <span>Buat Makanan Baru</span>
            </Link>
          </div>
        )}
      </div>

      {/* Modern Tab Navigation */}
      <div className="flex items-center gap-3 border-b border-[#E2E8F0] pt-1">
        <button
          onClick={() => setActiveTab("master")}
          className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "master"
              ? "border-[#3B67FC] text-[#3B67FC]"
              : "border-transparent text-[#718096] hover:text-[#1A202C]"
          }`}
        >
          <span className="material-symbols-outlined text-xl select-none">restaurant_menu</span>
          <span>Database Makanan</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("requests");
            fetchRequestStats();
          }}
          className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "requests"
              ? "border-[#3B67FC] text-[#3B67FC]"
              : "border-transparent text-[#718096] hover:text-[#1A202C]"
          }`}
        >
          <span className="material-symbols-outlined text-xl select-none">pending_actions</span>
          <span>Permintaan Makanan Baru</span>
          {pendingRequestsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
              {pendingRequestsCount} Menunggu
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Master Foods */}
      {activeTab === "master" ? (
        <div className="space-y-6">
          {/* Stats Cards */}
          <FoodStatsCards stats={stats} />

          {/* Filters */}
          <FoodFilters
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setPage(1);
            }}
            onStatusChange={(status) => {
              setStatusFilter(status);
              setPage(1);
            }}
          />

          {/* Data Table */}
          <FoodTable
            foods={foods}
            loading={loading}
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setPage}
            onViewDetail={setDetailFood}
            onDeleteClick={setDeleteTarget}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      ) : (
        /* Tab 2: User Food Requests */
        <FoodRequestTable />
      )}


      {/* Detail Modal */}
      <FoodDetailModal
        isOpen={!!detailFood}
        onClose={() => setDetailFood(null)}
        food={detailFood}
      />

      {/* Excel Import Modal */}
      <FoodImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        preview={importPreview}
        importing={importing}
        onPreview={handlePreviewImport}
        onConfirm={handleConfirmImport}
        onReset={() => setImportPreview(null)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={!!deleteTarget}
        title="Hapus Data Makanan?"
        description={`Apakah Anda yakin ingin menghapus data makanan "${deleteTarget?.name}"? Aksi ini akan melakukan soft delete pada database.`}
        variant="danger"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
