"use client";

import Link from "next/link";
import type { SurveyListItem } from "@/types/survey";

interface SurveyTableProps {
  readonly items: readonly SurveyListItem[];
  readonly total: number;
  readonly isStaff?: boolean;
  readonly onDeleteClick?: (id: string) => void;
  readonly onToggleActiveClick?: (survey: SurveyListItem) => void;
}

export function SurveyTable({
  items,
  total,
  isStaff = false,
  onDeleteClick,
  onToggleActiveClick,
}: SurveyTableProps) {
  const basePath = isStaff ? "/staff/survey" : "/admin/survey";

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden font-[family-name:var(--font-poppins)]">
      {/* Table Header */}
      <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
        <div>
          <h3 className="text-base font-bold text-[#1A202C]">Daftar Survey Penelitian</h3>
          <p className="text-xs text-[#718096]">
            Instrumen Kepuasan Pengguna & System Usability Scale (SUS)
          </p>
        </div>
        <span className="text-xs font-semibold text-[#00695C] bg-[#F0F9F8] px-3 py-1.5 rounded-full border border-[#00695C]/15">
          Total: {total} Survey
        </span>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-white text-xs font-bold text-[#718096] uppercase tracking-wider">
              <th className="py-4 px-6 font-semibold">Judul Survey</th>
              <th className="py-4 px-6 font-semibold">Tipe Instrumen</th>
              <th className="py-4 px-6 font-semibold text-center">Jumlah Pertanyaan</th>
              <th className="py-4 px-6 font-semibold text-center">Jumlah Responden</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium text-[#1A202C] divide-y divide-[#E2E8F0]/60">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 px-6 text-center text-[#718096]">
                  <div className="flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-[40px] text-[#A0AEC0] mb-2">
                      assignment_late
                    </span>
                    <p className="font-semibold text-sm text-[#4A5568]">Tidak ada survey ditemukan.</p>
                    <p className="text-xs text-[#718096] mt-1">Coba ubah kata kunci pencarian atau filter status.</p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((survey) => {
                const isSUS = survey.type === "SUS";
                return (
                  <tr key={survey.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Judul Survey */}
                    <td className="py-4 px-6">
                      <Link
                        href={`${basePath}/${survey.id}`}
                        className="font-bold text-[#00695C] hover:underline block max-w-md line-clamp-1"
                      >
                        {survey.title}
                      </Link>
                      {survey.description && (
                        <p className="text-xs text-[#718096] line-clamp-1 mt-0.5 font-normal">
                          {survey.description}
                        </p>
                      )}
                    </td>

                    {/* Tipe Instrumen */}
                    <td className="py-4 px-6">
                      <span
                        className={[
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border",
                          isSUS
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200",
                        ].join(" ")}
                      >
                        {isSUS ? "SUS (Usability)" : "Kepuasan Pengguna"}
                      </span>
                    </td>

                    {/* Jumlah Pertanyaan */}
                    <td className="py-4 px-6 text-center font-bold text-[#2D3748]">
                      {survey.question_count} Soal
                    </td>

                    {/* Jumlah Responden */}
                    <td className="py-4 px-6 text-center font-bold text-[#00695C]">
                      {survey.response_count} Peserta
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={[
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border",
                            survey.is_active && survey.status === "published"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200",
                          ].join(" ")}
                        >
                          {survey.is_active && survey.status === "published" ? "Aktif" : "Draft"}
                        </span>
                        {survey.is_active && survey.status === "published" && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Aktif di Mobile" />
                        )}
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end items-center gap-1.5 text-[#718096]">
                        {/* Detail */}
                        <Link
                          href={`${basePath}/${survey.id}`}
                          className="p-2 hover:text-[#00695C] hover:bg-[#00695C]/10 rounded-lg transition-colors flex items-center"
                          title="Lihat Detail & Pertanyaan"
                        >
                          <span className="material-symbols-outlined text-[20px] select-none">
                            visibility
                          </span>
                        </Link>

                        {/* Analytics */}
                        <Link
                          href={`${basePath}/${survey.id}/analytics`}
                          className="p-2 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center"
                          title="Lihat Analitik & Respons"
                        >
                          <span className="material-symbols-outlined text-[20px] select-none">
                            analytics
                          </span>
                        </Link>

                        {!isStaff && (
                          <>
                            {/* Toggle Active */}
                            <button
                              type="button"
                              onClick={() => onToggleActiveClick?.(survey)}
                              className={`p-2 rounded-lg transition-colors flex items-center cursor-pointer ${
                                survey.is_active
                                  ? "text-emerald-600 hover:bg-emerald-50"
                                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                              }`}
                              title={survey.is_active ? "Nonaktifkan di App Mobile" : "Aktifkan di App Mobile"}
                            >
                              <span className="material-symbols-outlined text-[20px] select-none">
                                {survey.is_active ? "toggle_on" : "toggle_off"}
                              </span>
                            </button>

                            {/* Edit */}
                            <Link
                              href={`/admin/survey/${survey.id}/edit`}
                              className="p-2 hover:text-[#B45309] hover:bg-[#B45309]/10 rounded-lg transition-colors flex items-center"
                              title="Edit Survey"
                            >
                              <span className="material-symbols-outlined text-[20px] select-none">
                                edit
                              </span>
                            </Link>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => onDeleteClick?.(survey.id)}
                              className="p-2 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center cursor-pointer"
                              title="Hapus Survey"
                            >
                              <span className="material-symbols-outlined text-[20px] select-none">
                                delete
                              </span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
