import { Skeleton } from "@/components/ui/Skeleton";

interface QuizListSkeletonProps {
  readonly isStaff: boolean;
}

export function QuizListSkeleton({ isStaff }: QuizListSkeletonProps) {
  return (
    <div
      className="space-y-8 max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)]"
      aria-label="Memuat daftar kuesioner"
      aria-busy="true"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-3 w-80 max-w-full" />
        </div>
        {!isStaff && <Skeleton className="h-12 w-52" rounded="rounded-xl" />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4"
          >
            <Skeleton className="h-12 w-12" rounded="rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row gap-4 items-center w-full">
        <Skeleton className="h-12 w-full flex-1" rounded="rounded-xl" />
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-12 w-full sm:w-44 shrink-0"
            rounded="rounded-xl"
          />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-7 w-32" rounded="rounded-full" />
        </div>

        <div className="overflow-hidden">
          <div className="min-w-[1120px]">
            <div className="grid grid-cols-[2fr_1fr_.8fr_1.5fr_1.4fr_.5fr_.8fr_1fr] gap-5 px-6 py-4 border-b border-[#E2E8F0]">
              {["w-32", "w-16", "w-14", "w-24", "w-20", "w-8", "w-14", "w-12"].map(
                (width, index) => <Skeleton key={index} className={`h-3 ${width}`} />,
              )}
            </div>

            <div className="divide-y divide-[#E2E8F0]/60">
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid grid-cols-[2fr_1fr_.8fr_1.5fr_1.4fr_.5fr_.8fr_1fr] gap-5 items-center px-6 py-4"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-44" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-6 w-20" rounded="rounded-md" />
                  <Skeleton className="h-4 w-32" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-7 w-20" rounded="rounded-full" />
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8" rounded="rounded-lg" />
                    <Skeleton className="h-8 w-8" rounded="rounded-lg" />
                    <Skeleton className="h-8 w-8" rounded="rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
          <Skeleton className="h-3 w-48" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-8" rounded="rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
