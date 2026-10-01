import { DataTable, type TableColumn } from "@/components/common/DataTable";
import type { TrendPatient, TimeRange } from "../hooks/useStaffDashboard";
import Link from "next/link";

interface TrendPatientTableProps {
  readonly patients: readonly TrendPatient[];
  readonly loading: boolean;
  readonly trendRange: TimeRange;
  readonly onTrendRangeChange: (range: TimeRange) => void;
}

const RANGE_OPTIONS: readonly { label: string; value: TimeRange }[] = [
  { label: "7 Hari", value: 7 },
  { label: "30 Hari", value: 30 },
  { label: "90 Hari", value: 90 },
];

export function TrendPatientTable({ patients, loading, trendRange, onTrendRangeChange }: TrendPatientTableProps) {
  const columns: TableColumn<TrendPatient>[] = [
    {
      key: "patient",
      header: "Nama Pasien",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#D69E2E] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {row.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-sm text-[#1A202C]">{row.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "avgStart",
      header: "Rerata Sebelumnya",
      render: (row) => (
        <span className="text-sm text-[#718096] font-medium">{Math.round(row.avgStart)} mg/dL</span>
      ),
    },
    {
      key: "avgCurrent",
      header: "Rerata Saat Ini",
      render: (row) => (
        <span className="font-bold text-sm text-red-600">{Math.round(row.avgCurrent)} mg/dL</span>
      ),
    },
    {
      key: "percentageIncrease",
      header: "Persentase Kenaikan",
      render: (row) => (
        <span className="font-extrabold text-sm text-red-600">
          +{row.percentageIncrease.toFixed(1)}%
        </span>
      ),
    },
    {
      key: "trend",
      header: "Indikator Tren",
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#9B2C2C] bg-[#FFF5F5] px-2.5 py-1 rounded-full border border-red-100">
          <span className="material-symbols-outlined text-[14px] select-none">trending_up</span>
          <span>Meningkat (+{Math.round(row.increase)} mg/dL)</span>
        </span>
      ),
    },
    {
      key: "action",
      header: "Aksi",
      className: "text-right",
      render: (row) => (
        <Link
          href={`/staff/pemantauan-catatan-pasien/${row.id}`}
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-bold text-[#00695C] transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
        >
          <span>Detail</span>
          <span className="material-symbols-outlined text-sm select-none ml-1">visibility</span>
        </Link>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden w-full flex flex-col font-[family-name:var(--font-poppins)]">
      <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 bg-[#F8FAFC]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div>
            <h3 className="text-sm font-bold text-[#1A202C]">Pasien dengan Tren Meningkat</h3>
            <p className="text-[11px] text-[#718096] mt-0.5 font-medium">Pasien dengan peningkatan rata-rata gula darah signifikan</p>
          </div>
          <div className="flex items-center gap-1 bg-[#F1F5F9] rounded-lg p-0.5 self-start sm:self-auto">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onTrendRangeChange(opt.value)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                  trendRange === opt.value
                    ? "bg-white text-[#D69E2E] shadow-sm"
                    : "text-[#718096] hover:text-[#4A5568]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <span className="text-xs font-bold text-[#D69E2E] bg-[#FEFCBF] px-2.5 py-1 rounded-full text-[#975A16] border border-[#FEEBC8] self-start sm:self-auto">
          {patients.length} Pasien
        </span>
      </div>
      <div className="w-full">
        <DataTable
          columns={columns}
          data={patients as TrendPatient[]}
          keyExtract={(row) => row.id}
          loading={loading}
          emptyTitle="Tidak ada kenaikan signifikan"
          emptyMessage="Semua pasien menunjukkan tren gula darah yang stabil atau menurun."
        />
      </div>
    </div>
  );
}
