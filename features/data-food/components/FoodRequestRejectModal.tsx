"use client";

import React, { useState } from "react";
import type { FoodRequest } from "@/features/data-food/types/food";

interface Props {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly request: FoodRequest | null;
  readonly onReject: (id: string, reason: string) => Promise<void>;
}

export function FoodRequestRejectModal({
  isOpen,
  onClose,
  request,
  onReject,
}: Props) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Alasan penolakan wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onReject(request.id, reason.trim());
      setReason("");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menolak pengajuan.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-red-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 text-red-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl select-none">cancel</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1A202C]">Tolak Pengajuan Makanan</h3>
              <p className="text-xs text-[#718096]">Berikan alasan penolakan untuk arsip</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#718096] hover:text-[#1A202C] p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl select-none">close</span>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
              {error}
            </div>
          )}

          <p className="text-sm text-[#4A5568]">
            Anda akan menolak pengajuan makanan <strong className="text-[#1A202C]">"{request.name}"</strong> yang diajukan oleh <span className="font-semibold">{request.patient_name || "Pasien"}</span>.
          </p>

          <div>
            <label className="block text-xs font-bold text-[#1A202C] mb-1.5">
              Alasan Penolakan <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Makanan sudah ada di database dengan nama lain, atau informasi tidak sesuai kriteria..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#1A202C] focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-[#E2E8F0] bg-white text-sm font-semibold text-[#4A5568] hover:bg-[#F8FAFC] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Tolak Pengajuan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
