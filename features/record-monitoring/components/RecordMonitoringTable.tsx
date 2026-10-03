"use client";

import { DataTable, type TableColumn } from "@/components/common/DataTable";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { PatientRecord, PaginationMeta } from "../types/record";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface RecordMonitoringTableProps {
  readonly patients: PatientRecord[];
  readonly loading: boolean;
  readonly sortBy?: string;
  readonly sortOrder?: string;
  readonly pagination?: PaginationMeta;
  readonly onSort?: (key: string) => void;
  readonly onPageChange?: (page: number) => void;
}

function SortToolbar({ sortBy, sortOrder, onSort }: {
  sortBy?: string;
  sortOrder?: string;
  onSort?: (key: string) => void;
}) {
  const sorts = [
    { key: "name", label: "Nama" },
    { key: "newest", label: "Terbaru" },
    { key: "oldest", label: "Terlama" },
    { key: "latest_record", label: "Aktivitas Terakhir" },
    { key: "highest_blood_sugar", label: "Gula Darah" },
  ];

  return (
    <div className="flex items-center gap-2 px-8 py-3 border-b border-[#E2E8F0] bg-[#FAFBFC]">
      <span className="text-xs font-bold text-[#718096] uppercase tracking-wider mr-2">Urutkan:</span>
      {sorts.map((s) => {
        const isActive = sortBy === s.key;
        return (
          <button
            key={s.key}
            onClick={() => onSort?.(s.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isActive
                ? "bg-[#00695C] text-white shadow-sm"
                : "bg-white text-[#4A5568] border border-[#E2E8F0] hover:bg-[#F4F6F8]"
            }`}
          >
            {s.label}
            {isActive && (
              <span className="material-symbols-outlined text-[12px] ml-1 align-text-bottom">
                {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function PaginationBar({ pagination, onPageChange }: {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  const { page, total_pages, total } = pagination;
  const start = (page - 1) * pagination.per_page + 1;
  const end = Math.min(page * pagination.per_page, total);
  const pageNumbers = Array.from({ length: total_pages }, (_, i) => i + 1);

  return (
    <div className="px-8 py-6 border-t border-[#E2E8F0]/50 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-xs text-[#718096] font-medium font-[family-name:var(--font-poppins)]">
        Menampilkan <span className="text-[#1A202C] font-bold">{start}-{end}</span> dari{" "}
        <span className="text-[#1A202C] font-bold">
          {total.toLocaleString("id-ID")}
        </span>{" "}
        pasien
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-9 h-9 flex items-center justify-center border border-[#E2E8F0] rounded-lg hover:bg-[#F4F6F8] transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-lg">chevron_left</span>
        </button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={[
              "w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all",
              page === number
                ? "bg-[#00695C] text-white shadow-sm shadow-[#00695C]/20"
                : "hover:bg-[#F4F6F8] text-[#718096] font-semibold",
            ].join(" ")}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === total_pages}
          className="w-9 h-9 flex items-center justify-center border border-[#E2E8F0] rounded-lg hover:bg-[#F4F6F8] transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-lg">chevron_right</span>
        </button>
      </div>
    </div>
  );
}

export function RecordMonitoringTable({
  patients,
  loading,
  sortBy,
  sortOrder,
  pagination,
  onSort,
  onPageChange,
}: RecordMonitoringTableProps) {
  const pathname = usePathname();

  const columns: TableColumn<PatientRecord>[] = [
    {
      key: "patient",
      header: "Pasien",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatarUrl} name={row.name} size={40} />
          <div>
            <p className="font-semibold text-sm text-[#1A202C]">{row.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "bloodSugar",
      header: "Gula Darah Terakhir",
      render: (row) => {
        const value = row.dailySummary.bloodSugar;
        const time = row.dailySummary.bloodSugarTime;
        const typeLabel = row.dailySummary.bloodSugarMeasurementLabel;
        const s = (row.dailySummary.status || "").toLowerCase();
        const isWarning =
          s === "prediabetes" ||
          s === "elevated" ||
          s === "waspada" ||
          s === "low_warning" ||
          s === "waspada rendah" ||
          s === "hyperglycemia" ||
          s === "hiperglikemia" ||
          s === "hypoglycemia" ||
          s === "hipoglikemia";

        return (
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`font-bold text-sm ${isWarning ? "text-[#C53030]" : "text-[#1A202C]"}`}>
                {value}
              </span>
              {typeLabel && value !== "-" && (
                <span className="text-[11px] font-semibold text-[#00695C] bg-[#E6F2F1] px-2 py-0.5 rounded-md">
                  {typeLabel}
                </span>
              )}
            </div>
            <span className="text-xs text-[#718096] font-medium">{time}</span>
          </div>
        );
      },
    },
    {
      key: "medicalStatus",
      header: "Status Klasifikasi Medis Glukosa Darah",
      render: (row) => {
        const s = (row.dailySummary.status || "").toLowerCase();
        let variant: "primary" | "warning" | "error" | "muted" = "primary";
        let label = "Normal";

        if (s === "hyperglycemia" || s === "hiperglikemia" || s === "severe_hyperglycemia") {
          variant = "error";
          label = "Hiperglikemia";
        } else if (s === "hypoglycemia" || s === "hipoglikemia" || s === "severe_hypoglycemia") {
          variant = "error";
          label = "Hipoglikemia";
        } else if (s === "low_warning" || s === "waspada rendah" || s === "waspada_rendah") {
          variant = "warning";
          label = "Waspada Rendah";
        } else if (s === "elevated" || s === "prediabetes" || s === "waspada") {
          variant = "warning";
          label = "Waspada";
        } else if (!row.dailySummary.bloodSugar || row.dailySummary.bloodSugar === "-") {
          variant = "muted";
          label = "Belum Ada";
        }

        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      key: "meal",
      header: "Makanan Terakhir",
      render: (row) => (
        <div>
          <span className="text-sm font-semibold text-[#1A202C]">{row.dailySummary.meal}</span>
          <br />
          <span className="text-xs text-[#718096]">{row.dailySummary.mealType}</span>
        </div>
      ),
    },
    {
      key: "activity",
      header: "Aktivitas Terakhir",
      render: (row) => (
        <div>
          <span className="text-sm font-semibold text-[#1A202C]">{row.dailySummary.activity}</span>
          <br />
          <span className="text-xs text-[#718096]">{row.dailySummary.activityType}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status Kepatuhan",
      render: (row) => {
        const comp = typeof row.compliance === "number" ? Math.round(row.compliance) : 0;
        let badgeVariant: "primary" | "warning" | "error" = "error";
        let label = `Tidak Patuh (${comp}%)`;
        if (comp >= 70) {
          badgeVariant = "primary";
          label = `Patuh (${comp}%)`;
        } else if (comp >= 40) {
          badgeVariant = "warning";
          label = `Kurang Patuh (${comp}%)`;
        }
        return <Badge variant={badgeVariant}>{label}</Badge>;
      },
    },
    {
      key: "actions",
      header: "Aksi",
      render: (row) => (
        <Link
          href={pathname.startsWith("/staff") ? `/staff/pemantauan-catatan-pasien/${row.id}` : `/admin/pemantauan-catatan-pasien/${row.id}`}
          className="text-[#00695C] hover:text-[#004d43] font-semibold text-sm transition-colors inline-flex items-center gap-1 hover:underline"
        >
          Lihat
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </Link>
      ),
    },
  ];

  return (
    <div>
      {onSort && (
        <SortToolbar sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
      )}
      <DataTable<PatientRecord>
        columns={columns}
        data={patients}
        keyExtract={(row) => row.id}
        loading={loading}
        emptyTitle="Tidak ada catatan"
        emptyMessage="Belum ada data catatan monitoring yang cocok."
      />
      {pagination && onPageChange && (
        <PaginationBar pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
}
