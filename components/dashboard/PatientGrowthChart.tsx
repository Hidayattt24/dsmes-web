"use client";

import type { PatientGrowthDataPoint } from "@/types/dashboard";
import { Select } from "@/components/ui/Select";

interface PatientGrowthChartProps {
  readonly data:         PatientGrowthDataPoint[];
  readonly selectedYear: number;
  readonly onYearChange: (year: number) => void;
}

const YEAR_OPTIONS = [2024, 2023] as const;

const yearSelectOptions = YEAR_OPTIONS.map((y) => ({
  value: String(y),
  label: `Tahun ${y}`,
}));

export function PatientGrowthChart({
  data,
  selectedYear,
  onYearChange,
}: PatientGrowthChartProps) {
  return (
    <div className="premium-card p-8 h-full">
      {/* Chart header */}
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-lg font-bold text-[#1A202C] font-[family-name:var(--font-poppins)]">
          Pertumbuhan Pasien Baru
        </h3>
        <div className="w-32">
          <Select
            value={String(selectedYear)}
            onChange={(val) => onYearChange(Number(val))}
            options={yearSelectOptions}
            placeholder="Tahun"
          />
        </div>
      </div>

      {/* Bars */}
      <div className="grid grid-cols-12 gap-2 h-48 items-end px-1">
        {data.map((point) => (
          <div
            key={point.month}
            title={`${point.month}: ${point.value}`}
            className={[
              "col-span-1 rounded-t-md transition-all duration-300",
              point.isCurrent
                ? "bg-[#3B67FC]"
                : point.value > 5
                ? "bg-[#EEF2FF] hover:bg-[#3B67FC]/30"
                : "bg-[#F4F6F8]",
            ].join(" ")}
            style={{ height: `${Math.max(point.heightPercent, 3)}%` }}
          />
        ))}
      </div>

      {/* Month labels */}
      <div className="grid grid-cols-12 gap-2 mt-6 text-[10px] font-bold text-[#718096] text-center uppercase tracking-tighter font-[family-name:var(--font-poppins)]">
        {data.map((point) => (
          <span
            key={point.month}
            className={`col-span-1 ${point.isCurrent ? "text-[#3B67FC]" : ""}`}
          >
            {point.month}
          </span>
        ))}
      </div>
    </div>
  );
}
