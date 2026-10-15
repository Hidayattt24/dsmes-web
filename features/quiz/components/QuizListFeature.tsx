"use client";

import { useCallback, useState } from "react";
import { useQuizList } from "../hooks/useQuizList";
import { QuizStatsCards } from "./QuizStatsCards";
import { QuizFilters } from "./QuizFilters";
import { QuizTable } from "./QuizTable";
import { TableSkeleton } from "@/components/ui/loading/TableSkeleton";
import { QuizListSkeleton } from "./QuizListSkeleton";
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
    filterScope,
    filterStatus,
    sortBy,
    pagination,
    setSearchQuery,
    setFilterType,
    setFilterScope,
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
  const [pairTarget, setPairTarget] = useState<QuestionnaireRecord | null>(null);
  const [pairOptions, setPairOptions] = useState<Awaited<ReturnType<typeof quizService.getEligiblePreTests>>>([]);
  const [selectedPreTestId, setSelectedPreTestId] = useState("");
  const [isPairing, setIsPairing] = useState(false);

  const handlePairClick = useCallback(async (quiz: QuestionnaireRecord) => {
    setPairTarget(quiz);
    setSelectedPreTestId("");
    setPairOptions(await quizService.getEligiblePreTests(quiz.scope ?? (quiz.educationId ? "EDUCATION" : "APPLICATION"), quiz.educationId, "admin"));
  }, []);

  const handlePair = useCallback(async () => {
    if (!pairTarget || !selectedPreTestId) return;
    setIsPairing(true);
    const success = await quizService.pairQuestionnaire(pairTarget.id, selectedPreTestId);
    setIsPairing(false);
    if (success) { showToast({ type: "success", title: "Pasangan tersimpan", description: "Post-Test berhasil dihubungkan ke Pre-Test." }); setPairTarget(null); refetch(); }
    else showToast({ type: "error", title: "Gagal", description: "Post-Test gagal dihubungkan ke Pre-Test." });
  }, [pairTarget, selectedPreTestId, showToast, refetch]);

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
    return <QuizListSkeleton isStaff={isStaff} />;
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A202C]">Manajemen Kuesioner</h2>
          <p className="text-xs font-medium text-[#718096] mt-1">
            Kelola pasangan pengukuran sebelum dan sesudah untuk ranah aplikasi maupun materi edukasi
          </p>
        </div>
        {!isStaff && (
          <Link
            href={`${ROUTES.MANAJEMEN_KUISIONER}/tambah`}
            className="h-12 px-6 rounded-xl bg-[#3B67FC] text-white text-sm font-bold hover:bg-[#1A63ED] transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-[#3B67FC]/20 shrink-0"
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
        filterScope={filterScope}
        filterStatus={filterStatus}
        sortBy={sortBy}
        onSearchChange={setSearchQuery}
        onTypeChange={setFilterType}
        onScopeChange={setFilterScope}
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
          onPairClick={handlePairClick}
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

      {pairTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-[#1A202C]">Hubungkan ke Pre-Test</h3>
            <p className="mt-1 text-xs text-[#718096]">Pilih Pre-Test yang menjadi sumber pembanding.</p>
            <select value={selectedPreTestId} onChange={(e) => setSelectedPreTestId(e.target.value)} className="mt-5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#3B67FC]">
              <option value="">Pilih Pre-Test</option>
              {pairOptions.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setPairTarget(null)} className="rounded-lg px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">Batal</button>
              <button type="button" disabled={!selectedPreTestId || isPairing} onClick={handlePair} className="rounded-lg bg-[#3B67FC] px-4 py-2 text-xs font-bold text-white disabled:opacity-50 cursor-pointer">{isPairing ? "Menyimpan..." : "Simpan Pasangan"}</button>
            </div>
          </div>
        </div>
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
