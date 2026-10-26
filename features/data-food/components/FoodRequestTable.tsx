"use client";

import React, { useState, useEffect, useCallback } from "react";
import { foodService } from "@/features/data-food/services/foodService";
import { FoodRequestReviewModal } from "@/features/data-food/components/FoodRequestReviewModal";
import { FoodRequestRejectModal } from "@/features/data-food/components/FoodRequestRejectModal";
import { useToast } from "@/components/ui/Toast";
import type {
  FoodRequest,
  FoodRequestStats,
  FoodRequestListParams,
  ApproveFoodProposalDTO,
} from "@/features/data-food/types/food";

export function FoodRequestTable() {
  const { showToast } = useToast();

  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [stats, setStats] = useState<FoodRequestStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Modals
  const [reviewTarget, setReviewTarget] = useState<FoodRequest | null>(null);
  const [rejectTarget, setRejectTarget] = useState<FoodRequest | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const params: FoodRequestListParams = {
        page,
        limit,
        q: searchQuery || undefined,
        status: statusFilter || undefined,
      };
      const res = await foodService.getFoodRequests(params);
      setRequests(res.data);
      setTotalItems(res.pagination.total_items);
      setTotalPages(
        res.pagination.total_pages || Math.ceil(res.pagination.total_items / limit) || 1
      );
    } catch {
      showToast({
        type: "error",
        title: "Gagal",
        description: "Gagal memuat data pengajuan makanan.",
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, statusFilter, showToast]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await foodService.getFoodRequestStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch food request stats", err);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, [fetchRequests, fetchStats]);

  const handleApprove = async (id: string, data: ApproveFoodProposalDTO) => {
    await foodService.approveFoodRequest(id, data);
    showToast({
      type: "success",
      title: "Pengajuan Disetujui",
      description: `Makanan "${data.name}" berhasil ditambahkan ke database master makanan.`,
    });
    fetchRequests();
    fetchStats();
  };

  const handleReject = async (id: string, reason: string) => {
    await foodService.rejectFoodRequest(id, reason);
    showToast({
      type: "success",
      title: "Pengajuan Ditolak",
      description: "Pengajuan makanan telah ditolak.",
    });
    fetchRequests();
    fetchStats();
  };

  const statusChips = [
    { label: "Semua", value: "", count: stats?.total ?? 0 },
    { label: "Menunggu Review", value: "pending", count: stats?.pending ?? 0, highlight: true },
    { label: "Disetujui", value: "approved", count: stats?.approved ?? 0 },
    { label: "Ditolak", value: "rejected", count: stats?.rejected ?? 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-blue-50 border-blue-100 text-blue-600 shrink-0">
            <span className="material-symbols-outlined text-2xl select-none">inbox</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#718096] uppercase tracking-wider">Total Usulan</p>
            <h3 className="text-2xl font-bold text-[#1A202C] mt-0.5">{stats?.total?.toLocaleString("id-ID") ?? 0}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs flex items-center gap-4 bg-amber-50/20">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-amber-100 border-amber-200 text-amber-700 shrink-0">
            <span className="material-symbols-outlined text-2xl select-none">pending_actions</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Menunggu Review</p>
            <h3 className="text-2xl font-bold text-amber-900 mt-0.5">{stats?.pending?.toLocaleString("id-ID") ?? 0}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-emerald-50 border-emerald-100 text-emerald-600 shrink-0">
            <span className="material-symbols-outlined text-2xl select-none">check_circle</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#718096] uppercase tracking-wider">Disetujui</p>
            <h3 className="text-2xl font-bold text-[#1A202C] mt-0.5">{stats?.approved?.toLocaleString("id-ID") ?? 0}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-rose-50 border-rose-100 text-rose-600 shrink-0">
            <span className="material-symbols-outlined text-2xl select-none">cancel</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#718096] uppercase tracking-wider">Ditolak</p>
            <h3 className="text-2xl font-bold text-[#1A202C] mt-0.5">{stats?.rejected?.toLocaleString("id-ID") ?? 0}</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {statusChips.map((chip) => {
            const isSelected = statusFilter === chip.value;
            return (
              <button
                key={chip.value}
                onClick={() => {
                  setStatusFilter(chip.value);
                  setPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[#3B67FC] text-white shadow-xs shadow-[#3B67FC]/25"
                    : "bg-[#F8FAFC] text-[#4A5568] hover:bg-[#EEF2FF] hover:text-[#3B67FC] border border-[#E2E8F0]"
                }`}
              >
                <span>{chip.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : chip.highlight && chip.count > 0
                      ? "bg-amber-100 text-amber-800"
                      : "bg-[#E2E8F0] text-[#718096]"
                  }`}
                >
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718096] text-xl select-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Cari nama makanan atau pasien..."
            className="w-full pl-10 pr-4 h-11 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#1A202C] placeholder-[#718096] focus:outline-none focus:ring-1 focus:ring-[#3B67FC] focus:border-[#3B67FC] focus:bg-white transition-all font-[family-name:var(--font-poppins)]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#718096] uppercase text-[11px] font-bold tracking-wider">
                <th className="py-3.5 px-5">Makanan yang Diajukan</th>
                <th className="py-3.5 px-5">Porsi & Estimasi</th>
                <th className="py-3.5 px-5">Pemohon</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-5">
                      <div className="h-4 bg-slate-200 rounded-sm w-36 mb-2" />
                      <div className="h-3 bg-slate-100 rounded-sm w-24" />
                    </td>
                    <td className="py-4 px-5">
                      <div className="h-4 bg-slate-200 rounded-sm w-28" />
                    </td>
                    <td className="py-4 px-5">
                      <div className="h-4 bg-slate-200 rounded-sm w-28 mb-1" />
                      <div className="h-3 bg-slate-100 rounded-sm w-20" />
                    </td>
                    <td className="py-4 px-5">
                      <div className="h-6 bg-slate-200 rounded-full w-24" />
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="h-8 bg-slate-200 rounded-lg w-20 inline-block" />
                    </td>
                  </tr>
                ))
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#718096]">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#A0AEC0] mb-3">
                        <span className="material-symbols-outlined text-3xl select-none">mark_email_read</span>
                      </div>
                      <p className="font-bold text-sm text-[#2D3748]">Tidak ada pengajuan makanan</p>
                      <p className="text-xs text-[#718096] mt-1 max-w-sm">
                        {statusFilter === "pending"
                          ? "Semua usulan makanan dari pasien telah ditinjau."
                          : "Belum terdapat data pengajuan makanan yang sesuai dengan filter."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#F8FAFC] transition-colors">
                    {/* Food Info */}
                    <td className="py-4 px-5">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#3B67FC] flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                          {req.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#1A202C]">{req.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {req.meal_type && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F1F5F9] text-[#475569]">
                                {req.meal_type}
                              </span>
                            )}
                            {req.notes && (
                              <span className="text-[11px] text-[#718096] italic truncate max-w-xs">
                                "{req.notes}"
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Serving & Calories */}
                    <td className="py-4 px-5">
                      <p className="font-semibold text-[#1A202C]">{req.serving_size}</p>
                      <p className="text-[11px] text-[#718096] mt-0.5">
                        {req.estimated_calories > 0
                          ? `Estimasi: ${req.estimated_calories} kcal`
                          : "Tanpa estimasi kalori"}
                      </p>
                    </td>

                    {/* Patient & Date */}
                    <td className="py-4 px-5">
                      <p className="font-semibold text-[#1A202C]">{req.patient_name || "Pasien"}</p>
                      <p className="text-[11px] text-[#718096] mt-0.5">
                        {req.created_at}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      {req.status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>Menunggu</span>
                        </span>
                      )}
                      {req.status === "approved" && (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="material-symbols-outlined text-sm select-none">check_circle</span>
                            <span>Disetujui</span>
                          </span>
                          {req.reviewer_name && (
                            <p className="text-[10px] text-[#718096] mt-1">Oleh: {req.reviewer_name}</p>
                          )}
                        </div>
                      )}
                      {req.status === "rejected" && (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="material-symbols-outlined text-sm select-none">cancel</span>
                            <span>Ditolak</span>
                          </span>
                          {req.admin_notes && (
                            <p className="text-[10px] text-rose-600 mt-1 max-w-xs truncate" title={req.admin_notes}>
                              Alasan: {req.admin_notes}
                            </p>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-5 text-right">
                      {req.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setRejectTarget(req)}
                            className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all cursor-pointer"
                          >
                            Tolak
                          </button>
                          <button
                            onClick={() => setReviewTarget(req)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#3B67FC] text-white hover:bg-[#1A63ED] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs shadow-[#3B67FC]/20"
                          >
                            <span className="material-symbols-outlined text-sm select-none">rate_review</span>
                            <span>Tinjau</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#A0AEC0] italic">Selesai</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#718096]">
            <span>
              Menampilkan {requests.length} dari {totalItems} pengajuan
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#4A5568] hover:bg-[#F8FAFC] disabled:opacity-40 cursor-pointer"
              >
                Sebelumnya
              </button>
              <span className="font-semibold text-[#1A202C]">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#4A5568] hover:bg-[#F8FAFC] disabled:opacity-40 cursor-pointer"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <FoodRequestReviewModal
        isOpen={!!reviewTarget}
        onClose={() => setReviewTarget(null)}
        request={reviewTarget}
        onApprove={handleApprove}
      />

      {/* Reject Modal */}
      <FoodRequestRejectModal
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        request={rejectTarget}
        onReject={handleReject}
      />
    </div>
  );
}
