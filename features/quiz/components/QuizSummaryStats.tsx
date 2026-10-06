import type { QuestionnaireRecord } from "../types/quiz";

interface QuizSummaryStatsProps {
  readonly quiz: QuestionnaireRecord;
}

export function QuizSummaryStats({ quiz }: QuizSummaryStatsProps) {
  const isPreTest = quiz.type === "PRE_TEST";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-[family-name:var(--font-poppins)]">
      {/* Tipe & Judul */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-[#00695C]">
            <span className="material-symbols-outlined select-none text-xl">
              {isPreTest ? "psychology" : "workspace_premium"}
            </span>
          </div>
          <span
            className={[
              "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
              isPreTest
                ? "bg-teal-100 text-teal-800"
                : "bg-emerald-100 text-emerald-800",
            ].join(" ")}
          >
            {isPreTest ? "Pre-Test" : "Post-Test"}
          </span>
        </div>
        <div>
          <p className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">Judul Kuesioner</p>
          <p className="text-base font-bold text-[#1A202C] line-clamp-1">{quiz.title}</p>
          <p className="text-xs text-[#718096] mt-1 line-clamp-1">
            {isPreTest ? "Evaluasi Efikasi Diri Pasien (DMSES)" : quiz.educationTitle ? `Materi: ${quiz.educationTitle}` : "-"}
          </p>
        </div>
      </div>

      {/* Soal & Passing Score */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mb-4">
          <span className="material-symbols-outlined select-none text-xl">quiz</span>
        </div>
        <div>
          <p className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">Struktur Kuesioner</p>
          <p className="text-base font-bold text-[#1A202C]">
            {isPreTest
              ? `${quiz.questionCount ?? 0} Pertanyaan DMSES`
              : `${quiz.questionCount ?? 0} Soal Post-Test`}
          </p>
          <p className="text-xs text-[#718096] mt-1">
            {isPreTest ? "Skala Respon 1–5 (Tanpa Passing Score)" : `Passing Score: ${quiz.passingScore ?? "-"}% (${quiz.difficulty ?? "-"})`}
          </p>
        </div>
      </div>

      {/* Partisipan & Status */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
          <span className="material-symbols-outlined select-none text-xl">group</span>
        </div>
        <div>
          <p className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">Total Partisipan</p>
          <p className="text-base font-bold text-[#1A202C]">
            {quiz.participantCount} Pasien Selesai
          </p>
          <p className="text-xs text-[#718096] mt-1">
            {isPreTest ? "Pengukuran Keyakinan Mandiri" : quiz.averageScore !== null ? `Rata-rata Skor: ${quiz.averageScore}%` : "Belum Ada Skor"}
          </p>
        </div>
      </div>
    </div>
  );
}
