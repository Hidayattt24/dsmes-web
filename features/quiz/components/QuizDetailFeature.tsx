"use client";

import { useQuizParticipants } from "../hooks/useQuizParticipants";
import { QuizSummaryStats } from "./QuizSummaryStats";
import { ParticipantTable } from "./ParticipantTable";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { DetailPageLoader } from "@/components/ui/loading/DetailPageLoader";
import { ErrorState } from "@/components/common/ErrorState";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { BackButton } from "@/components/common/BackButton";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useRouter, usePathname } from "next/navigation";
import { quizService } from "../services/quizService";

interface QuizDetailFeatureProps {
  readonly quizId: string;
}

export function QuizDetailFeature({ quizId }: QuizDetailFeatureProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isStaff = pathname.startsWith("/staff");
  const { showToast } = useToast();
  const {
    quiz,
    participants,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    refetch,
  } = useQuizParticipants(quizId);

  const [activeTab, setActiveTab] = useState<"questions" | "results">("questions");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!quiz) return;
    setIsDeleting(true);
    try {
      const success = await quizService.deleteQuiz(quiz.id);
      if (success) {
        showToast({
          type: "success",
          title: "Berhasil",
          description: "Kuesioner berhasil dihapus.",
        });
        router.push(ROUTES.MANAJEMEN_KUISIONER);
        router.refresh();
      }
    } catch {
      showToast({
        type: "error",
        title: "Gagal",
        description: "Gagal menghapus kuesioner.",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  if (isLoading) {
    return <DetailPageLoader type="record" />;
  }

  if (error || !quiz) {
    return <ErrorState message={error ?? "Kuesioner tidak ditemukan."} onRetry={refetch} />;
  }

  const totalQuestions = quiz.categories?.reduce((acc, cat) => acc + cat.questions.length, 0) ?? quiz.questionCount;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)]">
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="mb-2">
            <BackButton
              href={isStaff ? "/staff/manajemen-kuisioner" : ROUTES.MANAJEMEN_KUISIONER}
              label="Manajemen Kuesioner"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-[#1A202C]">{quiz.title}</h2>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                quiz.type === "PRE_TEST"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : "bg-teal-50 text-teal-700 border-teal-200"
              }`}
            >
              {quiz.type === "PRE_TEST" ? "Pre-Test DMSES" : "Post-Test Edukasi"}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                quiz.status === "Aktif"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-[#F7FAFC] text-[#718096] border-[#E2E8F0]"
              }`}
            >
              {quiz.status}
            </span>
          </div>
          <p className="text-xs font-medium text-[#718096] mt-1">
            {quiz.description || "Detail soal, pilihan jawaban, kunci jawaban, dan monitoring evaluasi pasien."}
          </p>
        </div>
        {!isStaff && (
          <div className="flex gap-3 w-full sm:w-auto">
            <Link
              href={`${ROUTES.MANAJEMEN_KUISIONER}/${quiz.id}/edit`}
              className="flex-1 sm:flex-initial h-11 px-5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold text-[#1A202C] hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-base select-none">edit</span>
              <span>Edit Kuesioner</span>
            </Link>
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="flex-1 sm:flex-initial h-11 px-5 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100 hover:bg-red-100/60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-base select-none">delete</span>
              <span>Hapus</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("questions")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "questions"
              ? "bg-[#00695C] text-white shadow-sm"
              : "bg-white text-[#4A5568] hover:bg-slate-100 border border-[#E2E8F0]"
          }`}
        >
          <span className="material-symbols-outlined text-base">quiz</span>
          <span>Daftar Soal & Kunci Jawaban ({totalQuestions})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("results")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "results"
              ? "bg-[#00695C] text-white shadow-sm"
              : "bg-white text-[#4A5568] hover:bg-slate-100 border border-[#E2E8F0]"
          }`}
        >
          <span className="material-symbols-outlined text-base">monitoring</span>
          <span>Hasil & Progres Pasien ({participants.length})</span>
        </button>
      </div>

      {/* TAB 1: DAFTAR SOAL & KATEGORI */}
      {activeTab === "questions" && (
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#718096] block font-semibold mb-0.5">Tipe Kuesioner</span>
              <span className="font-bold text-[#1A202C]">{quiz.type}</span>
            </div>
            <div>
              <span className="text-[#718096] block font-semibold mb-0.5">Edukasi Terkait</span>
              <span className="font-bold text-[#00695C]">{quiz.educationTitle || "-"}</span>
            </div>
            <div>
              <span className="text-[#718096] block font-semibold mb-0.5">Batas Kelulusan</span>
              <span className="font-bold text-[#1A202C]">{quiz.passingScore}%</span>
            </div>
            <div>
              <span className="text-[#718096] block font-semibold mb-0.5">Tingkat Kesulitan</span>
              <span className="font-bold text-amber-700">{quiz.difficulty || "Sedang"}</span>
            </div>
          </div>

          {/* Categories & Questions List */}
          {(!quiz.categories || quiz.categories.length === 0) ? (
            <div className="bg-white p-12 rounded-2xl border border-[#E2E8F0] text-center text-[#718096]">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">find_in_page</span>
              <p className="font-semibold text-sm">Belum ada pertanyaan pada kuesioner ini.</p>
            </div>
          ) : (
            quiz.categories.map((cat, catIdx) => (
              <div key={cat.id || catIdx} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
                {/* Category Header */}
                <div className="bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#1A202C] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#00695C] text-white flex items-center justify-center text-xs font-bold">
                        {catIdx + 1}
                      </span>
                      {cat.title}
                    </h3>
                    {cat.description && (
                      <p className="text-xs text-[#718096] mt-0.5 ml-8">{cat.description}</p>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-[#00695C] bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                    {cat.questions.length} Pertanyaan
                  </span>
                </div>

                {/* Questions List */}
                <div className="divide-y divide-[#E2E8F0]/60 p-6 space-y-6">
                  {cat.questions.map((q, qIdx) => (
                    <div key={q.id || qIdx} className="pt-4 first:pt-0 space-y-3">
                      {/* Question Header */}
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-bold text-[#00695C] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 shrink-0">
                          Soal #{q.displayOrder || qIdx + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#1A202C] leading-relaxed">
                            {q.questionText}
                          </p>

                          {/* Image preview if any */}
                          {q.questionImageUrl && (
                            <div className="mt-2 max-w-sm rounded-xl overflow-hidden border border-slate-200">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={q.questionImageUrl}
                                alt={`Ilustrasi Soal ${qIdx + 1}`}
                                className="w-full h-auto object-cover max-h-48"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 ml-11">
                        {q.choices.map((choice, cIdx) => (
                          <div
                            key={choice.id || cIdx}
                            className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                              choice.isCorrect
                                ? "bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium"
                                : "bg-[#F8FAFC] border-[#E2E8F0] text-[#4A5568]"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  choice.isCorrect
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-200 text-slate-700"
                                }`}
                              >
                                {String.fromCharCode(65 + cIdx)}
                              </span>
                              <span>{choice.optionText}</span>
                            </span>
                            {choice.isCorrect && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">check_circle</span>
                                <span>Kunci Jawaban</span>
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Explanation if any */}
                      {q.explanation && (
                        <div className="ml-11 bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
                          <span className="material-symbols-outlined text-base text-blue-600 shrink-0 select-none">
                            info
                          </span>
                          <div>
                            <span className="font-bold block text-[#1E3A8A]">Pembahasan Soal:</span>
                            <p className="mt-0.5 text-blue-800">{q.explanation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: HASIL & PROGRES PASIEN */}
      {activeTab === "results" && (
        <div className="space-y-8">
          {/* DMSES Interpretation Information Banner (Pre-Test Only) */}
          {quiz.type === "PRE_TEST" && (
            <div className="bg-gradient-to-br from-[#F0F9F8] via-white to-[#E6F2F1]/50 p-6 rounded-2xl border border-[#00695C]/20 shadow-sm space-y-3">
              <div className="flex items-center gap-2.5 text-[#00695C]">
                <span className="material-symbols-outlined text-xl select-none">psychology</span>
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Interpretasi Skor Efikasi Diri (DMSES)
                </h3>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                <strong>Skor Total DMSES</strong> = Penjumlahan seluruh item pertanyaan (Skor Minimal = 20, Skor Maksimal = 100).
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="bg-white p-3 rounded-xl border border-teal-100 text-center shadow-2xs">
                  <span className="block text-xs font-bold text-slate-700">20 – 40</span>
                  <span className="text-[11px] font-semibold text-amber-700">Low Self-Efficacy</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-teal-100 text-center shadow-2xs">
                  <span className="block text-xs font-bold text-slate-700">41 – 60</span>
                  <span className="text-[11px] font-semibold text-blue-700">Moderate Self-Efficacy</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-teal-100 text-center shadow-2xs">
                  <span className="block text-xs font-bold text-slate-700">61 – 80</span>
                  <span className="text-[11px] font-semibold text-teal-700">Good Self-Efficacy</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-teal-100 text-center shadow-2xs">
                  <span className="block text-xs font-bold text-slate-700">81 – 100</span>
                  <span className="text-[11px] font-semibold text-emerald-700">Very High Self-Efficacy</span>
                </div>
              </div>
              <p className="text-[11px] italic text-[#718096] pt-1">
                *Skor yang lebih tinggi menunjukkan keyakinan diri yang lebih besar dalam pengelolaan mandiri diabetes.
              </p>
            </div>
          )}

          {/* Summary Stat Cards */}
          <QuizSummaryStats quiz={quiz} />

          {/* Participant Table */}
          <ParticipantTable
            quizId={quizId}
            participants={participants}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isPreTest={quiz.type === "PRE_TEST"}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={isDeleteOpen}
        title="Hapus Kuesioner?"
        description="Apakah Anda yakin ingin menghapus kuesioner ini? Tindakan ini akan menghapus semua riwayat dan progres belajar partisipan."
        variant="danger"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
