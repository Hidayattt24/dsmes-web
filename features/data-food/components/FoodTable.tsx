"use client";

import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import type { FoodMaster } from "@/features/data-food/types/food";

interface Props {
  readonly foods: FoodMaster[];
  readonly loading: boolean;
  readonly page: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly onPageChange: (page: number) => void;
  readonly onViewDetail: (food: FoodMaster) => void;
  readonly onDeleteClick: (food: FoodMaster) => void;
  readonly onToggleStatus?: (food: FoodMaster) => void;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];
  pages.push(1);

  if (currentPage > 3) {
    pages.push("...");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("...");
  }

  pages.push(totalPages);
  return pages;
}

export function FoodTable({
  foods,
  loading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onViewDetail,
  onDeleteClick,
  onToggleStatus,
}: Props) {
  if (!loading && foods.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0] shadow-sm">
        <span className="material-symbols-outlined text-5xl text-[#A0AEC0] select-none">
          no_food
        </span>
        <h4 className="mt-3 text-base font-bold text-[#1A202C]">
          Data Makanan Tidak Ditemukan
        </h4>
        <p className="text-xs text-[#718096] mt-1">
          Coba ubah kata kunci pencarian atau tambah makanan baru.
        </p>
      </div>
    );
  }

  const skeletonRows = Array.from({ length: 10 });

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden font-[family-name:var(--font-poppins)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#4A5568]">
          <thead className="bg-[#F8FAFC] text-[#2D3748] font-bold border-b border-[#E2E8F0] uppercase text-xs tracking-wider">
            <tr>
              <th className="py-4 px-5">Nama Makanan</th>
              <th className="py-4 px-5">Produsen / Merk</th>
              <th className="py-4 px-5">Porsi</th>
              <th className="py-4 px-5 text-right">Energi (kcal)</th>
              <th className="py-4 px-5 text-right">Makronutrisi (P / K / L)</th>
              <th className="py-4 px-5 text-center">Status</th>
              <th className="py-4 px-5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {loading
              ? skeletonRows.map((_, i) => (
                  <tr key={`skel-${i}`} className="animate-pulse">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#E2E8F0] shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-3.5 w-36 bg-[#E2E8F0] rounded" />
                          <div className="h-2.5 w-20 bg-[#EDF2F7] rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="h-3 w-28 bg-[#E2E8F0] rounded" />
                    </td>
                    <td className="py-4 px-5">
                      <div className="h-6 w-24 bg-[#E2E8F0] rounded-md" />
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="h-4 w-16 bg-[#E2E8F0] rounded ml-auto" />
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex justify-end gap-1.5">
                        <div className="h-5 w-12 bg-blue-100 rounded" />
                        <div className="h-5 w-12 bg-amber-100 rounded" />
                        <div className="h-5 w-12 bg-rose-100 rounded" />
                      </div>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="h-6 w-16 bg-[#E2E8F0] rounded-full mx-auto" />
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="h-8 w-8 bg-[#E2E8F0] rounded-lg" />
                        <div className="h-8 w-8 bg-[#E2E8F0] rounded-lg" />
                        <div className="h-8 w-8 bg-[#E2E8F0] rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              : foods.map((food) => (
              <tr key={food.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="py-4 px-5 font-medium text-[#1A202C]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] text-[#3B67FC] flex items-center justify-center font-bold text-sm shrink-0 select-none">
                      {food.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm">{food.name}</span>
                        {food.source === "excel_import" ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-50 text-purple-700 font-semibold border border-purple-200 shrink-0">
                            Impor Excel
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-semibold border border-slate-200 shrink-0">
                            Manual
                          </span>
                        )}
                      </div>
                      {food.barcode && (
                        <span className="text-[11px] font-mono text-[#718096] block">
                          {food.barcode}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-5 text-[#4A5568]">{food.manufacturer || "-"}</td>
                <td className="py-4 px-5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#EDF2F7] text-[#2D3748]">
                    {food.serving_size}
                  </span>
                  <span className={`block text-[10px] font-semibold mt-0.5 ${
                    food.nutrition_basis === "UNVERIFIED"
                      ? "text-amber-600"
                      : "text-emerald-700"
                  }`}>
                    {food.nutrition_basis === "PER_SERVING"
                      ? "Per Sajian"
                      : food.nutrition_basis === "PER_PACKAGE"
                      ? "Per Kemasan"
                      : food.nutrition_basis === "UNVERIFIED"
                      ? "Perlu Verifikasi"
                      : "Per 100g"}
                  </span>
                </td>
                <td className="py-4 px-5 text-right font-extrabold text-[#3B67FC]">
                  {food.energy_kcal} kcal
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex justify-end gap-1.5 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                      P: {food.protein_g}g
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold">
                      K: {food.carbohydrate_g}g
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold">
                      L: {food.fat_g}g
                    </span>
                  </div>
                </td>
                <td className="py-4 px-5 text-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      food.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        food.status === "active" ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />
                    {food.status === "active" ? "Aktif" : "Draft"}
                  </span>
                </td>
                <td className="py-4 px-5 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {/* Toggle Active / Draft Status */}
                    <button
                      type="button"
                      onClick={() => onToggleStatus?.(food)}
                      title={
                        food.status === "active"
                          ? "Ubah ke Draft (Nonaktif)"
                          : "Aktifkan Makanan"
                      }
                      className={`w-9 h-9 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
                        food.status === "active"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          : "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl select-none">
                        {food.status === "active" ? "toggle_on" : "toggle_off"}
                      </span>
                    </button>

                    <button
                      onClick={() => onViewDetail(food)}
                      title="Lihat Detail Nutrisi"
                      className="w-9 h-9 rounded-lg border border-[#E2E8F0] bg-white text-[#4A5568] hover:text-[#3B67FC] hover:bg-[#EEF2FF] hover:border-[#3B67FC] transition-all flex items-center justify-center cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg select-none">visibility</span>
                    </button>
                    <Link
                      href={`${ROUTES.DATA_MAKANAN}/${food.id}/edit`}
                      title="Edit Makanan"
                      className="w-9 h-9 rounded-lg border border-[#E2E8F0] bg-white text-[#4A5568] hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all flex items-center justify-center cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg select-none">edit</span>
                    </Link>
                    <button
                      onClick={() => onDeleteClick(food)}
                      title="Hapus Makanan"
                      className="w-9 h-9 rounded-lg border border-[#E2E8F0] bg-white text-[#4A5568] hover:text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all flex items-center justify-center cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg select-none">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-5 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-medium text-[#718096]">
            Menampilkan halaman <span className="font-bold text-[#1A202C]">{page}</span> dari{" "}
            <span className="font-bold text-[#1A202C]">{totalPages}</span> ({totalItems} total data)
          </p>

          {/* Numbered Page Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-white text-[#4A5568] hover:bg-[#EDF2F7] text-xs font-bold disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base select-none">chevron_left</span>
              Sebelumnya
            </button>

            {getPageNumbers(page, totalPages).map((p, idx) =>
              p === "..." ? (
                <span key={`dots-${idx}`} className="px-2 text-xs font-bold text-[#A0AEC0]">
                  ...
                </span>
              ) : (
                <button
                  key={`page-${p}`}
                  onClick={() => onPageChange(Number(p))}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                    page === p
                      ? "bg-[#3B67FC] text-white shadow-xs"
                      : "bg-white border border-[#E2E8F0] text-[#4A5568] hover:bg-[#EDF2F7]"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-white text-[#4A5568] hover:bg-[#EDF2F7] text-xs font-bold disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1"
            >
              Selanjutnya
              <span className="material-symbols-outlined text-base select-none">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
