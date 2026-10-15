"use client";

import type { PatientActivityAnalyticsResponse } from "../types/record";
import { Select } from "@/components/ui/Select";

interface PatientActivityAnalyticsCardProps {
  readonly analytics: PatientActivityAnalyticsResponse | null;
  readonly selectedDays?: number;
  readonly onDaysChange?: (days: number) => void;
  readonly isLoading?: boolean;
}

const periodOptions = [
  { value: "7", label: "7 Hari Terakhir" },
  { value: "30", label: "30 Hari Terakhir" },
  { value: "0", label: "Semua Waktu" },
] as const;

export function PatientActivityAnalyticsCard({
  analytics,
  selectedDays = 7,
  onDaysChange,
}: PatientActivityAnalyticsCardProps) {
  const data = analytics ?? {
    totalRecords: 0,
    bloodSugar: { count: 0, percentage: 0 },
    food: { count: 0, percentage: 0 },
    physicalActivity: { count: 0, percentage: 0 },
    medication: { count: 0, percentage: 0 },
    mostUsed: "-",
    leastUsed: "-",
  };

  const {
    totalRecords,
    bloodSugar,
    food,
    physicalActivity,
    medication,
    mostUsed,
    leastUsed,
  } = data;

  // Donut chart calculations (circumference 251.2 for r=40)
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.327

  const items = [
    { label: "Gula Darah", count: bloodSugar.count, pct: bloodSugar.percentage, color: "#3B67FC", bg: "bg-[#3B67FC]", icon: "water_drop" },
    { label: "Asupan Makanan", count: food.count, pct: food.percentage, color: "#B45309", bg: "bg-[#B45309]", icon: "restaurant" },
    { label: "Aktivitas Fisik", count: physicalActivity.count, pct: physicalActivity.percentage, color: "#166534", bg: "bg-[#166534]", icon: "directions_run" },
    { label: "Kepatuhan Obat", count: medication.count, pct: medication.percentage, color: "#2B6CB0", bg: "bg-[#2B6CB0]", icon: "medication" },
  ];

  // Calculate SVG stroke offsets for Donut chart
  let accumulatedPct = 0;
  const donutSlices = items.map((item) => {
    const dashArray = `${(item.pct / 100) * circumference} ${circumference}`;
    const dashOffset = -((accumulatedPct / 100) * circumference);
    accumulatedPct += item.pct;
    return { ...item, dashArray, dashOffset };
  });

  return (
    <div className="premium-card p-6 sm:p-8 space-y-6 font-[family-name:var(--font-poppins)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h3 className="text-lg font-bold text-[#1A202C] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3B67FC]">analytics</span>
            Analisis Keaktifan Kesehatan Pasien
          </h3>
          <p className="text-xs text-[#718096] mt-0.5">
            Ringkasan akurat frekuensi penggunaan dan proporsi aktivitas pengelolaan mandiri diabetes pasien.
          </p>
        </div>
        <div className="w-44 shrink-0">
          <Select
            value={String(selectedDays)}
            onChange={(val) => onDaysChange?.(parseInt(val))}
            options={periodOptions}
          />
        </div>
      </div>

      {/* Top 3 Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#3B67FC]/10 text-[#3B67FC] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[20px]">equalizer</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#718096] uppercase tracking-wider">Total Catatan</p>
            <p className="text-lg font-extrabold text-[#1A202C]">{totalRecords.toLocaleString("id-ID")}</p>
          </div>
        </div>

        <div className="bg-[#F0FDF4] p-4 rounded-xl border border-green-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-200/60 text-green-800 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[20px]">trending_up</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-green-700 uppercase tracking-wider">Paling Sering</p>
            <p className="text-sm font-extrabold text-green-900 truncate">{mostUsed}</p>
          </div>
        </div>

        <div className="bg-[#FFF5F5] p-4 rounded-xl border border-red-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-200/60 text-red-800 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[20px]">trending_down</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Paling Jarang</p>
            <p className="text-sm font-extrabold text-red-900 truncate">{leastUsed}</p>
          </div>
        </div>
      </div>

      {/* Main Analytics Content: Donut Chart + Progress Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
        {/* Left: Donut Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#F1F5F9"
                strokeWidth="12"
              />
              {/* Donut Slices */}
              {totalRecords > 0 &&
                donutSlices.map((slice, i) => (
                  <circle
                    key={i}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth="12"
                    strokeDasharray={slice.dashArray}
                    strokeDashoffset={slice.dashOffset}
                    className="transition-all duration-700 ease-out"
                  />
                ))}
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold text-[#1A202C] leading-none">
                {totalRecords}
              </span>
              <span className="text-[11px] font-semibold text-[#718096] mt-1">Total Catatan</span>
            </div>
          </div>
        </div>

        {/* Right: Detailed Progress Bars */}
        <div className="lg:col-span-7 space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#1A202C] flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.bg}`}></span>
                  <span className="material-symbols-outlined text-[16px] text-[#718096]">{item.icon}</span>
                  {item.label}
                </span>
                <span className="font-bold text-[#4A5568]">
                  {item.count} catatan ({item.pct.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${totalRecords > 0 ? item.pct : 0}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
