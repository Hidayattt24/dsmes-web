"use client";

import { usePathname } from "next/navigation";
import { useEducationProgress } from "../hooks/useEducationProgress";
import { BackButton } from "@/components/common/BackButton";
import { ROUTES } from "@/constants/routes";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/common/ErrorState";

interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
  bg: string;
}

function AnalyticsCard({ label, value, icon, color, bg }: StatCard) {
  return (
    <div className="premium-card p-5 flex items-start gap-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: bg, color }}>
        <span className="material-symbols-outlined text-[22px]">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-[#718096] uppercase tracking-widest mb-0.5 font-[family-name:var(--font-poppins)]">
          {label}
        </p>
        <p className="text-2xl font-bold text-[#1A202C] font-[family-name:var(--font-poppins)]">
          {value.toLocaleString("id-ID")}
        </p>
      </div>
    </div>
  );
}

interface EducationProgressFeatureProps {
  readonly articleId: string;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

function renderStars(rating: number) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <span key={i} className="material-symbols-outlined text-[#F59E0B] text-[18px] fill-current">
          star
        </span>
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <span key={i} className="material-symbols-outlined text-[#F59E0B] text-[18px] fill-current">
          star_half
        </span>
      );
    } else {
      stars.push(
        <span key={i} className="material-symbols-outlined text-[#CBD5E1] text-[18px]">
          star
        </span>
      );
    }
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

export function EducationProgressFeature({ articleId }: EducationProgressFeatureProps) {
  const pathname = usePathname();
  const isStaff = pathname.startsWith("/staff");

  const { progress, analytics, reviewsData, isLoading, error, refetch } = useEducationProgress(articleId);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)]">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1600px] mx-auto w-full">
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  const statsCards: StatCard[] = [
    { label: "Total Pasien", value: analytics?.total_patients ?? 0, icon: "group", color: "#00695C", bg: "#F0F9F8" },
    { label: "Selesai", value: analytics?.completed_count ?? 0, icon: "check_circle", color: "#166534", bg: "#F0FDF4" },
    { label: "Baca Artikel", value: analytics?.read_article_count ?? 0, icon: "menu_book", color: "#2B6CB0", bg: "#EBF8FF" },
    { label: "Tonton Video", value: analytics?.watched_video_count ?? 0, icon: "play_circle", color: "#B45309", bg: "#FFFBEB" },
    { label: "Baca + Video", value: analytics?.read_and_video_count ?? 0, icon: "done_all", color: "#6B21A8", bg: "#FAF5FF" },
    { label: "Belum Mulai", value: analytics?.not_started_count ?? 0, icon: "radio_button_unchecked", color: "#9CA3AF", bg: "#F9FAFB" },
  ];

  // Compute preferred media stats
  const articleOnlyCount = progress.filter((p) => p.completion_source === "ARTICLE").length;
  const videoOnlyCount = progress.filter((p) => p.completion_source === "VIDEO").length;
  const bothCount = progress.filter((p) => p.article_read && p.youtube_watched).length;

  const totalReviews = reviewsData?.total_reviews ?? 0;
  const avgRating = reviewsData?.average_rating ?? 0;
  const dist = reviewsData?.rating_distribution ?? { star_1: 0, star_2: 0, star_3: 0, star_4: 0, star_5: 0 };
  const userReviews = reviewsData?.reviews ?? [];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)]">
      {/* Header */}
      <div className="mb-2">
        <BackButton
          href={isStaff ? ROUTES.STAFF_MANAJEMEN_EDUKASI : ROUTES.MANAJEMEN_EDUKASI}
          label="Manajemen Edukasi"
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-[#1A202C] tracking-tight">Progress Peserta</h2>
        <p className="text-sm text-[#718096] mt-1">Pantau perkembangan belajar dan ulasan peserta untuk materi edukasi ini.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statsCards.map((card) => (
          <AnalyticsCard key={card.label} {...card} />
        ))}
      </div>

      {/* Preferred Media Analytics */}
      <div className="premium-card p-6">
        <h3 className="text-base font-bold text-[#1A202C] mb-1">Preferensi Media Pembelajaran</h3>
        <p className="text-xs text-[#718096] mb-4">Media yang paling sering digunakan pasien untuk menyelesaikan materi ini.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#EBF8FF] border border-[#BEE3F8]">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px] text-[#2B6CB0]">menu_book</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#2B6CB0] mb-0.5">Selesai via Artikel</p>
              <p className="text-xl font-bold text-[#1A202C]">{articleOnlyCount}</p>
              <p className="text-[11px] text-[#718096]">pasien</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A]">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px] text-[#B45309]">play_circle</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#B45309] mb-0.5">Selesai via Video</p>
              <p className="text-xl font-bold text-[#1A202C]">{videoOnlyCount}</p>
              <p className="text-[11px] text-[#718096]">pasien</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF5FF] border border-[#DDD6FE]">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px] text-[#6B21A8]">done_all</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B21A8] mb-0.5">Baca + Tonton Video</p>
              <p className="text-xl font-bold text-[#1A202C]">{bothCount}</p>
              <p className="text-[11px] text-[#718096]">pasien</p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Summary & Rating Distribution */}
      <div className="premium-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#1A202C]">Ringkasan Evaluasi & Ulasan</h3>
            <p className="text-xs text-[#718096] mt-0.5">Indikator kepuasan dan kualitas penjelasan materi edukasi dari pasien.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Average Rating Score Card */}
          <div className="md:col-span-4 p-6 rounded-2xl bg-[#F0F9F8] border border-[#CCECE6] flex flex-col items-center justify-center text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#00695C] mb-2 font-[family-name:var(--font-poppins)]">
              Rata-rata Rating
            </p>
            <div className="text-4xl font-extrabold text-[#1A202C] mb-1 font-[family-name:var(--font-poppins)]">
              {avgRating > 0 ? avgRating.toFixed(1) : "0.0"} <span className="text-lg text-[#718096] font-normal">/ 5</span>
            </div>
            <div className="my-2">{renderStars(avgRating)}</div>
            <p className="text-xs text-[#718096] font-medium">Berdasarkan {totalReviews} ulasan</p>
          </div>

          {/* Rating Distribution Bars */}
          <div className="md:col-span-8 space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = dist[`star_${star}` as keyof typeof dist] || 0;
              const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 w-16 text-[#4A5568] font-semibold shrink-0">
                    <span>{star}</span>
                    <span className="material-symbols-outlined text-[14px] text-[#F59E0B]">star</span>
                  </div>
                  <div className="flex-1 h-3 rounded-full bg-[#EDF2F7] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#F59E0B] transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="w-12 text-right text-[#718096] font-medium shrink-0">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Review Table */}
      <div className="premium-card overflow-hidden">
        <div className="p-6 pb-0 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1A202C]">Ulasan Pasien</h3>
            <p className="text-xs text-[#718096] mt-0.5">Daftar masukan dan penilaian yang dikirimkan langsung oleh peserta.</p>
          </div>
          <span className="text-xs text-[#718096] font-medium">{userReviews.length} ulasan</span>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8FAFC]">
              <tr className="text-[#718096] text-[10px] font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5 border-b border-[#E2E8F0]">Pasien</th>
                <th className="py-3.5 px-5 border-b border-[#E2E8F0] text-center">Rating</th>
                <th className="py-3.5 px-5 border-b border-[#E2E8F0]">Ulasan & Catatan</th>
                <th className="py-3.5 px-5 border-b border-[#E2E8F0]">Tanggal Selesai</th>
                <th className="py-3.5 px-5 border-b border-[#E2E8F0]">Tanggal Ulasan</th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium divide-y divide-[#E2E8F0]/40 bg-white">
              {userReviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-[#718096]">
                    Belum ada ulasan yang diberikan oleh peserta untuk materi ini.
                  </td>
                </tr>
              ) : (
                userReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-[#1A202C] whitespace-nowrap">
                      {rev.patient_name || "Pasien"}
                    </td>
                    <td className="py-3.5 px-5 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                        <span>{rev.rating}</span>
                        <span className="material-symbols-outlined text-[13px] text-[#F59E0B]">star</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-[#4A5568]">
                      {rev.note && rev.note.trim() !== "" ? (
                        <span>{rev.note}</span>
                      ) : (
                        <span className="text-[#9CA3AF] italic">Tidak ada komentar.</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-[#718096] whitespace-nowrap">
                      {rev.completion_date ? formatDate(rev.completion_date) : "-"}
                    </td>
                    <td className="py-3.5 px-5 text-[#718096] whitespace-nowrap">
                      {rev.created_at ? formatDate(rev.created_at) : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Table */}
      <div className="premium-card overflow-hidden">
        <div className="p-6 pb-0 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1A202C]">Detail Per Pasien</h3>
            <p className="text-xs text-[#718096] mt-0.5">Status baca artikel, tonton video, dan sumber penyelesaian materi.</p>
          </div>
          <span className="text-xs text-[#718096] font-medium">{progress.length} peserta</span>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8FAFC]">
              <tr className="text-[#718096] text-[10px] font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5 border-b border-[#E2E8F0]">Nama Pasien</th>
                <th className="py-3.5 px-5 border-b border-[#E2E8F0] text-center">Baca Artikel</th>
                <th className="py-3.5 px-5 border-b border-[#E2E8F0] text-center">Tonton Video</th>
                <th className="py-3.5 px-5 border-b border-[#E2E8F0] text-center">Status</th>
                <th className="py-3.5 px-5 border-b border-[#E2E8F0] text-center">Media Selesai</th>
                <th className="py-3.5 px-5 border-b border-[#E2E8F0]">Aktivitas Terakhir</th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium divide-y divide-[#E2E8F0]/40 bg-white">
              {progress.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-[#718096]">
                    Belum ada peserta yang berinteraksi dengan materi ini.
                  </td>
                </tr>
              ) : (
                progress.map((item) => (
                  <tr key={item.patient_id} className="hover:bg-[#F8FAFC] transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-5 font-semibold text-[#1A202C] whitespace-nowrap">{item.patient_name || "-"}</td>

                    {/* Article Read */}
                    <td className="py-3.5 px-5 text-center">
                      {item.article_read ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F0FDF4] text-[#166534]">
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F9FAFB] text-[#D1D5DB]">
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </span>
                      )}
                    </td>

                    {/* YouTube Watched */}
                    <td className="py-3.5 px-5 text-center">
                      {item.youtube_watched ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F0FDF4] text-[#166534]">
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F9FAFB] text-[#D1D5DB]">
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </span>
                      )}
                    </td>

                    {/* Completion Status */}
                    <td className="py-3.5 px-5 text-center">
                      {item.completed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]">
                          <span className="material-symbols-outlined text-[12px]">check_circle</span>
                          Selesai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FFF5F5] text-[#C53030] border border-[#FED7D7]">
                          <span className="material-symbols-outlined text-[12px]">cancel</span>
                          Belum
                        </span>
                      )}
                    </td>

                    {/* Completion Source */}
                    <td className="py-3.5 px-5 text-center">
                      {item.completion_source === "ARTICLE" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EBF8FF] text-[#2B6CB0] border border-[#BEE3F8]">
                          <span className="material-symbols-outlined text-[12px]">menu_book</span>
                          Artikel
                        </span>
                      ) : item.completion_source === "VIDEO" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                          <span className="material-symbols-outlined text-[12px]">play_circle</span>
                          Video
                        </span>
                      ) : (
                        <span className="text-[#9CA3AF]">-</span>
                      )}
                    </td>

                    {/* Last Activity */}
                    <td className="py-3.5 px-5 text-[#718096] whitespace-nowrap">
                      {item.last_activity_at ? formatDate(item.last_activity_at) : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
