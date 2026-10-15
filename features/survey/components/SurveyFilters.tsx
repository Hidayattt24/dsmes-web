"use client";

import { Select } from "@/components/ui/Select";

export type SurveySortBy = "newest" | "oldest" | "title";

interface SurveyFiltersProps {
  readonly searchQuery: string;
  readonly filterType: string;
  readonly filterStatus: string;
  readonly sortBy: SurveySortBy;
  readonly onSearchChange: (val: string) => void;
  readonly onTypeChange: (val: string) => void;
  readonly onStatusChange: (val: string) => void;
  readonly onSortChange: (val: SurveySortBy) => void;
}

const typeOptions = [
  { value: "ALL", label: "Semua Tipe" },
  { value: "USER_SATISFACTION", label: "Kepuasan Pengguna" },
  { value: "SUS", label: "System Usability Scale (SUS)" },
] as const;

const statusOptions = [
  { value: "ALL", label: "Semua Status" },
  { value: "published", label: "Aktif" },
  { value: "draft", label: "Draft" },
] as const;

const sortOptions = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "title", label: "A-Z" },
] as const;

export function SurveyFilters({
  searchQuery,
  filterType,
  filterStatus,
  sortBy,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onSortChange,
}: SurveyFiltersProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row gap-4 items-center w-full font-[family-name:var(--font-poppins)]">
      {/* Search Input */}
      <div className="flex-1 w-full relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#718096] select-none">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari Judul atau Deskripsi Survey..."
          className="w-full bg-[#F4F6F8]/60 border border-[#E2E8F0] rounded-xl py-3 pl-11 pr-4 text-sm focus:border-[#3B67FC] focus:ring-1 focus:ring-[#3B67FC] outline-none transition-all font-medium text-[#1A202C] placeholder:text-[#718096] h-12"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0AEC0] hover:text-[#4A5568]"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {/* Type Filter */}
      <div className="w-full sm:w-56">
        <Select
          value={filterType}
          options={typeOptions}
          onChange={onTypeChange}
          placeholder="Pilih Tipe"
          icon="category"
        />
      </div>

      {/* Status Filter */}
      <div className="w-full sm:w-48">
        <Select
          value={filterStatus}
          options={statusOptions}
          onChange={onStatusChange}
          placeholder="Pilih Status"
          icon="filter_alt"
        />
      </div>

      {/* Sort By */}
      <div className="w-full sm:w-44">
        <Select
          value={sortBy}
          options={sortOptions}
          onChange={(v) => onSortChange(v as SurveySortBy)}
          placeholder="Urutkan"
          icon="sort"
        />
      </div>
    </div>
  );
}
