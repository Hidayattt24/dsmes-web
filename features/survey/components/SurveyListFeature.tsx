"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { surveyService } from "@/services/surveyService";
import type { SurveyListItem } from "@/types/survey";
import { SurveyFilters, type SurveySortBy } from "./SurveyFilters";
import { SurveyTable } from "./SurveyTable";
import { TableLoader } from "@/components/ui/loading/TableLoader";
import { TableSkeleton } from "@/components/ui/loading/TableSkeleton";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useToast } from "@/components/ui/Toast";

interface SurveyListFeatureProps {
  isStaff?: boolean;
}

export function SurveyListFeature({ isStaff: propIsStaff }: SurveyListFeatureProps) {
  const pathname = usePathname();
  const isStaff = propIsStaff ?? pathname.startsWith("/staff");
  const { showToast } = useToast();

  const [items, setItems] = useState<SurveyListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState<SurveySortBy>("newest");

  // Modals
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeToggleItem, setActiveToggleItem] = useState<SurveyListItem | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  const fetchSurveys = useCallback(async () => {
    setIsLoading(true);
    try {
      const type = filterType !== "ALL" ? filterType : undefined;
      const status = filterStatus !== "ALL" ? filterStatus : undefined;
      const res = await surveyService.getSurveys({ type, status, isStaff });
      
      let filtered = res.items;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            (s.description && s.description.toLowerCase().includes(q))
        );
      }

      if (sortBy === "oldest") {
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      } else if (sortBy === "title") {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      } else {
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      setItems(filtered);
      setTotal(res.total);
    } catch {
      showToast({
        type: "error",
        title: "Gagal Memuat Data",
        description: "Gagal mengambil daftar survey dari server.",
      });
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  }, [filterType, filterStatus, isStaff, searchQuery, sortBy, showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSurveys();
  }, [fetchSurveys]);

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await surveyService.deleteSurvey(deleteId);
      showToast({
        type: "success",
        title: "Berhasil",
        description: "Survey berhasil dihapus.",
      });
      fetchSurveys();
    } catch {
      showToast({
        type: "error",
        title: "Gagal",
        description: "Gagal menghapus survey.",
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Toggle Active Action
  const handleConfirmToggleActive = async () => {
    if (!activeToggleItem) return;
    setIsToggling(true);
    try {
      const nextActive = !activeToggleItem.is_active;
      const nextStatus = nextActive ? "published" : "draft";
      await surveyService.updateStatus(
        activeToggleItem.id,
        nextStatus,
        nextActive
      );
      showToast({
        type: nextActive ? "success" : "info",
        title: nextActive ? "Survey Diaktifkan" : "Survey Dijadikan Draft",
        description: `Survey "${activeToggleItem.title}" sekarang ${
          nextActive ? "Aktif" : "Draft"
        }.`,
      });
      fetchSurveys();
    } catch {
      showToast({
        type: "error",
        title: "Gagal",
        description: "Gagal mengubah status survey.",
      });
    } finally {
      setIsToggling(false);
      setActiveToggleItem(null);
    }
  };

  if (isLoading && !hasLoaded) {
    return (
      <div className="space-y-8 max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-4 w-80 bg-slate-100 rounded mt-2 animate-pulse" />
          </div>
        </div>
        <TableLoader />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A202C] tracking-tight">
            {isStaff ? "Pemantauan Survey Penelitian" : "Manajemen Survey (Kepuasan & Usability SUS)"}
          </h2>
          <p className="text-sm text-[#718096] mt-1">
            {isStaff
              ? "Pantau data dan respons hasil evaluasi survei kepuasan peserta penelitian"
              : "Kelola instrumen survey Kepuasan Pengguna & System Usability Scale (SUS) untuk evaluasi akhir penelitian"}
          </p>
        </div>
        {!isStaff && (
          <Link
            href="/admin/survey/create"
            className="bg-[#00695C] text-white text-sm font-bold h-12 px-6 rounded-xl flex items-center gap-2 hover:bg-[#004d43] transition-colors shadow-md shadow-[#00695C]/10 cursor-pointer active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined text-lg select-none">add</span>
            <span>Buat Survey Baru</span>
          </Link>
        )}
      </div>

      {/* Filters */}
      <SurveyFilters
        searchQuery={searchQuery}
        filterType={filterType}
        filterStatus={filterStatus}
        sortBy={sortBy}
        onSearchChange={setSearchQuery}
        onTypeChange={setFilterType}
        onStatusChange={setFilterStatus}
        onSortChange={setSortBy}
      />

      {/* Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <SurveyTable
          items={items}
          total={total}
          isStaff={isStaff}
          onDeleteClick={(id) => setDeleteId(id)}
          onToggleActiveClick={(survey) => setActiveToggleItem(survey)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={Boolean(deleteId)}
        title="Hapus Survey"
        description="Apakah Anda yakin ingin menghapus survey ini secara permanen? Seluruh pertanyaan dan respons peserta yang ada di dalamnya akan ikut terhapus."
        variant="danger"
        confirmText="Hapus Survey"
        cancelText="Batal"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Active Status Confirmation Modal */}
      <ConfirmationModal
        open={Boolean(activeToggleItem)}
        title={activeToggleItem?.is_active ? "Jadikan Draft Survey?" : "Aktifkan Survey?"}
        description={
          activeToggleItem?.is_active
            ? `Apakah Anda yakin ingin mengubah status survey "${activeToggleItem?.title}" menjadi Draft? Survey akan disembunyikan dari aplikasi mobile.`
            : `Apakah Anda yakin ingin mengaktifkan survey "${activeToggleItem?.title}"? Survey akan dapat diisi oleh peserta di aplikasi mobile.`
        }
        variant={activeToggleItem?.is_active ? "warning" : "success"}
        confirmText={activeToggleItem?.is_active ? "Ya, Jadikan Draft" : "Ya, Aktifkan"}
        cancelText="Batal"
        loading={isToggling}
        onConfirm={handleConfirmToggleActive}
        onCancel={() => setActiveToggleItem(null)}
      />
    </div>
  );
}
