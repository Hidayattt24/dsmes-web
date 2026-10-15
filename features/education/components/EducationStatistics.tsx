"use client";

import type { EducationStats } from "../types/education";

interface EducationStatisticsProps {
  readonly stats: EducationStats | null;
}

export function EducationStatistics({ stats }: EducationStatisticsProps) {
  const cards = [
    {
      label: "Total Edukasi",
      value: stats?.totalEducation ?? 0,
      suffix: " Artikel",
      icon: "library_books",
      color: "bg-[#EEF2FF] text-[#3B67FC]",
    },
    {
      label: "Kategori",
      value: stats?.totalCategories ?? 0,
      suffix: " Bidang",
      icon: "category",
      color: "bg-[#EFF6FF] text-[#1D4ED8]",
    },
    {
      label: "Artikel Aktif",
      value: stats?.publishedArticles ?? 0,
      suffix: " Terbit",
      icon: "check_circle",
      color: "bg-[#ECFDF5] text-[#047857]",
    },
    {
      label: "Total Pembaca",
      value: stats?.totalReads ?? 0,
      suffix: " Kali",
      icon: "visibility",
      color: "bg-[#FFFBEB] text-[#B45309]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="premium-card p-6 flex flex-col justify-between min-h-[140px] hover:-translate-y-1 transition-all duration-300 cursor-default"
        >
          <div className="w-full flex justify-between items-start mb-4">
            <h4 className="text-[11px] font-bold text-[#718096] uppercase tracking-widest font-[family-name:var(--font-poppins)]">
              {card.label}
            </h4>
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
              <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
            </span>
          </div>

          <p className="text-3xl font-bold text-[#1A202C] font-[family-name:var(--font-poppins)]">
            {card.value.toLocaleString("id-ID")}
            <span className="text-xs font-semibold text-[#718096] lowercase ml-1">
              {card.suffix}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}
