"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { ExcelImportPreviewResponse, CreateFoodDTO, ExcelImportRow } from "@/features/data-food/types/food";
import { Portal } from "@/components/ui/Portal";

interface Props {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly preview: ExcelImportPreviewResponse | null;
  readonly importing: boolean;
  readonly onPreview: (file: File) => Promise<void>;
  readonly onConfirm: (items: CreateFoodDTO[]) => Promise<void>;
  readonly onReset: () => void;
}

export function FoodImportModal({
  isOpen,
  onClose,
  preview,
  importing,
  onPreview,
  onConfirm,
  onReset,
}: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterTab, setFilterTab] = useState<"all" | "valid" | "invalid">("all");
  const [activeRows, setActiveRows] = useState<ExcelImportRow[]>([]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Update active rows when preview changes
  React.useEffect(() => {
    if (preview?.rows) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveRows(preview.rows);
    } else {
      setActiveRows([]);
    }
  }, [preview]);

  const filteredRows = useMemo(() => {
    return activeRows.filter((r) => {
      const matchSearch =
        !searchQuery ||
        r.data.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.data.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;

      if (filterTab === "valid") return r.is_valid;
      if (filterTab === "invalid") return !r.is_valid;
      return true;
    });
  }, [activeRows, searchQuery, filterTab]);

  const validCount = useMemo(() => activeRows.filter((r) => r.is_valid).length, [activeRows]);
  const invalidCount = useMemo(() => activeRows.filter((r) => !r.is_valid).length, [activeRows]);

  if (!isOpen) return null;

  const handleFileChange = async (file: File) => {
    if (!file.name.match(/\.(xlsx|csv)$/i)) {
      setErrorMessage("Format file harus berupa Excel (.xlsx) atau CSV (.csv)");
      return;
    }
    setSelectedFile(file);
    setErrorMessage(null);
    try {
      await onPreview(file);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMessage(error.response?.data?.message || error.message || "Gagal memproses file Excel");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveRow = (rowIndex: number) => {
    setActiveRows((prev) => prev.filter((r) => r.row_index !== rowIndex));
  };

  const handleRemoveAllInvalid = () => {
    setActiveRows((prev) => prev.filter((r) => r.is_valid));
  };

  const handleConfirmImport = async () => {
    const validItems = activeRows.filter((r) => r.is_valid).map((r) => r.data);
    if (validItems.length === 0) {
      setErrorMessage("Tidak ada data valid yang dapat diimpor");
      return;
    }
    try {
      await onConfirm(validItems);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMessage(error.response?.data?.message || error.message || "Gagal melakukan impor data");
    }
  };

  const handleModalClose = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    setSearchQuery("");
    setFilterTab("all");
    onReset();
    onClose();
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-[9000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-[family-name:var(--font-poppins)]">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-[#E2E8F0] max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F0FF] text-[#3B67FC] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl select-none">file_upload</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1A202C]">
                Impor Data Excel Makanan
              </h3>
              <p className="text-xs font-medium text-[#718096]">
                Pratinjau, verifikasi validasi kolom, dan filter data sebelum disimpan ke database
              </p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="p-2 rounded-full text-[#A0AEC0] hover:text-[#1A202C] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl select-none">close</span>
          </button>
        </div>

        <div className="py-4 overflow-y-auto flex-1 space-y-4">
          {!preview && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                dragOver
                  ? "border-[#3B67FC] bg-[#EEF2FF]"
                  : "border-[#E2E8F0] bg-[#F8FAFC]"
              }`}
            >
              <span className="material-symbols-outlined text-5xl text-[#3B67FC] mb-2 select-none">
                cloud_upload
              </span>
              <h4 className="text-base font-bold text-[#1A202C]">
                Pilih atau Tarik File Excel (.xlsx / .csv)
              </h4>
              <p className="text-xs text-[#718096] mt-1 max-w-md mx-auto">
                Kolom wajib: name/nama, manufacturer/produsen, serving_size/porsi. Nilai nutrisi otomatis dikonversi ke format desimal.
              </p>
              <label className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-[#3B67FC] hover:bg-[#1A63ED] text-white text-xs font-bold cursor-pointer shadow-sm transition-all">
                <span className="material-symbols-outlined text-base select-none">file_open</span>
                Pilih File Komputer
                <input
                  type="file"
                  accept=".xlsx,.csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <span className="material-symbols-outlined text-lg shrink-0 select-none">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {importing && (
            <div className="py-12 text-center">
              <span className="material-symbols-outlined text-4xl text-[#3B67FC] animate-spin select-none">
                progress_activity
              </span>
              <p className="text-sm font-medium text-[#718096] mt-2">
                Memproses dan memvalidasi file Excel...
              </p>
            </div>
          )}

          {preview && !importing && (
            <div className="space-y-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0] text-center">
                  <span className="text-xs text-[#718096] uppercase font-bold">Total Baris</span>
                  <p className="text-xl font-bold text-[#1A202C] mt-0.5">
                    {activeRows.length}
                  </p>
                </div>
                <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-center">
                  <span className="text-xs text-emerald-700 uppercase font-bold">
                    Valid (Siap Impor)
                  </span>
                  <p className="text-xl font-bold text-emerald-700 mt-0.5">
                    {validCount}
                  </p>
                </div>
                <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-200 text-center">
                  <span className="text-xs text-rose-700 uppercase font-bold">
                    Ditolak / Invalid
                  </span>
                  <p className="text-xl font-bold text-rose-700 mt-0.5">
                    {invalidCount}
                  </p>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#718096] text-lg select-none">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari dalam pratinjau..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#1A202C] focus:outline-none focus:ring-1 focus:ring-[#3B67FC] focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0]">
                    <button
                      onClick={() => setFilterTab("all")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        filterTab === "all"
                          ? "bg-white text-[#1A202C] shadow-xs"
                          : "text-[#718096] hover:text-[#1A202C]"
                      }`}
                    >
                      Semua ({activeRows.length})
                    </button>
                    <button
                      onClick={() => setFilterTab("valid")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        filterTab === "valid"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "text-emerald-700 hover:bg-emerald-50"
                      }`}
                    >
                      Valid ({validCount})
                    </button>
                    <button
                      onClick={() => setFilterTab("invalid")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        filterTab === "invalid"
                          ? "bg-rose-600 text-white shadow-xs"
                          : "text-rose-700 hover:bg-rose-50"
                      }`}
                    >
                      Invalid ({invalidCount})
                    </button>
                  </div>

                  {invalidCount > 0 && (
                    <button
                      onClick={handleRemoveAllInvalid}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-all cursor-pointer shrink-0"
                    >
                      Bersihkan Invalid
                    </button>
                  )}
                </div>
              </div>

              {/* Data Table */}
              <div className="border border-[#E2E8F0] rounded-xl overflow-x-auto overflow-y-auto max-h-80">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-[#F8FAFC] sticky top-0 font-bold text-[#2D3748] uppercase border-b border-[#E2E8F0]">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Nama Makanan</th>
                      <th className="py-2.5 px-3">Produsen / Merk</th>
                      <th className="py-2.5 px-3">Basis Nilai Gizi</th>
                      <th className="py-2.5 px-3 text-right">Energi (kcal)</th>
                      <th className="py-2.5 px-3 text-right">Protein (g)</th>
                      <th className="py-2.5 px-3 text-right">Karbohidrat (g)</th>
                      <th className="py-2.5 px-3 text-right">Lemak Total (g)</th>
                      <th className="py-2.5 px-3 text-right">Gula (g)</th>
                      <th className="py-2.5 px-3 text-right">Natrium (mg)</th>
                      <th className="py-2.5 px-3 text-right">Serat (g)</th>
                      <th className="py-2.5 px-3 text-right">Lemak Jenuh (g)</th>
                      <th className="py-2.5 px-3">Barcode</th>
                      <th className="py-2.5 px-3 text-center">Status Validasi</th>
                      <th className="py-2.5 px-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {filteredRows.map((row) => (
                      <tr
                        key={row.row_index}
                        className={
                          row.is_valid
                            ? "hover:bg-[#F8FAFC]"
                            : "bg-rose-50/70 text-rose-900"
                        }
                      >
                        <td className="py-2 px-3 font-mono text-[#718096]">#{row.row_index}</td>
                        <td className="py-2 px-3 font-bold text-[#1A202C]">{row.data.name || "-"}</td>
                        <td className="py-2 px-3 text-[#4A5568]">{row.data.manufacturer || "-"}</td>
                        <td className="py-2 px-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                            row.data.nutrition_basis === 'PER_PACKAGE'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : row.data.nutrition_basis === 'PER_SERVING'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : row.data.nutrition_basis === 'UNVERIFIED'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            <span className="material-symbols-outlined text-sm select-none">
                              {row.data.nutrition_basis === 'PER_PACKAGE'
                                ? 'inventory_2'
                                : row.data.nutrition_basis === 'PER_SERVING'
                                ? 'restaurant'
                                : row.data.nutrition_basis === 'UNVERIFIED'
                                ? 'help_outline'
                                : 'scale'}
                            </span>
                            {row.data.nutrition_basis === 'PER_PACKAGE'
                              ? 'Per Kemasan'
                              : row.data.nutrition_basis === 'PER_SERVING'
                              ? 'Per Sajian'
                              : row.data.nutrition_basis === 'UNVERIFIED'
                              ? 'Perlu Verifikasi'
                              : 'Per 100g'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-[#3B67FC]">{row.data.energy_kcal}</td>
                        <td className="py-2 px-3 text-right font-mono">{row.data.protein_g}</td>
                        <td className="py-2 px-3 text-right font-mono">{row.data.carbohydrate_g}</td>
                        <td className="py-2 px-3 text-right font-mono">{row.data.fat_g}</td>
                        <td className="py-2 px-3 text-right font-mono">{row.data.sugar_g || 0}</td>
                        <td className="py-2 px-3 text-right font-mono">{row.data.sodium_mg || 0}</td>
                        <td className="py-2 px-3 text-right font-mono">{row.data.fiber_g || 0}</td>
                        <td className="py-2 px-3 text-right font-mono">{row.data.saturated_fat_g || 0}</td>
                        <td className="py-2 px-3 font-mono text-[#718096]">{row.data.barcode || "-"}</td>
                        <td className="py-2 px-3 text-center">
                          {row.is_valid ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                              <span className="material-symbols-outlined text-base select-none">
                                check_circle
                              </span>
                              Valid
                            </span>
                          ) : (
                            <div className="text-left text-rose-600">
                              <span className="font-bold block">Ditolak:</span>
                              <ul className="list-disc list-inside text-[11px]">
                                {row.errors.map((err, ei) => (
                                  <li key={ei}>{err}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => handleRemoveRow(row.row_index)}
                            title="Hapus baris ini dari impor"
                            className="p-1 rounded-md text-[#718096] hover:text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base select-none">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0] shrink-0">
          <div>
            {preview && (
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  onReset();
                }}
                className="text-xs text-[#3B67FC] font-bold hover:underline cursor-pointer"
              >
                &larr; Unggah File Lain
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleModalClose}
              className="h-11 px-5 rounded-xl border border-[#E2E8F0] bg-white text-[#4A5568] hover:bg-[#F8FAFC] text-sm font-bold transition-all cursor-pointer"
            >
              Batal
            </button>
            {preview && validCount > 0 && (
              <button
                type="button"
                disabled={importing}
                onClick={handleConfirmImport}
                className="h-11 px-6 rounded-xl bg-[#3B67FC] hover:bg-[#1A63ED] text-white text-sm font-bold shadow-sm transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {importing && (
                  <span className="material-symbols-outlined text-lg animate-spin select-none">
                    progress_activity
                  </span>
                )}
                Konfirmasi Impor ({validCount} Data Valid)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </Portal>
  );
}
