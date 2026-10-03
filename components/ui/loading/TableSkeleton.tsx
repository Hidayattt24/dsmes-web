import { Skeleton } from "@/components/ui/Skeleton";

interface TableSkeletonProps {
  readonly rows?: number;
}

/** Skeleton for the data-table area only (header, filters stay mounted). */
export function TableSkeleton({ rows = 5 }: TableSkeletonProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden animate-pulse">
      <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-6 py-4 flex justify-between items-center">
        <Skeleton width={120} height={16} />
        <Skeleton width={80} height={16} />
      </div>
      <div className="divide-y divide-[#E2E8F0] px-6">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="py-4 flex justify-between items-center gap-6">
            <div className="space-y-2 flex-1">
              <Skeleton width="40%" height={14} />
              <Skeleton width="20%" height={10} />
            </div>
            <Skeleton width={100} height={14} />
            <Skeleton width={120} height={14} />
            <Skeleton width={80} height={32} rounded="rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
