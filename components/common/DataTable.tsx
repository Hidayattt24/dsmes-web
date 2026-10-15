import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";

export interface TableColumn<T> {
  readonly key:       string;
  readonly header:    string;
  readonly render:    (row: T) => ReactNode;
  readonly className?: string;
}

interface DataTableProps<T> {
  readonly columns:    TableColumn<T>[];
  readonly data:       T[];
  readonly keyExtract: (row: T) => string;
  readonly loading?:   boolean;
  readonly emptyTitle?: string;
  readonly emptyMessage?: string;
  readonly skeletonRows?: number;
}

export function DataTable<T>({
  columns,
  data,
  keyExtract,
  loading       = false,
  emptyTitle    = "Tidak ada data",
  emptyMessage  = "Belum ada data yang tersedia.",
  skeletonRows  = 4,
}: DataTableProps<T>) {
  // Mobile Column Mapping Helpers
  const titleCol = columns.find(
    (c) =>
      ["name", "title", "patient", "judul", "username"].includes(c.key.toLowerCase()) ||
      c.header.toLowerCase().includes("nama") ||
      c.header.toLowerCase().includes("judul") ||
      c.header.toLowerCase().includes("pasien") ||
      c.header.toLowerCase().includes("materi")
  ) ?? columns[0];

  const statusCol = columns.find(
    (c) => c.key.toLowerCase() === "status" || c.header.toLowerCase().includes("status")
  );

  const roleCol = columns.find(
    (c) =>
      ["role", "peran", "puskesmas", "category", "kategori"].includes(c.key.toLowerCase()) ||
      c.header.toLowerCase().includes("peran") ||
      c.header.toLowerCase().includes("role") ||
      c.header.toLowerCase().includes("kategori")
  );

  const dateCol = columns.find(
    (c) =>
      ["createdat", "lastactive", "completiondate", "date", "duration", "tanggal", "waktu"].some((k) =>
        c.key.toLowerCase().includes(k)
      ) ||
      ["tanggal", "aktif", "durasi", "dibuat"].some((k) => c.header.toLowerCase().includes(k))
  );

  const actionCol = columns.find(
    (c) =>
      ["action", "actions", "aksi"].includes(c.key.toLowerCase()) ||
      c.header.toLowerCase().includes("aksi") ||
      c.header.toLowerCase().includes("action")
  );

  const detailCols = columns.filter(
    (c) => c !== titleCol && c !== statusCol && c !== roleCol && c !== actionCol
  );

  const MobileSkeletonCard = () => (
    <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2 flex-1">
          <Skeleton height={18} width="65%" />
          <Skeleton height={14} width="40%" />
        </div>
        <Skeleton height={20} width={60} rounded="rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 border-t border-b border-[#E2E8F0]/50 py-3">
        <div className="space-y-1.5">
          <Skeleton height={10} width="35%" />
          <Skeleton height={14} width="70%" />
        </div>
        <div className="space-y-1.5">
          <Skeleton height={10} width="40%" />
          <Skeleton height={14} width="60%" />
        </div>
      </div>
      <div className="flex justify-between items-center gap-4">
        <Skeleton height={14} width={100} />
        <Skeleton height={32} width={70} rounded="rounded-xl" />
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Mobile Stacked Card View (hidden on tablet and desktop) */}
      <div className="block sm:hidden space-y-4 px-4 py-3">
        {loading ? (
          Array.from({ length: skeletonRows }).map((_, i) => <MobileSkeletonCard key={i} />)
        ) : data.length === 0 ? (
          <div className="py-12 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
            <EmptyState title={emptyTitle} message={emptyMessage} />
          </div>
        ) : (
          data.map((row) => (
            <div
              key={keyExtract(row)}
              className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4 hover:shadow-md transition-shadow duration-300 relative group"
            >
              {/* Card Header: Title + Role + Status */}
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-[#1A202C] leading-snug">
                    {titleCol ? titleCol.render(row) : null}
                  </div>
                  {roleCol && <div className="mt-2 shrink-0">{roleCol.render(row)}</div>}
                </div>
                {statusCol && <div className="shrink-0">{statusCol.render(row)}</div>}
              </div>

              {/* Card Body: Dynamic Detail Key-Values */}
              {detailCols.length > 0 && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 border-t border-b border-[#E2E8F0]/50 py-3.5 text-xs">
                  {detailCols.map((col) => (
                    <div key={col.key} className="flex flex-col min-w-0">
                      <span className="text-[#718096] font-bold uppercase tracking-wider text-[9px] mb-1 truncate">
                        {col.header}
                      </span>
                      <div className="text-[#1A202C] font-semibold truncate leading-none">
                        {col.render(row)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Card Footer: Date + Action Buttons */}
              <div className="flex justify-between items-center gap-4 text-xs font-[family-name:var(--font-poppins)]">
                <div className="text-[#718096] flex items-center gap-1.5">
                  {dateCol ? (
                    <>
                      <span className="material-symbols-outlined text-[16px] select-none text-[#718096]/80">
                        calendar_today
                      </span>
                      <span>{dateCol.render(row)}</span>
                    </>
                  ) : null}
                </div>
                {actionCol && <div className="shrink-0 flex gap-2 justify-end">{actionCol.render(row)}</div>}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop / Tablet Grid View (hidden on mobile, supports scroll on tablet) */}
      <div className="hidden sm:block overflow-x-auto w-full">
        <table className="w-full text-left">
          <thead className="bg-[#F4F6F8]/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={[
                    "px-8 py-5 text-[11px] font-bold text-[#718096]",
                    "uppercase tracking-widest whitespace-nowrap",
                    col.className ?? "",
                  ].join(" ")}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]/50">
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-8 py-5">
                      <Skeleton height={20} />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-8 py-16">
                  <EmptyState title={emptyTitle} message={emptyMessage} />
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyExtract(row)}
                  className="hover:bg-[#F4F6F8]/30 transition-colors group"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-8 py-5 ${col.className ?? ""}`}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
