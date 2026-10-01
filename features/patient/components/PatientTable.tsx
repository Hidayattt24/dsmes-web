"use client";

import { DataTable, type TableColumn } from "@/components/common/DataTable";
import type { Patient } from "@/types/patient";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";

interface PatientTableProps {
  readonly patients: Patient[];
  readonly loading: boolean;
}

export function PatientTable({ patients, loading }: PatientTableProps) {
  const columns: TableColumn<Patient>[] = [
    {
      key: "name",
      header: "Nama Pasien",
      render: (row) => (
        <div className="flex items-center gap-4">
          <Avatar src={row.avatarUrl} name={row.name} size={36} />
          <span className="text-sm font-semibold text-[#1A202C]">{row.name}</span>
        </div>
      ),
    },
    {
      key: "age",
      header: "Usia",
      render: (row) => (
        <span className="text-sm text-[#718096]">{row.age} thn</span>
      ),
    },
    {
      key: "gender",
      header: "Jenis Kelamin",
      render: (row) => (
        <span className="text-sm text-[#718096]">{row.gender}</span>
      ),
    },
    {
      key: "status",
      header: "Status Kepatuhan",
      render: (row) => {
        const comp = typeof row.compliance === "number" ? Math.round(row.compliance) : 0;
        let badgeStyle = "bg-[#FFF5F5] text-[#C53030] border-red-200";
        let label = `Tidak Patuh (${comp}%)`;
        if (comp >= 70) {
          badgeStyle = "bg-[#F0FDF4] text-[#166534] border-emerald-200";
          label = `Patuh (${comp}%)`;
        } else if (comp >= 40) {
          badgeStyle = "bg-[#FFFBEB] text-[#B45309] border-amber-200";
          label = `Kurang Patuh (${comp}%)`;
        }
        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border tracking-tight ${badgeStyle}`}
          >
            {label}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Aksi",
      className: "text-right",
      render: (row) => (
        <Link
          href={`/admin/data-pasien/${row.id}`}
          className="text-[11px] font-bold text-[#00695C] hover:underline underline-offset-4 uppercase tracking-widest"
        >
          Detail
        </Link>
      ),
    },
  ];

  return (
    <DataTable<Patient>
      columns={columns}
      data={patients}
      keyExtract={(row) => row.id}
      loading={loading}
      emptyTitle="Tidak ada pasien"
      emptyMessage="Tidak ditemukan data pasien yang cocok dengan kriteria pencarian."
    />
  );
}
