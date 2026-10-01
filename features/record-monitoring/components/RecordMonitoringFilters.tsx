"use client";

import { Select } from "@/components/ui/Select";

interface RecordMonitoringFiltersProps {
  readonly searchQuery: string;
  readonly complianceFilter: string;
  readonly riskFilter: string;
  readonly genderFilter: string;
  readonly onSearchChange: (val: string) => void;
  readonly onComplianceChange: (val: string) => void;
  readonly onRiskChange: (val: string) => void;
  readonly onGenderChange: (val: string) => void;
}

const genderOptions = [
  { value: "Semua", label: "Semua Gender" },
  { value: "Laki-laki", label: "Laki-laki" },
  { value: "Perempuan", label: "Perempuan" },
] as const;

const complianceOptions = [
  { value: "Semua", label: "Semua Kepatuhan" },
  { value: "Patuh", label: "Patuh (≥70%)" },
  { value: "Kurang Patuh", label: "Kurang Patuh (40-69%)" },
  { value: "Tidak Patuh", label: "Tidak Patuh (<40%)" },
] as const;

const riskOptions = [
  { value: "Semua", label: "Semua Tingkat Risiko" },
  { value: "Rendah", label: "Risiko Rendah" },
  { value: "Sedang", label: "Risiko Sedang" },
  { value: "Tinggi", label: "Risiko Tinggi" },
  { value: "Sangat Tinggi", label: "Risiko Sangat Tinggi" },
] as const;

export function RecordMonitoringFilters({
  searchQuery,
  complianceFilter,
  riskFilter,
  genderFilter,
  onSearchChange,
  onComplianceChange,
  onRiskChange,
  onGenderChange,
}: RecordMonitoringFiltersProps) {
  return (
    <div className="premium-card p-5 flex flex-col md:flex-row gap-4 items-center w-full font-[family-name:var(--font-poppins)]">
      <div className="flex-1 w-full relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#718096]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari Pasien..."
          className="w-full bg-[#F4F6F8]/60 border border-[#E2E8F0] rounded-xl py-3 pl-11 pr-4 text-sm focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C] outline-none transition-all font-medium text-[#1A202C] placeholder:text-[#718096] h-12"
        />
      </div>

      <div className="w-full md:w-44">
        <Select
          value={genderFilter}
          onChange={onGenderChange}
          options={genderOptions}
          placeholder="Gender"
        />
      </div>

      <div className="w-full md:w-52">
        <Select
          value={complianceFilter}
          onChange={onComplianceChange}
          options={complianceOptions}
          placeholder="Status Kepatuhan"
        />
      </div>

      <div className="w-full md:w-48">
        <Select
          value={riskFilter}
          onChange={onRiskChange}
          options={riskOptions}
          placeholder="Level Risiko"
        />
      </div>
    </div>
  );
}
