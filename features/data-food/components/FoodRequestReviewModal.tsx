"use client";

import React, { useState, useEffect } from "react";
import type { FoodRequest, ApproveFoodProposalDTO } from "@/features/data-food/types/food";
import { Portal } from "@/components/ui/Portal";

interface Props {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly request: FoodRequest | null;
  readonly onApprove: (id: string, data: ApproveFoodProposalDTO) => Promise<void>;
}

export function FoodRequestReviewModal({
  isOpen,
  onClose,
  request,
  onApprove,
}: Props) {
  const [formData, setFormData] = useState<ApproveFoodProposalDTO>({
    name: "",
    manufacturer: "",
    serving_size: "1 porsi",
    energy_kcal: 0,
    protein_g: 0,
    carbohydrate_g: 0,
    fat_g: 0,
    sugar_g: 0,
    sodium_mg: 0,
    fiber_g: 0,
    nutrition_basis: "PER_SERVING",
    admin_notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (request) {
      setFormData({
        name: request.name,
        manufacturer: "",
        serving_size: request.serving_size || "1 porsi",
        energy_kcal: request.estimated_calories || 0,
        protein_g: 0,
        carbohydrate_g: 0,
        fat_g: 0,
        sugar_g: 0,
        sodium_mg: 0,
        fiber_g: 0,
        nutrition_basis: "PER_SERVING",
        admin_notes: "",
      });
      setError(null);
    }
  }, [request]);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Nama makanan wajib diisi.");
      return;
    }
    if (!formData.serving_size.trim()) {
      setError("Ukuran porsi wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onApprove(request.id, formData);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyetujui pengajuan.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[9000] flex items-center justify-center overflow-y-auto bg-black/50 p-0 backdrop-blur-xs sm:p-4">
      <div className="flex h-dvh max-h-dvh w-full flex-col overflow-hidden border border-[#E2E8F0] bg-white shadow-xl sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-4xl sm:rounded-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#AFC2FF] text-[#3B67FC] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl select-none">verified</span>
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-[#1A202C]">Review & Setujui Pengajuan Makanan</h3>
              <p className="truncate text-xs text-[#718096]">Lengkapi nilai gizi resmi sebelum dimasukkan ke database master</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-[#718096] transition-colors hover:bg-slate-200 hover:text-[#1A202C] cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl select-none">close</span>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-base select-none shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* User Request Snapshot */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
            <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Data Pengajuan Pasien</span>
              <span className="text-xs text-[#718096]">Diajukan pada: {request.created_at}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div>
                <p className="text-[#718096]">Nama Pasien:</p>
                <p className="font-semibold text-[#1A202C]">{request.patient_name || "Pasien"}</p>
              </div>
              <div>
                <p className="text-[#718096]">Waktu Makan:</p>
                <p className="font-semibold text-[#1A202C] capitalize">{request.meal_type || "-"}</p>
              </div>
              <div>
                <p className="text-[#718096]">Estimasi Pasien:</p>
                <p className="font-semibold text-[#3B67FC]">{request.estimated_calories ? `${request.estimated_calories} kcal` : "Tidak tahu"}</p>
              </div>
            </div>
            {request.notes && (
              <div className="pt-2 border-t border-[#E2E8F0] text-xs">
                <span className="text-[#718096]">Catatan Pasien: </span>
                <span className="text-[#1A202C] italic">"{request.notes}"</span>
              </div>
            )}
          </div>

          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1A202C] mb-1.5">
                Nama Makanan Resmi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#1A202C] focus:outline-none focus:ring-1 focus:ring-[#3B67FC]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A202C] mb-1.5">Produsen / Merk</label>
              <input
                type="text"
                placeholder="Misal: Buatan Rumah, Indofood, dll."
                value={formData.manufacturer || ""}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#1A202C] focus:outline-none focus:ring-1 focus:ring-[#3B67FC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1A202C] mb-1.5">
                Takaran Porsi Saji <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.serving_size}
                onChange={(e) => setFormData({ ...formData, serving_size: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#1A202C] focus:outline-none focus:ring-1 focus:ring-[#3B67FC]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A202C] mb-1.5">Basis Nutrisi</label>
              <select
                value={formData.nutrition_basis}
                onChange={(e) => setFormData({ ...formData, nutrition_basis: e.target.value as ApproveFoodProposalDTO["nutrition_basis"] })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#1A202C] focus:outline-none focus:ring-1 focus:ring-[#3B67FC]"
              >
                <option value="PER_SERVING">Per Porsi (Serving)</option>
                <option value="PER_100G">Per 100 gram</option>
                <option value="PER_PACKAGE">Per Kemasan</option>
                <option value="UNVERIFIED">Perlu Verifikasi</option>
              </select>
            </div>
          </div>

          {/* Nutritional Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-2.5">
              Nilai Gizi Resmi
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
                <label className="block text-[11px] font-bold text-blue-900 mb-1">Energi (kcal) *</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={formData.energy_kcal}
                  onChange={(e) => setFormData({ ...formData, energy_kcal: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-blue-200 text-sm font-bold text-blue-900 focus:outline-none"
                />
              </div>
              <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl">
                <label className="block text-[11px] font-bold text-amber-900 mb-1">Karbohidrat (g)</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={formData.carbohydrate_g}
                  onChange={(e) => setFormData({ ...formData, carbohydrate_g: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-amber-200 text-sm font-bold text-amber-900 focus:outline-none"
                />
              </div>
              <div className="p-3 bg-red-50/60 border border-red-100 rounded-xl">
                <label className="block text-[11px] font-bold text-red-900 mb-1">Protein (g)</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={formData.protein_g}
                  onChange={(e) => setFormData({ ...formData, protein_g: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-red-200 text-sm font-bold text-red-900 focus:outline-none"
                />
              </div>
              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                <label className="block text-[11px] font-bold text-emerald-900 mb-1">Lemak (g)</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={formData.fat_g}
                  onChange={(e) => setFormData({ ...formData, fat_g: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-emerald-200 text-sm font-bold text-emerald-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-[11px] font-bold text-[#718096] mb-1">Gula (g)</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={formData.sugar_g || 0}
                  onChange={(e) => setFormData({ ...formData, sugar_g: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-sm text-[#1A202C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#718096] mb-1">Natrium (mg)</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={formData.sodium_mg || 0}
                  onChange={(e) => setFormData({ ...formData, sodium_mg: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-sm text-[#1A202C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#718096] mb-1">Serat (g)</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={formData.fiber_g || 0}
                  onChange={(e) => setFormData({ ...formData, fiber_g: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-sm text-[#1A202C] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Admin Verification Notes */}
          <div>
            <label className="block text-xs font-bold text-[#1A202C] mb-1.5">Catatan Verifikasi (Opsional)</label>
            <input
              type="text"
              placeholder="Misal: Data diverifikasi dari TKPI Kemenkes / Tabel Komposisi Pangan"
              value={formData.admin_notes || ""}
              onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#1A202C] focus:outline-none focus:ring-1 focus:ring-[#3B67FC]"
            />
          </div>

          </div>

          {/* Modal Footer */}
          <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-[#E2E8F0] bg-white px-4 py-4 sm:flex sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm font-semibold text-[#4A5568] hover:bg-[#F8FAFC] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#3B67FC] text-white text-sm font-bold hover:bg-[#1A63ED] transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-[#3B67FC]/20 disabled:opacity-60"
            >
              {loading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg select-none">check_circle</span>
                  <span>Setujui & Publikasikan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      </div>
    </Portal>
  );
}
