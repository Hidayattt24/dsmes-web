"use client";

import { useParticipantQuizDetail } from "../hooks/useParticipantQuizDetail";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { DetailPageLoader } from "@/components/ui/loading/DetailPageLoader";
import { ErrorState } from "@/components/common/ErrorState";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { usePathname } from "next/navigation";

interface ParticipantQuizDetailFeatureProps {
  readonly quizId: string;
  readonly participantId: string;
}

export function ParticipantQuizDetailFeature({
  quizId,
  participantId,
}: ParticipantQuizDetailFeatureProps) {
  const pathname = usePathname();
  const isStaff = pathname.startsWith("/staff");
  const { detail, isLoading, error, refetch } = useParticipantQuizDetail(quizId, participantId);

  if (isLoading) {
    return <DetailPageLoader type="record" />;
  }

  if (error || !detail) {
    return <ErrorState message={error ?? "Hasil kuesioner tidak ditemukan."} onRetry={refetch} />;
  }

  const { participant, quizTitle, questionAnalysis } = detail;
  const isPreTest = participant.selfEfficacyCategory !== undefined || questionAnalysis.some((q) => q.correctAnswer === "");

  const dmsesCategory = participant.selfEfficacyCategory || (
    participant.score <= 40 ? "Low Self-Efficacy" :
    participant.score <= 60 ? "Moderate Self-Efficacy" :
    participant.score <= 80 ? "Good Self-Efficacy" : "Very High Self-Efficacy"
  );

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)]">
      {/* Header section */}
      <div className="border-b border-[#E2E8F0] pb-4">
        <Link
          href={isStaff ? `/staff/manajemen-kuisioner/${quizId}` : `${ROUTES.MANAJEMEN_KUISIONER}/${quizId}`}
          className="flex items-center gap-2 text-[#00695C] hover:underline text-xs font-semibold mb-2"
        >
          <span className="material-symbols-outlined text-sm select-none">arrow_back</span>
          <span>Kembali ke Hasil Kuesioner</span>
        </Link>
        <h2 className="text-2xl font-bold text-[#1A202C]">
          {isPreTest ? "Hasil Efikasi Diri Pasien (DMSES)" : "Hasil Evaluasi Belajar Pasien"}
        </h2>
        <p className="text-sm text-[#718096] mt-1">
          Rincian jawaban kuesioner oleh {participant.patientName}
        </p>
      </div>

      {/* Patient & Quiz Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Profile Card */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm flex items-center gap-4">
          <Avatar src={participant.patientAvatar} name={participant.patientName} size={64} />
          <div className="space-y-1">
            <h4 className="font-bold text-base text-[#1A202C]">{participant.patientName}</h4>
            <p className="text-xs text-[#718096] font-medium">ID Pasien: P-00{participant.patientId}</p>
            <p className="text-xs text-[#718096] font-semibold">{participant.puskesmas}</p>
          </div>
        </div>

        {/* Quiz Info & Stats Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          <div>
            <p className="text-[10px] font-bold text-[#718096] uppercase tracking-wider mb-1">Kuesioner</p>
            <p className="text-sm font-bold text-[#1A202C] line-clamp-1">{quizTitle}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#718096] uppercase tracking-wider mb-1">Tanggal Selesai</p>
            <p className="text-sm font-semibold text-[#1A202C]">{participant.completionDate}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#718096] uppercase tracking-wider mb-1">Durasi Pengerjaan</p>
            <p className="text-sm font-semibold text-[#1A202C]">{participant.duration}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#718096] uppercase tracking-wider mb-1">
              {isPreTest ? "Skor DMSES & Kategori" : "Skor Akhir & Status"}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#00695C]">
                {isPreTest ? `${participant.score} / 100` : `${participant.score}%`}
              </span>
              <Badge variant="primary">
                {isPreTest ? dmsesCategory : (participant.passed ? "Lulus" : "Gagal")}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Question Analysis List */}
      <div className="space-y-6">
        <h3 className="text-base font-bold text-[#1A202C]">
          {isPreTest ? "Rincian Jawaban Respon Keyakinan Pasien" : "Analisis Pertanyaan"}
        </h3>
        <div className="space-y-6">
          {questionAnalysis.map((qa) => (
            <div
              key={qa.id}
              className={[
                "p-6 rounded-2xl border transition-all space-y-4 shadow-sm",
                isPreTest
                  ? "bg-white border-teal-100/80 hover:border-[#00695C]/30"
                  : qa.isCorrect
                  ? "bg-emerald-50/20 border-emerald-200"
                  : "bg-red-50/20 border-red-200",
              ].join(" ")}
            >
              {/* Question Header */}
              <div className="flex justify-between items-start gap-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={[
                      "w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white",
                      isPreTest ? "bg-[#00695C]" : qa.isCorrect ? "bg-emerald-600" : "bg-red-600",
                    ].join(" ")}
                  >
                    {qa.questionNumber}
                  </div>
                  <h4 className="text-sm font-bold text-[#1A202C]">{qa.questionText}</h4>
                </div>
                {!isPreTest && (
                  <Badge variant={qa.isCorrect ? "primary" : "error"}>
                    {qa.isCorrect ? "Benar" : "Salah"}
                  </Badge>
                )}
              </div>

              {/* Answers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                {/* Patient Answer */}
                <div className="p-3.5 rounded-xl border border-teal-100 bg-[#F0F9F8]/60">
                  <p className="font-bold text-[#718096] mb-1">
                    {isPreTest ? "Pilihan Respon Keyakinan Pasien (1–5)" : "Jawaban Pasien"}
                  </p>
                  <p className="text-[#00695C] font-bold text-sm">{qa.patientAnswer}</p>
                </div>

                {/* Correct Answer (Post-Test only) */}
                {!isPreTest && !qa.isCorrect && (
                  <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/30">
                    <p className="font-bold text-[#718096] mb-1">Jawaban Benar</p>
                    <p className="text-emerald-800 font-bold">{qa.correctAnswer}</p>
                  </div>
                )}
              </div>

              {/* Explanation */}
              {qa.explanation && (
                <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-100 flex gap-3 text-xs text-amber-800 leading-relaxed">
                  <span className="material-symbols-outlined text-amber-600 select-none text-base shrink-0">lightbulb</span>
                  <div>
                    <span className="font-bold">Penjelasan Edukasi: </span>
                    <span>{qa.explanation}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
