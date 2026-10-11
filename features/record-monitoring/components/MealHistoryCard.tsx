"use client";

import type { MealLog } from "../types/record";

interface MealHistoryCardProps {
  readonly logs: MealLog[];
  readonly targetCalories?: number;
  readonly selectedDate?: string;
  readonly onDateChange?: (date: string) => void;
  readonly isLoading?: boolean;
}

export function MealHistoryCard({
  logs = [],
  targetCalories,
  selectedDate,
  onDateChange,
  isLoading,
}: MealHistoryCardProps) {
  const target = targetCalories ?? 1800;
  const current = logs.reduce((sum, log) => sum + (log.calories || 0), 0);
  const rawPercentage = target > 0 ? (current / target) * 100 : 0;
  const chartPercentage = Math.min(100, Math.round(rawPercentage));
  const strokeDashoffset = 251.2 - (251.2 * chartPercentage) / 100;
  const hasData = logs.length > 0;

  // Daily totals
  const totalProtein = Number(
    logs.reduce((sum, log) => sum + (log.protein || 0), 0).toFixed(1)
  );
  const totalCarbs = Number(
    logs.reduce((sum, log) => sum + (log.carbs || 0), 0).toFixed(1)
  );
  const totalFat = Number(
    logs.reduce((sum, log) => sum + (log.fat || 0), 0).toFixed(1)
  );
  const totalSugar = Number(
    logs.reduce((sum, log) => sum + (log.sugar || 0), 0).toFixed(1)
  );
  const totalSodium = Number(
    logs.reduce((sum, log) => sum + (log.sodium || 0), 0).toFixed(1)
  );
  const totalFiber = Number(
    logs.reduce((sum, log) => sum + (log.fiber || 0), 0).toFixed(1)
  );

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
        return "cookie";
      default:
        return "nights_stay";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm flex flex-col min-h-[580px] max-h-[760px] font-[family-name:var(--font-poppins)]">
      {/* Card Header */}
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

      {/* Donut Chart & Target Info */}
      <div className="flex items-center gap-6 mb-5 p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]/60">
        <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#E2E8F0"
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
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-base font-bold text-[#1A202C] leading-none">
              {current.toLocaleString("id-ID")}
            </span>
            <span className="text-[9px] text-[#718096] mt-0.5">/ {target.toLocaleString("id-ID")} kcal</span>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-xs font-semibold text-[#718096]">Total Konsumsi Hari Ini</p>
          <p className="text-lg font-bold text-[#1A202C] mt-0.5">
            {current.toLocaleString("id-ID")} <span className="text-xs font-normal text-[#718096]">kcal</span>
          </p>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mt-1.5 ${badgeStyle}`}>
            {badgeText}
          </span>
        </div>
      </div>

      {/* Daily Nutrients Summary Grid */}
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#718096] mb-2 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">analytics</span>
          Total Asupan Nutrisi ({selectedDate || "Hari Ini"})
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {/* Protein */}
          <div className="bg-[#F0F9FF] border border-[#0284C7]/20 rounded-xl p-2 text-center">
            <span className="text-[10px] font-bold text-[#0284C7] block">Protein</span>
            <span className="text-xs font-bold text-[#1A202C] block mt-0.5">{totalProtein}g</span>
          </div>
          {/* Karbohidrat */}
          <div className="bg-[#FFFBEB] border border-[#D97706]/20 rounded-xl p-2 text-center">
            <span className="text-[10px] font-bold text-[#D97706] block">Karbo</span>
            <span className="text-xs font-bold text-[#1A202C] block mt-0.5">{totalCarbs}g</span>
          </div>
          {/* Lemak */}
          <div className="bg-[#FFF1F2] border border-[#E11D48]/20 rounded-xl p-2 text-center">
            <span className="text-[10px] font-bold text-[#E11D48] block">Lemak</span>
            <span className="text-xs font-bold text-[#1A202C] block mt-0.5">{totalFat}g</span>
          </div>
          {/* Gula */}
          <div className="bg-[#F5F3FF] border border-[#7C3AED]/20 rounded-xl p-2 text-center">
            <span className="text-[10px] font-bold text-[#7C3AED] block">Gula</span>
            <span className="text-xs font-bold text-[#1A202C] block mt-0.5">{totalSugar}g</span>
          </div>
          {/* Natrium */}
          <div className="bg-[#F0FDFA] border border-[#0D9488]/20 rounded-xl p-2 text-center">
            <span className="text-[10px] font-bold text-[#0D9488] block">Natrium</span>
            <span className="text-xs font-bold text-[#1A202C] block mt-0.5">{totalSodium}mg</span>
          </div>
          {/* Serat */}
          <div className="bg-[#ECFDF5] border border-[#059669]/20 rounded-xl p-2 text-center">
            <span className="text-[10px] font-bold text-[#059669] block">Serat</span>
            <span className="text-xs font-bold text-[#1A202C] block mt-0.5">{totalFiber}g</span>
          </div>
        </div>
      </div>

      {/* Meal Logs List with Per-food Nutrient Breakdown */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#718096] mb-2 flex items-center justify-between">
          <span>Daftar Makanan Pasien ({logs.length})</span>
          {hasData && (
            <span className="text-[10px] font-semibold text-[#00695C]">
              {logs.length} catatan tercatat
            </span>
          )}
        </p>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-center p-6 h-full min-h-[160px]">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#00695C] mb-2"></div>
            <p className="text-xs text-[#718096]">Memuat catatan makanan...</p>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center text-center p-6 h-full min-h-[160px] bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0]">
            <span className="material-symbols-outlined text-[#718096] text-3xl mb-1.5">restaurant</span>
            <p className="font-semibold text-xs text-[#4A5568]">Belum Ada Catatan Makanan</p>
            <p className="text-[11px] text-[#718096] mt-0.5">Riwayat asupan makan pasien pada tanggal ini akan muncul di sini.</p>
          </div>
        ) : (
          <ul className="divide-y divide-[#E2E8F0]/50 space-y-2">
            {logs.map((log, idx) => (
              <li
                key={log.id || `meal-${idx}`}
                className="py-3 hover:bg-[#F8FAFC] px-2.5 rounded-xl transition-colors border border-transparent hover:border-[#E2E8F0]"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#00695C]/10 flex items-center justify-center text-[#00695C] flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">
                        {getIcon(log.type)}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1A202C]">
                        {log.foodName || log.title}
                      </p>
                      <p className="text-[11px] text-[#718096] mt-0.5">
                        <span className="font-semibold text-[#00695C]">{log.type}</span>
                        {log.portionMultiplier
                          ? ` · ${log.portionMultiplier}x porsi`
                          : ""}{" "}
                        {log.servingSize ? `(${log.servingSize})` : ""} ·{" "}
                        {log.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-[#1A202C] bg-[#FFFBEB] px-2 py-0.5 rounded-md border border-[#D97706]/20 inline-block">
                      {log.calories} kcal
                    </span>
                  </div>
                </div>

                {/* Per-food Nutrient Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2 pl-10.5">
                  <span className="text-[10px] font-semibold text-[#0284C7] bg-[#F0F9FF] px-1.5 py-0.5 rounded border border-[#0284C7]/20">
                    Prot: {log.protein ?? 0}g
                  </span>
                  <span className="text-[10px] font-semibold text-[#D97706] bg-[#FFFBEB] px-1.5 py-0.5 rounded border border-[#D97706]/20">
                    Karbo: {log.carbs ?? 0}g
                  </span>
                  <span className="text-[10px] font-semibold text-[#E11D48] bg-[#FFF1F2] px-1.5 py-0.5 rounded border border-[#E11D48]/20">
                    Lemak: {log.fat ?? 0}g
                  </span>
                  <span className="text-[10px] font-semibold text-[#7C3AED] bg-[#F5F3FF] px-1.5 py-0.5 rounded border border-[#7C3AED]/20">
                    Gula: {log.sugar ?? 0}g
                  </span>
                  <span className="text-[10px] font-semibold text-[#0D9488] bg-[#F0FDFA] px-1.5 py-0.5 rounded border border-[#0D9488]/20">
                    Na: {log.sodium ?? 0}mg
                  </span>
                  <span className="text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#059669]/20">
                    Serat: {log.fiber ?? 0}g
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
