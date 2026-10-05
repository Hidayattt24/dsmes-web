"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DataTable, type TableColumn } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import type { EducationArticle } from "../types/education";
import { ROUTES } from "@/constants/routes";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useToast } from "@/components/ui/Toast";

interface EducationTableProps {
  readonly articles: readonly EducationArticle[];
  readonly loading: boolean;
  readonly onDelete: (id: string) => void;
}

export function EducationTable({ articles, loading, onDelete }: EducationTableProps) {
  const pathname = usePathname();
  const isStaff = pathname.startsWith("/staff");

  const [deleteArticleInfo, setDeleteArticleInfo] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const handleConfirmDelete = async () => {
    if (!deleteArticleInfo || isStaff) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteArticleInfo.id);
      showToast({
        type: "success",
        title: "Berhasil",
        description: "Materi edukasi berhasil dihapus.",
      });
    } catch {
      showToast({
        type: "error",
        title: "Gagal",
        description: "Gagal menghapus materi edukasi.",
      });
    } finally {
      setIsDeleting(false);
      setDeleteArticleInfo(null);
    }
  };

  const columns: TableColumn<EducationArticle>[] = [
    {
      key: "thumbnail",
      header: "Thumbnail",
      render: (row) => (
        <div className="w-16 h-12 rounded-lg overflow-hidden bg-[#F4F6F8] border border-[#E2E8F0] relative">
          {row.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={row.thumbnail}
              alt={row.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#F0F9F8] text-[#00695C] text-xs font-bold font-[family-name:var(--font-poppins)]">
              DIBA
            </div>
          )}
        </div>
      ),
      className: "w-24",
    },
    {
      key: "title",
      header: "Judul Edukasi",
      render: (row) => (
        <div className="max-w-md">
          <Link
            href={isStaff ? `/staff/manajemen-edukasi/${row.id}` : `${ROUTES.MANAJEMEN_EDUKASI}/${row.id}`}
            className="font-bold text-[#1A202C] hover:text-[#0F766E] transition-all text-sm block truncate font-[family-name:var(--font-poppins)]"
          >
            {row.title}
          </Link>
          <span className="text-xs text-[#718096] font-medium block mt-1 font-[family-name:var(--font-poppins)]">
            {row.shortDescription}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      render: (row) => (
        <span className="text-xs font-semibold text-[#1A202C] font-[family-name:var(--font-poppins)]">
          {row.category}
        </span>
      ),
      className: "w-44",
    },
    {
      key: "duration",
      header: "Durasi",
      render: (row) => (
        <span className="text-xs font-semibold text-[#718096] font-[family-name:var(--font-poppins)]">
          {row.duration} mnt
        </span>
      ),
      className: "w-24",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={row.status === "Diterbitkan" ? "primary" : "muted"}>
          {row.status}
        </Badge>
      ),
      className: "w-32",
    },
    {
      key: "readCount",
      header: "Pembaca",
      render: (row) => (
        <span className="text-xs font-bold text-[#1A202C] font-[family-name:var(--font-poppins)]">
          {row.readCount.toLocaleString("id-ID")}
        </span>
      ),
      className: "w-28",
    },
    {
      key: "actions",
      header: "Aksi",
      render: (row) => (
        <div className="flex items-center gap-2">
          {/* Progress Link */}
          <Link
            href={isStaff ? `/staff/manajemen-edukasi/${row.id}/progress` : `${ROUTES.MANAJEMEN_EDUKASI}/${row.id}/progress`}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#E2E8F0] rounded-lg hover:bg-[#F0F9F8] hover:border-[#00695C]/30 transition-all text-[#718096] hover:text-[#00695C] text-xs font-bold"
            title="Lihat Progress Peserta"
          >
            <span className="material-symbols-outlined text-[16px]">monitoring</span>
            Progress
          </Link>
          {/* Detail Link */}
          <Link
            href={isStaff ? `/staff/manajemen-edukasi/${row.id}` : `${ROUTES.MANAJEMEN_EDUKASI}/${row.id}`}
            className="w-8 h-8 flex items-center justify-center border border-[#E2E8F0] rounded-lg hover:bg-[#F4F6F8] transition-all text-[#718096] hover:text-[#0F766E]"
            title="Lihat Detail"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </Link>
          {!isStaff && (
            <>
              {/* Edit Link */}
              <Link
                href={`${ROUTES.MANAJEMEN_EDUKASI}/${row.id}/edit`}
                className="w-8 h-8 flex items-center justify-center border border-[#E2E8F0] rounded-lg hover:bg-[#F4F6F8] transition-all text-[#718096] hover:text-[#0F766E]"
                title="Edit"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </Link>
              {/* Delete Button */}
              <button
                onClick={() => setDeleteArticleInfo({ id: row.id, title: row.title })}
                className="w-8 h-8 flex items-center justify-center border border-red-100 rounded-lg hover:bg-red-50 transition-all text-red-500 hover:text-red-700 cursor-pointer"
                title="Hapus"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </>
          )}
        </div>
      ),
      className: isStaff ? "w-28 text-center" : "w-36 text-center",
    },
  ];

  return (
    <>
      {/* Mobile Card Preview (sm:hidden) */}
      <div className="block sm:hidden space-y-4 p-4 font-[family-name:var(--font-poppins)]">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-3">
              <div className="flex gap-3">
                <Skeleton width={80} height={80} rounded="rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton width="40%" height={14} />
                  <Skeleton width="90%" height={18} />
                  <Skeleton width="60%" height={12} />
                </div>
              </div>
              <Skeleton width="100%" height={36} rounded="rounded-xl" />
            </div>
          ))
        ) : articles.length === 0 ? (
          <div className="py-12 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
            <EmptyState title="Tidak ada artikel" message="Belum ada artikel edukasi yang terdaftar." />
          </div>
        ) : (
          articles.map((row) => (
            <div
              key={row.id}
              className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-3 hover:shadow-md transition-all"
            >
              <div className="flex gap-3 items-start">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F4F6F8] border border-[#E2E8F0] shrink-0 relative">
                  {row.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={row.thumbnail}
                      alt={row.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#F0F9F8] text-[#00695C] text-xs font-bold">
                      DIBA
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-[#00695C] truncate">
                      {row.category}
                    </span>
                    <Badge variant={row.status === "Diterbitkan" ? "primary" : "muted"}>
                      {row.status}
                    </Badge>
                  </div>
                  <Link
                    href={isStaff ? `/staff/manajemen-edukasi/${row.id}` : `${ROUTES.MANAJEMEN_EDUKASI}/${row.id}`}
                    className="font-bold text-[#1A202C] text-sm hover:text-[#0F766E] transition-all line-clamp-2 leading-snug"
                  >
                    {row.title}
                  </Link>
                  <p className="text-xs text-[#718096] line-clamp-1 mt-1 font-medium">
                    {row.shortDescription}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#E2E8F0]/60 pt-2.5 text-xs text-[#718096]">
                <span className="flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  {row.duration} mnt
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[15px]">visibility</span>
                  {row.readCount.toLocaleString("id-ID")} pembaca
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-[#E2E8F0]/60 pt-2.5">
                <Link
                  href={isStaff ? `/staff/manajemen-edukasi/${row.id}/progress` : `${ROUTES.MANAJEMEN_EDUKASI}/${row.id}/progress`}
                  className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-3 border border-[#E2E8F0] rounded-xl hover:bg-[#F0F9F8] text-[#00695C] text-xs font-bold transition-all"
                  title="Lihat Progress Peserta"
                >
                  <span className="material-symbols-outlined text-[16px]">monitoring</span>
                  <span>Progress</span>
                </Link>
                <Link
                  href={isStaff ? `/staff/manajemen-edukasi/${row.id}` : `${ROUTES.MANAJEMEN_EDUKASI}/${row.id}`}
                  className="w-9 h-9 flex items-center justify-center border border-[#E2E8F0] rounded-xl text-[#718096] hover:text-[#0F766E] hover:bg-[#F4F6F8] transition-all"
                  title="Lihat Detail"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                </Link>
                {!isStaff && (
                  <>
                    <Link
                      href={`${ROUTES.MANAJEMEN_EDUKASI}/${row.id}/edit`}
                      className="w-9 h-9 flex items-center justify-center border border-[#E2E8F0] rounded-xl text-[#718096] hover:text-[#0F766E] hover:bg-[#F4F6F8] transition-all"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </Link>
                    <button
                      onClick={() => setDeleteArticleInfo({ id: row.id, title: row.title })}
                      className="w-9 h-9 flex items-center justify-center border border-red-100 rounded-xl text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                      title="Hapus"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop / Tablet Table View (hidden sm:block) */}
      <div className="hidden sm:block">
        <DataTable
          columns={columns}
          data={[...articles]}
          keyExtract={(row) => row.id}
          loading={loading}
          emptyTitle="Tidak ada artikel"
          emptyMessage="Belum ada artikel edukasi yang terdaftar."
        />
      </div>

      {!isStaff && (
        <ConfirmationModal
          open={deleteArticleInfo !== null}
          title="Hapus Materi Edukasi?"
          description="Materi yang dihapus tidak dapat dikembalikan."
          variant="danger"
          confirmText="Ya, Hapus"
          cancelText="Batal"
          loading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteArticleInfo(null)}
        />
      )}
    </>
  );
}
