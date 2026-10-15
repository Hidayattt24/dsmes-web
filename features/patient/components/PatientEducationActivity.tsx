"use client";

interface PatientArticleCompletionItem {
  readonly article_id: string;
  readonly article_title: string;
  readonly article_read: boolean;
  readonly youtube_watched: boolean;
  readonly completed: boolean;
  readonly completed_at: string | null;
  readonly completion_source: string;
  readonly last_activity_at: string | null;
}

export interface PatientEducationSummary {
  readonly total_articles: number;
  readonly completed_count: number;
  readonly read_count: number;
  readonly activities: readonly PatientArticleCompletionItem[];
}

interface PatientEducationActivityProps {
  readonly data?: PatientEducationSummary | null;
}

export function PatientEducationActivity({ data }: PatientEducationActivityProps) {
  const totalArticles = data?.total_articles ?? 0;
  const completedCount = data?.completed_count ?? 0;
  const readCount = data?.read_count ?? 0;
  const activities = data?.activities ?? [];

  // Sort: completed first, then by last_activity_at descending
  const sortedActivities = [...activities].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? -1 : 1;
    const dateA = a.last_activity_at ? new Date(a.last_activity_at).getTime() : 0;
    const dateB = b.last_activity_at ? new Date(b.last_activity_at).getTime() : 0;
    return dateB - dateA;
  });

  const recentActivities = sortedActivities.slice(0, 3);

  return (
    <div className="premium-card p-8 flex flex-col justify-between h-full font-[family-name:var(--font-poppins)]">
      <h4 className="font-semibold text-lg text-[#1A202C] mb-8">
        Aktivitas Edukasi
      </h4>

      {/* Stats Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#3B67FC]/5 p-4 rounded-xl border border-[#3B67FC]/10 text-center">
          <p className="text-[10px] uppercase font-bold text-[#3B67FC] tracking-widest mb-1">
            Modul Selesai
          </p>
          <p className="text-2xl font-bold text-[#3B67FC]">
            {completedCount} <span className="text-xs font-normal text-[#718096]">/ {totalArticles}</span>
          </p>
        </div>
        <div className="bg-[#F8F9FA] p-4 rounded-xl border border-[#E2E8F0]/40 text-center">
          <p className="text-[10px] uppercase font-bold text-[#718096] tracking-widest mb-1">
            Artikel Dibaca
          </p>
          <p className="text-2xl font-bold text-[#1A202C]">
            {readCount}
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div>
        <p className="text-[10px] uppercase font-bold tracking-widest text-[#718096] mb-6">
          Aktivitas Terakhir
        </p>

        <div className="relative ml-2">
          {recentActivities.length > 0 ? (
            <div className="relative space-y-8">
              <div className="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-[#3B67FC]/20 z-0"></div>

              {recentActivities.map((item, idx) => {
                const activityDate = item.last_activity_at
                  ? new Date(item.last_activity_at)
                  : item.completed_at
                    ? new Date(item.completed_at)
                    : null;
                const dateStr = activityDate
                  ? activityDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })
                  : "";
                return (
                  <div key={item.article_id || idx} className="relative flex items-start gap-6 z-10">
                    <div className={`w-5 h-5 rounded-full border-4 border-white shadow-sm flex-shrink-0 mt-0.5 ${item.completed ? 'bg-[#3B67FC]' : 'bg-[#E2E8F0]'}`}></div>
                    <div>
                      <p className="font-semibold text-sm text-[#1A202C]">
                        {item.article_title || "Artikel"}
                      </p>
                      <p className="text-[11px] text-[#718096] font-medium">
                        {item.completed ? "Selesai" : "Dibaca"} • {dateStr}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#F8F9FA] border border-[#E2E8F0] p-6 rounded-2xl text-center max-w-sm -ml-2">
              <span className="material-symbols-outlined text-[#718096] text-3xl mb-2">school</span>
              <p className="font-semibold text-sm text-[#4A5568]">Belum Ada Aktivitas Edukasi</p>
              <p className="text-xs text-[#718096] mt-1">Riwayat aktivitas membaca artikel dan menyelesaikan modul akan muncul di sini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
