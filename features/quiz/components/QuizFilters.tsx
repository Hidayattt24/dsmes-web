import { Select } from "@/components/ui/Select";
import type { QuestionnaireScope, QuizSortBy } from "../types/quiz";

interface QuizFiltersProps {
  readonly searchQuery: string;
  readonly filterType: "Semua" | "PRE_TEST" | "POST_TEST";
  readonly filterScope: "Semua" | QuestionnaireScope;
  readonly filterStatus: "Semua" | "Aktif" | "Draft" | "Nonaktif";
  readonly sortBy: QuizSortBy;
  readonly onSearchChange: (val: string) => void;
  readonly onTypeChange: (val: "Semua" | "PRE_TEST" | "POST_TEST") => void;
  readonly onScopeChange: (val: "Semua" | QuestionnaireScope) => void;
  readonly onStatusChange: (val: "Semua" | "Aktif" | "Draft" | "Nonaktif") => void;
  readonly onSortChange: (val: QuizSortBy) => void;
}

const typeOptions = [
  { value: "Semua", label: "Semua Tahap" },
  { value: "PRE_TEST", label: "Sebelum (Pre-Test)" },
  { value: "POST_TEST", label: "Sesudah (Post-Test)" },
] as const;

const scopeOptions = [
  { value: "Semua", label: "Semua Ranah" },
  { value: "APPLICATION", label: "Aplikasi" },
  { value: "EDUCATION", label: "Edukasi" },
] as const;

const statusOptions = [
  { value: "Semua", label: "Semua Status" },
  { value: "Aktif", label: "Aktif" },
  { value: "Draft", label: "Draft" },
  { value: "Nonaktif", label: "Nonaktif" },
] as const;

const sortOptions = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "title", label: "A-Z" },
] as const;

export function QuizFilters({
  searchQuery,
  filterType,
  filterScope,
  filterStatus,
  sortBy,
  onSearchChange,
  onTypeChange,
  onScopeChange,
  onStatusChange,
  onSortChange,
}: QuizFiltersProps) {
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
          placeholder="Cari Judul atau Deskripsi Kuesioner..."
          className="w-full bg-[#F4F6F8]/60 border border-[#E2E8F0] rounded-xl py-3 pl-11 pr-4 text-sm focus:border-[#3B67FC] focus:ring-1 focus:ring-[#3B67FC] outline-none transition-all font-medium text-[#1A202C] placeholder:text-[#718096] h-12"
        />
      </div>

      {/* Scope Filter */}
      <div className="w-full sm:w-44">
        <Select
          value={filterScope}
          onChange={(val) => onScopeChange(val as "Semua" | QuestionnaireScope)}
          options={scopeOptions}
          placeholder="Ranah"
        />
      </div>

      {/* Stage Filter */}
      <div className="w-full sm:w-44">
        <Select
          value={filterType}
          onChange={(val) => onTypeChange(val as "Semua" | "PRE_TEST" | "POST_TEST")}
          options={typeOptions}
          placeholder="Tahap"
        />
      </div>

      {/* Status Filter */}
      <div className="w-full sm:w-44">
        <Select
          value={filterStatus}
          onChange={(val) => onStatusChange(val as "Semua" | "Aktif" | "Draft" | "Nonaktif")}
          options={statusOptions}
          placeholder="Status"
        />
      </div>

      {/* Sort By */}
      <div className="w-full sm:w-44">
        <Select
          value={sortBy}
          onChange={(val) => onSortChange(val as QuizSortBy)}
          options={sortOptions}
          placeholder="Urutkan"
        />
      </div>
    </div>
  );
}
