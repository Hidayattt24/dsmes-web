"use client";

import { useEducationList } from "../hooks/useEducationList";
import { EducationStatistics } from "./EducationStatistics";
import { EducationTable } from "./EducationTable";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Select } from "@/components/ui/Select";

const statusOptions = [
  { value: "Semua", label: "Semua Status" },
  { value: "Diterbitkan", label: "Diterbitkan" },
  { value: "Draf", label: "Draf" },
] as const;

export function EducationListFeature() {
  const {
    articles,
    stats,
    isLoading,
    searchQuery,
    categoryFilter,
    statusFilter,
    currentPage,
    totalCount,
    totalPages,
    startItem,
    endItem,
    categoriesList,
    setSearchQuery,
    setCategoryFilter,
    setStatusFilter,
    setCurrentPage,
    deleteArticle,
  } = useEducationList();

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const categoryOptions = categoriesList.map((cat) => ({
    value: cat,
    label: cat === "Semua" ? "Semua Kategori" : cat,
  }));

  return (
    <section className="space-y-8 max-w-[1600px] mx-auto w-full">
      {/* Header and Add CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A202C] tracking-tight font-[family-name:var(--font-poppins)]">
            Manajemen Edukasi
          </h2>
          <p className="text-sm text-[#718096] mt-1 font-[family-name:var(--font-poppins)]">
            Kelola artikel, modul, dan materi edukasi digital bagi pasien.
          </p>
        </div>

        <Link
          href={`${ROUTES.MANAJEMEN_EDUKASI}/tambah`}
          className="flex items-center gap-2 bg-[#0F766E] hover:bg-[#0D6E66] text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-md shadow-[#0F766E]/10"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Tambah Edukasi</span>
        </Link>
      </div>

      {/* Summary Statistics */}
      <EducationStatistics stats={stats} />

      {/* Search and Filters bar */}
      <div className="premium-card p-5 flex flex-col md:flex-row gap-4 items-center w-full">
        {/* Search */}
        <div className="flex-1 w-full relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#718096] select-none text-xl">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul, ringkasan, atau pembuat..."
            className="w-full bg-[#F4F6F8]/60 border border-[#E2E8F0] rounded-xl py-3 pl-11 pr-4 text-sm focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] outline-none transition-all font-medium text-[#1A202C] placeholder:text-[#718096] h-12 font-[family-name:var(--font-poppins)]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
          {/* Category Filter */}
          <div className="w-full sm:w-48">
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categoryOptions}
              placeholder="Kategori"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-40">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              placeholder="Status"
            />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="premium-card overflow-hidden">
        <EducationTable articles={articles} loading={isLoading} onDelete={deleteArticle} />

        {/* Pagination footer */}
        {!isLoading && totalCount > 0 && (
          <div className="px-8 py-6 border-t border-[#E2E8F0]/50 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#718096] font-medium font-[family-name:var(--font-poppins)]">
              Menampilkan{" "}
              <span className="text-[#1A202C] font-bold">{startItem}-{endItem}</span> dari{" "}
              <span className="text-[#1A202C] font-bold">
                {totalCount}
              </span>{" "}
              artikel
            </p>

            <div className="flex items-center gap-1.5">
              {/* Prev button */}
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center border border-[#E2E8F0] rounded-lg hover:bg-[#F4F6F8] transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>

              {/* Page numbers */}
              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={[
                    "w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer",
                    currentPage === num
                      ? "bg-[#0F766E] text-white shadow-sm shadow-[#0F766E]/20"
                      : "hover:bg-[#F4F6F8] text-[#718096] font-semibold",
                  ].join(" ")}
                >
                  {num}
                </button>
              ))}

              {/* Next button */}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center border border-[#E2E8F0] rounded-lg hover:bg-[#F4F6F8] transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
