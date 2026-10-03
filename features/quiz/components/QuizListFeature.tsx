"use client";

import { useCallback, useState } from "react";
import { useQuizList } from "../hooks/useQuizList";
import { QuizStatsCards } from "./QuizStatsCards";
import { QuizFilters } from "./QuizFilters";
import { QuizTable } from "./QuizTable";
import { TableSkeleton } from "@/components/ui/loading/TableSkeleton";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useToast } from "@/components/ui/Toast";
import { quizService } from "../services/quizService";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { usePathname } from "next/navigation";
import type { QuestionnaireRecord } from "../types/quiz";

export function QuizListFeature() {
  const pathname = usePathname();
  const isStaff = pathname.startsWith("/staff");
  const {
    quizzes,
    stats,
    isLoading,
    searchQuery,
    filterType,
    filterStatus,
    sortBy,
    pagination,
    setSearchQuery,
    setFilterType,
    setFilterStatus,
    setSortBy,
    setPage,
    refetch,
  } = useQuizList();

  const { showToast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toggleTarget, setToggleTarget] = useState<QuestionnaireRecord | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const success = await quizService.deleteQuiz(deleteId);
      if (success) {
        showToast({
          type: "success",
          title: "Berhasil",
          description: "Kuesioner berhasil dihapus.",
        });
        refetch();
      }
    } catch {
      showToast({
        type: "error",
        title: "Gagal",
        description: "Gagal menghapus kuesioner.",
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  }, [deleteId, showToast, refetch]);

  const handleConfirmToggleStatus = useCallback(async () => {
    if (!toggleTarget) return;
    setIsTogglingStatus(true);
    try {
      const isCurrentlyActive = toggleTarget.status === "Aktif";
      const success = await quizService.toggleQuizStatus(toggleTarget.id, toggleTarget.status);
      if (success) {
        showToast({
          type: isCurrentlyActive ? "info" : "success",
          title: isCurrentlyActive ? "Kuesioner Dijadikan Draft" : "Kuesioner Diaktifkan",
          description: isCurrentlyActive
            ? `Kuesioner "${toggleTarget.title}" telah diubah statusnya menjadi Draft.`
            : `Kuesioner "${toggleTarget.title}" berhasil diaktifkan.`,
        });
        refetch();
      } else {
        showToast({
          type: "error",
          title: "Gagal",
          description: "Gagal mengubah status kuesioner.",
        });
      }
    } catch {
      showToast({
        type: "error",
        title: "Gagal",
        description: "Terjadi kesalahan saat mengubah status kuesioner.",
      });
    } finally {
      setIsTogglingStatus(false);
      setToggleTarget(null);
    }
  }, [toggleTarget, showToast, refetch]);

  // Full-page skeleton only on first load; later refetches skeleton the table only
  if (isLoading && !stats) {
    return (
      <div className="space-y-8 max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-4 w-96 bg-slate-100 rounded-lg animate-pulse mt-2" />
          </div>
        </div>
        <div className="h-96 w-full bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A202C]">Manajemen Kuesioner</h2>
          <p className="text-xs font-medium text-[#718096] mt-1">
            Kelola instrumen evaluasi Pre-Test (DMSES) dan Post-Test materi edukasi pasien
          </p>
        </div>
        {!isStaff && (
          <Link
            href={`${ROUTES.MANAJEMEN_KUISIONER}/tambah`}
            className="h-12 px-6 rounded-xl bg-[#00695C] text-white text-sm font-bold hover:bg-[#004D40] transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-[#00695C]/20 shrink-0"
          >
            <span className="material-symbols-outlined text-xl select-none">add</span>
            <span>Buat Kuesioner Baru</span>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <QuizStatsCards stats={stats} />

      {/* Filter panel */}
      <QuizFilters
        searchQuery={searchQuery}
        filterType={filterType}
        filterStatus={filterStatus}
        sortBy={sortBy}
        onSearchChange={setSearchQuery}
        onTypeChange={setFilterType}
        onStatusChange={setFilterStatus}
        onSortChange={setSortBy}
      />

      {/* Data Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <QuizTable
          quizzes={quizzes}
          pagination={pagination}
          onDeleteClick={setDeleteId}
          onPageChange={setPage}
          onToggleStatusClick={(quiz) => setToggleTarget(quiz)}
        />
      )}

      {/* Toggle Status Confirmation Modal */}
      {!isStaff && (
        <ConfirmationModal
          open={!!toggleTarget}
          title={toggleTarget?.status === "Aktif" ? "Jadikan Draft Kuesioner?" : "Aktifkan Kuesioner?"}
          description={
            toggleTarget?.status === "Aktif"
              ? `Apakah Anda yakin ingin mengubah status kuesioner "${toggleTarget?.title}" menjadi Draft? Kuesioner tidak akan dapat diakses oleh pasien.`
              : `Apakah Anda yakin ingin mengaktifkan kuesioner "${toggleTarget?.title}"? Kuesioner ini akan langsung dapat diisi oleh pasien.`
          }
          variant={toggleTarget?.status === "Aktif" ? "warning" : "success"}
          confirmText={toggleTarget?.status === "Aktif" ? "Ya, Jadikan Draft" : "Ya, Aktifkan"}
          cancelText="Batal"
          loading={isTogglingStatus}
          onConfirm={handleConfirmToggleStatus}
          onCancel={() => setToggleTarget(null)}
        />
      )}

      {/* Delete Confirmation Modal — admin only */}
      {!isStaff && (
        <ConfirmationModal
          open={!!deleteId}
          title="Hapus Kuesioner?"
          description="Apakah Anda yakin ingin menghapus kuesioner ini? Aksi ini tidak dapat dibatalkan."
          variant="danger"
          confirmText="Ya, Hapus"
          cancelText="Batal"
          loading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
