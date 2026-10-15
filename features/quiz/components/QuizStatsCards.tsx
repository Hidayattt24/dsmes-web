import type { QuizStats } from "../types/quiz";

interface QuizStatsCardsProps {
  readonly stats: QuizStats | null;
}

export function QuizStatsCards({ stats }: QuizStatsCardsProps) {
  const displayStats = stats ?? {
    totalQuizzes: 0,
    publishedQuizzes: 0,
    draftQuizzes: 0,
    totalAttempts: 0,
    averageScore: 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {/* Total Kuesioner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
        <div className="w-12 h-12 rounded-full bg-[#3B67FC]/10 flex items-center justify-center text-[#3B67FC] mb-4">
          <span className="material-symbols-outlined select-none text-2xl">library_books</span>
        </div>
        <div>
          <p className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">Total Kuesioner</p>
          <p className="text-2xl font-bold text-[#1A202C]">{displayStats.totalQuizzes}</p>
        </div>
      </div>

      {/* Kuesioner Terbit */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
          <span className="material-symbols-outlined select-none text-2xl">check_circle</span>
        </div>
        <div>
          <p className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">Kuesioner Terbit</p>
          <p className="text-2xl font-bold text-[#1A202C]">{displayStats.publishedQuizzes}</p>
        </div>
      </div>

      {/* Draft */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-4">
          <span className="material-symbols-outlined select-none text-2xl">edit_document</span>
        </div>
        <div>
          <p className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">Draft</p>
          <p className="text-2xl font-bold text-[#1A202C]">{displayStats.draftQuizzes}</p>
        </div>
      </div>

      {/* Total Percobaan */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mb-4">
          <span className="material-symbols-outlined select-none text-2xl">group</span>
        </div>
        <div>
          <p className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">Total Percobaan</p>
          <p className="text-2xl font-bold text-[#1A202C]">{displayStats.totalAttempts.toLocaleString("id-ID")}</p>
        </div>
      </div>

      {/* Rata-rata Skor */}
      <div className="bg-[#3B67FC] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-10">
          <span className="material-symbols-outlined text-[100px] select-none">analytics</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white mb-4 z-10">
          <span className="material-symbols-outlined select-none text-2xl">show_chart</span>
        </div>
        <div className="z-10">
          <p className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">Rata-rata Skor</p>
          <p className="text-3xl font-bold">{displayStats.averageScore}%</p>
        </div>
      </div>
    </div>
  );
}
