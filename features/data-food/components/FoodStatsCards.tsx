"use client";

import React from "react";
import type { FoodStats } from "@/features/data-food/types/food";

interface Props {
  readonly stats: FoodStats | null;
}

export function FoodStatsCards({ stats }: Props) {
  const cards = [
    {
      title: "Total Makanan",
      value: stats?.total_foods?.toLocaleString("id-ID") ?? "0",
      icon: "restaurant",
      bgColor: "bg-[#EEF2FF] border-[#AFC2FF]",
      iconColor: "text-[#3B67FC]",
    },
    {
      title: "Diimpor Hari Ini",
      value: stats?.today_imported_foods?.toLocaleString("id-ID") ?? "0",
      icon: "file_upload",
      bgColor: "bg-blue-50 border-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Produsen / Merk",
      value: stats?.total_manufacturers?.toLocaleString("id-ID") ?? "0",
      icon: "factory",
      bgColor: "bg-purple-50 border-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Makanan Aktif",
      value: stats?.active_foods?.toLocaleString("id-ID") ?? "0",
      icon: "check_circle",
      bgColor: "bg-emerald-50 border-emerald-100",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center gap-4"
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${c.bgColor}`}
          >
            <span className={`material-symbols-outlined text-2xl select-none ${c.iconColor}`}>
              {c.icon}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
              {c.title}
            </p>
            <h3 className="text-2xl font-bold text-[#1A202C] mt-0.5">{c.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
