"use client";

import { useState } from "react";
import { useAdministrator } from "../hooks/useAdministrator";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { DataTable, type TableColumn } from "@/components/common/DataTable";
import type { Administrator } from "../types/administrator";
import Link from "next/link";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useToast } from "@/components/ui/Toast";
import { Select } from "@/components/ui/Select";

const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "Aktif", label: "Aktif" },
  { value: "Nonaktif", label: "Nonaktif" },
] as const;

function formatRole(role: string): string {
  if (role === "admin") return "Admin";
  if (role === "staff") return "Staff";
  return role;
}

export function AdministratorFeature() {
  const {
    administrators,
    totalCount,
    activeCount,
    isLoading,
    page,
    setPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    deleteAdmin,
  } = useAdministrator();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteAdmin(deleteId);
      showToast({
        type: "success",
        title: "Berhasil",
        description: "Staff Monitoring berhasil dihapus.",
      });
    } catch {
      showToast({
        type: "error",
        title: "Gagal",
        description: "Gagal menghapus staff monitoring.",
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Define Table Columns
  const columns: TableColumn<Administrator>[] = [
    {
      key: "fullName",
      header: "Nama Lengkap",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.profilePhotoUrl} name={row.fullName} size={36} />
          <span className="text-sm font-semibold text-[#1A202C] font-[family-name:var(--font-poppins)]">
            {row.fullName}
          </span>
        </div>
      ),
    },
    {
      key: "username",
      header: "Username",
      render: (row) => (
        <span className="text-sm text-[#1A202C] font-medium font-[family-name:var(--font-poppins)]">
          {row.username}
        </span>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (row) => (
        <span className="text-sm text-[#1A202C] font-medium font-[family-name:var(--font-poppins)]">
          {row.email}
        </span>
      ),
    },
    {
      key: "whatsappNumber",
      header: "Nomor WhatsApp",
      render: (row) => (
        <span className="text-sm text-[#1A202C] font-medium font-[family-name:var(--font-poppins)]">
          {row.whatsappNumber || "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status Akun",
      render: (row) => (
        <Badge variant={row.status === "Aktif" ? "primary" : "muted"}>
          {row.status}
        </Badge>
      ),
      className: "w-36",
    },
    {
      key: "role",
      header: "Peran",
      render: (row) => (
        <span className="px-3 py-1 bg-[#EBF8FF] text-[#2B6CB0] rounded-full text-[10px] font-bold uppercase tracking-wider font-[family-name:var(--font-poppins)]">
          {formatRole(row.role)}
        </span>
      ),
      className: "w-44",
    },
    {
      key: "healthFacilityName",
      header: "Puskesmas",
      render: (row) => (
        <span className="text-sm text-[#1A202C] font-medium font-[family-name:var(--font-poppins)]">
          {row.healthFacilityName || "-"}
        </span>
      ),
      className: "w-44",
    },
    {
      key: "createdAt",
      header: "Tanggal Dibuat",
      render: (row) => (
        <span className="text-xs text-[#718096] font-medium font-[family-name:var(--font-poppins)]">
          {row.createdAt}
        </span>
      ),
      className: "w-36",
    },
    {
      key: "actions",
      header: "Aksi",
      render: (row) => (
        <div className="flex items-center gap-2 justify-end">
          <Link
            href={`/admin/administrator/${row.id}/edit`}
            className="w-8 h-8 flex items-center justify-center border border-[#E2E8F0] rounded-lg hover:bg-[#F4F6F8] transition-all text-[#718096] hover:text-[#3B67FC]"
            title="Edit"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </Link>
          <button
            onClick={() => setDeleteId(row.id)}
            className="w-8 h-8 flex items-center justify-center border border-red-100 rounded-lg hover:bg-red-50 transition-all text-red-500 hover:text-red-700 cursor-pointer"
            title="Hapus"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      ),
      className: "w-28 text-right",
    },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)] relative">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A202C] tracking-tight font-[family-name:var(--font-poppins)]">
            Manajemen Staff
          </h2>
          <p className="text-sm text-[#718096] mt-1 font-[family-name:var(--font-poppins)]">
            Kelola hak akses dan akun staff di seluruh unit layanan.
          </p>
        </div>

        <Link
          href="/admin/administrator/tambah"
          className="flex items-center gap-2 bg-[#3B67FC] hover:bg-[#001B6B] text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-md shadow-[#3B67FC]/10 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Tambah Staff Monitoring</span>
        </Link>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="premium-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#EEF2FF] rounded-full flex items-center justify-center text-[#3B67FC]">
            <span className="material-symbols-outlined text-2xl">groups</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#718096] uppercase tracking-widest leading-none">
              Jumlah Staff Monitoring
            </p>
            <p className="text-2xl font-bold text-[#1A202C] mt-2 leading-none">
              {totalCount}
            </p>
          </div>
        </div>

        <div className="premium-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#EEF2FF] rounded-full flex items-center justify-center text-[#3B67FC]">
            <span className="material-symbols-outlined text-2xl">person_check</span>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-[#718096] uppercase tracking-widest leading-none">
              Staff Monitoring Aktif
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold text-[#1A202C] leading-none">
                {activeCount}
              </span>
              <div className="h-1.5 w-24 bg-[#F4F6F8] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#3B67FC] rounded-full" 
                  style={{ width: `${(activeCount / (totalCount || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-xl border border-[#E2E8F0] w-full sm:w-96 focus-within:border-[#3B67FC] transition-all">
          <span className="material-symbols-outlined text-[#718096] text-xl">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, username, atau email..."
            className="bg-transparent border-none text-sm font-medium w-full placeholder:text-[#718096] text-[#1A202C] outline-none font-[family-name:var(--font-poppins)] focus:ring-0"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto justify-end">
          {/* Status Filter */}
          <div className="w-36">
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
        <DataTable
          columns={columns}
          data={administrators}
          keyExtract={(row) => row.id}
          loading={isLoading}
          emptyTitle="Tidak ada staff"
          emptyMessage="Belum ada staff yang sesuai dengan kriteria."
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="px-4 py-2 rounded-lg border border-[#E2E8F0] text-sm font-medium text-[#1A202C] hover:bg-[#F4F6F8] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Sebelumnya
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-lg text-sm font-semibold cursor-pointer ${
                p === page
                  ? "bg-[#3B67FC] text-white"
                  : "border border-[#E2E8F0] text-[#1A202C] hover:bg-[#F4F6F8]"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded-lg border border-[#E2E8F0] text-sm font-medium text-[#1A202C] hover:bg-[#F4F6F8] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Selanjutnya
          </button>
        </div>
      )}

      <ConfirmationModal
        open={deleteId !== null}
        title="Hapus Staff Monitoring?"
        description="Apakah Anda yakin ingin menghapus Staff Monitoring ini?"
        variant="danger"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
