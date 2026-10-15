import { DataTable, type TableColumn } from "@/components/common/DataTable";
import { Avatar } from "@/components/ui/Avatar";
import type { PatientRecord } from "../types/record";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface IncreasingTrendTableProps {
  readonly patients: PatientRecord[];
  readonly loading: boolean;
}

export function IncreasingTrendTable({ patients, loading }: IncreasingTrendTableProps) {
  const pathname = usePathname();
  const isStaff = pathname.startsWith("/staff");

  const columns: TableColumn<PatientRecord>[] = [
    {
      key: "patient",
      header: "Pasien",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatarUrl} name={row.name} size={36} />
          <div>
            <p className="font-semibold text-sm text-[#1A202C]">{row.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "prevAvg",
      header: "Rerata Sebelumnya",
      render: (row) => {
        const avg = row.dailySummary.avgBloodSugar;
        const latest = parseInt(row.dailySummary.bloodSugar) || 0;
        const prevAvg = avg ? Math.round(avg) : Math.max(latest - 20, 80);
        return <span className="text-sm text-[#718096] font-medium">{prevAvg} mg/dL</span>;
      },
    },
    {
      key: "avgCurrent",
      header: "Rerata Saat Ini",
      render: (row) => {
        const latest = parseInt(row.dailySummary.bloodSugar) || 0;
        return <span className="font-bold text-sm text-red-600">{latest} mg/dL</span>;
      },
    },
    {
      key: "increasePercent",
      header: "Persentase Kenaikan",
      render: (row) => {
        const latest = parseInt(row.dailySummary.bloodSugar) || 0;
        const avg = row.dailySummary.avgBloodSugar;
        const prevAvg = avg ? Math.round(avg) : Math.max(latest - 20, 80);
        const diff = latest - prevAvg;
        const percent = prevAvg > 0 ? (diff / prevAvg) * 100 : 0;
        return (
          <span className="font-extrabold text-sm text-red-600">
            +{percent.toFixed(1)}%
          </span>
        );
      },
    },
    {
      key: "trend",
      header: "Indikator Tren",
      render: (row) => {
        const latest = parseInt(row.dailySummary.bloodSugar) || 0;
        const avg = row.dailySummary.avgBloodSugar;
        const prevAvg = avg ? Math.round(avg) : Math.max(latest - 20, 80);
        const diff = latest - prevAvg;
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#9B2C2C] bg-[#FFF5F5] px-2.5 py-1 rounded-full border border-red-100">
            <span className="material-symbols-outlined text-[14px] select-none">trending_up</span>
            <span>Meningkat (+{Math.abs(diff)} mg/dL)</span>
          </span>
        );
      },
    },
    {
      key: "lastUpdated",
      header: "Pembaruan Terakhir",
      render: (row) => <span className="text-xs text-[#718096] font-medium">{row.lastActive || "Hari ini"}</span>,
    },
    {
      key: "action",
      header: "Aksi",
      className: "text-right",
      render: (row) => (
        <Link
          href={isStaff ? `/staff/pemantauan-catatan-pasien/${row.id}` : `/admin/pemantauan-catatan-pasien/${row.id}`}
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-bold text-[#3B67FC] transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
        >
          <span>Detail</span>
          <span className="material-symbols-outlined text-sm select-none ml-1">visibility</span>
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={patients}
      keyExtract={(row) => row.id}
      loading={loading}
      emptyTitle="Tren Stabil"
      emptyMessage="Tidak ada pasien dengan peningkatan gula darah signifikan."
    />
  );
}
