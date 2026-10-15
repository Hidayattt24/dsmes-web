"use client";

import Link from "next/link";
import Image from "next/image";
import { DataTable, type TableColumn } from "@/components/common/DataTable";
import { Badge }   from "@/components/ui/Badge";
import type { TopArticle } from "@/types/dashboard";
import { ROUTES }  from "@/constants/routes";

const columns: TableColumn<TopArticle>[] = [
  {
    key:    "title",
    header: "Judul Artikel",
    render: (row) => (
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#F4F6F8] overflow-hidden flex-shrink-0 border border-[#E2E8F0]/40">
          {row.thumbnailUrl ? (
            <Image src={row.thumbnailUrl} alt={row.title} width={48} height={48} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[#718096] text-[20px]">article</span>
            </div>
          )}
        </div>
        <span className="text-sm font-semibold text-[#1A202C] group-hover:text-[#3B67FC] transition-colors">
          {row.title}
        </span>
      </div>
    ),
  },
  {
    key:    "category",
    header: "Kategori",
    render: (row) => <Badge variant="primary">{row.category}</Badge>,
  },
  {
    key:    "readCount",
    header: "Jumlah Dibaca",
    render: (row) => (
      <span className="text-sm font-medium text-[#1A202C]">
        {row.readCount.toLocaleString("id-ID")} kali
      </span>
    ),
  },
  {
    key:       "action",
    header:    "Aksi",
    className: "text-right",
    render: () => (
      <Link
        href={ROUTES.MANAJEMEN_EDUKASI}
        aria-label="Lihat artikel"
        className="material-symbols-outlined text-[#718096] group-hover:text-[#3B67FC] transition-colors"
      >
        visibility
      </Link>
    ),
  },
];

interface TopArticlesTableProps {
  readonly articles: TopArticle[];
  readonly loading:  boolean;
}

export function TopArticlesTable({ articles, loading }: TopArticlesTableProps) {
  return (
    <div className="premium-card overflow-hidden">
      {/* Table header */}
      <div className="px-8 py-7 flex justify-between items-center border-b border-[#E2E8F0]/50">
        <h3 className="text-lg font-bold text-[#1A202C] font-[family-name:var(--font-poppins)]">
          Artikel Edukasi Terpopuler
        </h3>
        <Link
          href={ROUTES.MANAJEMEN_EDUKASI}
          className="bg-[#3B67FC] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#001B6B] transition-all shadow-sm uppercase tracking-widest font-[family-name:var(--font-poppins)]"
        >
          Kelola Artikel
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={articles}
        keyExtract={(row) => row.id}
        loading={loading}
        emptyTitle="Belum ada artikel"
        emptyMessage="Belum ada artikel edukasi yang dipublikasikan."
      />
    </div>
  );
}
