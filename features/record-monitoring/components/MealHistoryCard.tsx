"use client";

import type { MealLog } from "../types/record";

interface MealHistoryCardProps {
  readonly logs: MealLog[];
  readonly targetCalories?: number;
  readonly selectedDate?: string;
  readonly onDateChange?: (date: string) => void;
  readonly isLoading?: boolean;
}

export function MealHistoryCard({ logs = [], targetCalories, selectedDate, onDateChange, isLoading }: MealHistoryCardProps) {
  const target = targetCalories ?? 1800;
  const current = logs.reduce((sum, log) => sum + log.calories, 0);
  const rawPercentage = target > 0 ? (current / target) * 100 : 0;
  const chartPercentage = Math.min(100, Math.round(rawPercentage));
  const strokeDashoffset = 251.2 - (251.2 * chartPercentage) / 100;
  const hasData = logs.length > 0;

  let badgeText = "Belum Ada Catatan";
  let badgeStyle = "text-[#718096] bg-[#F4F6F8] border border-slate-200";
  let arcColor = "#B45309";

  if (hasData) {
    if (rawPercentage > 110) {
      badgeText = "Melebihi Batas";
      badgeStyle = "text-[#C53030] bg-[#FFF5F5] border border-red-200";
      arcColor = "#DC2626";
    } else if (rawPercentage >= 90) {
      badgeText = "Target Tercapai";
      badgeStyle = "text-[#00695C] bg-[#F0F9F8] border border-emerald-200";
      arcColor = "#00695C";
    } else {
      badgeText = "Batas Aman";
      badgeStyle = "text-[#B45309] bg-[#FFFBEB] border border-amber-200";
      arcColor = "#D97706";
    }
  }

  // Map icons for food categories
  const getIcon = (type: string) => {
    switch (type) {
      case "Sarapan":
        return "wb_sunny";
      case "Siang":
        return "wb_twilight";
      case "Cemilan":
        return "bakery_dining";
      default:
        return "nights_stay";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm flex flex-col h-[520px] font-[family-name:var(--font-poppins)]">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h3 className="text-base font-bold text-[#1A202C] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#B45309]">restaurant</span>
          Riwayat Asupan Makanan
        </h3>

        {onDateChange && (
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-[#718096]">calendar_today</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="text-xs font-medium border border-[#E2E8F0] rounded-lg px-2.5 py-1 bg-[#F8FAFC] text-[#4A5568] focus:outline-none focus:ring-1 focus:ring-[#00695C] cursor-pointer"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 mb-6">
        {/* Donut Chart SVG */}
        <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth="8"
            />
            {/* Progress Arc */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={arcColor}
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset={hasData ? strokeDashoffset : 251.2}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-[#1A202C] leading-none">
              {current.toLocaleString("id-ID")}
            </span>
            <span className="text-[10px] text-[#718096] mt-1">/ {(target / 1000).toFixed(1)}k kcal</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#1A202C] mb-1.5">Total Asupan Kalori</p>
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block ${badgeStyle}`}>
            {badgeText}
          </span>
        </div>
      </div>

      {/* Meal Logs List */}
      <div className="flex-1 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-center p-6 h-full min-h-[180px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00695C] mb-2"></div>
            <p className="text-xs text-[#718096]">Memuat catatan makanan...</p>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center text-center p-6 h-full min-h-[180px]">
            <span className="material-symbols-outlined text-[#718096] text-3xl mb-2">restaurant</span>
            <p className="font-semibold text-sm text-[#4A5568]">Belum Ada Catatan Makanan</p>
            <p className="text-xs text-[#718096] mt-1">Riwayat asupan makan pasien pada tanggal ini akan muncul di sini.</p>
          </div>
        ) : (
          <ul className="divide-y divide-[#E2E8F0]/40">
            {logs.map((log, idx) => (
              <li key={log.id || `meal-${idx}`} className="flex justify-between items-center py-3.5 hover:bg-[#F8FAFC] px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F4F6F8] flex items-center justify-center text-[#718096] flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">{getIcon(log.type)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A202C]">
                      {log.type}: {log.title}
                    </p>
                    <p className="text-xs text-[#718096] mt-0.5">{log.time}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#1A202C]">{log.calories} kcal</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
