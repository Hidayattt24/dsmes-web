import { DataTable, type TableColumn } from "@/components/common/DataTable";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { PatientRecord } from "../types/record";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface StaffPriorityPatientTableProps {
  readonly patients: PatientRecord[];
  readonly loading: boolean;
}

export function StaffPriorityPatientTable({ patients, loading }: StaffPriorityPatientTableProps) {
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
      key: "age",
      header: "Umur",
      render: (row) => <span className="text-sm text-[#4A5568]">{row.age} Tahun</span>,
    },
    {
      key: "gender",
      header: "Gender",
      render: (row) => <span className="text-sm text-[#4A5568]">{row.gender}</span>,
    },
    {
      key: "bloodSugar",
      header: "Gula Darah Terakhir",
      render: (row) => (
        <span className="font-bold text-sm text-red-600">
          {row.dailySummary.bloodSugar || "-"}
        </span>
      ),
    },
    {
      key: "risk",
      header: "Level Risiko",
      render: (row) => {
        const statusStr = (row.dailySummary.status ?? "").toLowerCase();
        const isHigh = statusStr === "hyperglycemia" || statusStr === "hiperglikemia";
        const isWarning = statusStr === "prediabetes" || statusStr === "elevated" || statusStr === "meningkat";
        const isHypo = statusStr === "hipoglikemia" || statusStr === "hypoglycemia";
        return (
          <Badge variant={isHigh || isHypo ? "error" : "warning"}>
            {isHigh ? "Hiperglikemia" : isHypo ? "Hipoglikemia" : isWarning ? "Prediabetes" : "Perlu Perhatian"}
          </Badge>
        );
      },
    },
    {
      key: "lastActivity",
      header: "Aktivitas Terakhir",
      render: (row) => (
        <span className="text-xs text-[#718096] font-medium">
          {row.dailySummary.activity || "-"} {row.dailySummary.activityType || ""}
        </span>
      ),
    },
    {
      key: "compliance",
      header: "Status Kepatuhan",
      render: (row) => {
        const compl = row.compliance;
        let label = "Patuh";
        let badgeVariant: "primary" | "warning" | "error" = "primary";
        if (compl < 40) {
          label = "Tidak Patuh";
          badgeVariant = "error";
        } else if (compl < 70) {
          label = "Kurang Patuh";
          badgeVariant = "warning";
        }
        return <Badge variant={badgeVariant}>{label}</Badge>;
      },
    },
    {
      key: "action",
      header: "Aksi",
      className: "text-right",
      render: (row) => (
        <Link
          href={isStaff ? `/staff/pemantauan-catatan-pasien/${row.id}` : `/admin/pemantauan-catatan-pasien/${row.id}`}
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-bold text-[#00695C] transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
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
      emptyTitle="Semua Pasien Stabil"
      emptyMessage="Tidak ada pasien prioritas yang membutuhkan perhatian khusus hari ini."
    />
  );
}
