interface ComplianceStatusBadgeProps {
  readonly today?: number;
  readonly fallback?: number;
  readonly weekly?: number;
  readonly weeklyLabel?: string;
}

/**
 * Shared compliance badge: primary badge shows today's compliance, the
 * sub-text shows the 7-day trend. Used by Data Pasien and Pemantauan Catatan
 * (admin and staff) so the rules stay identical.
 */
export function ComplianceStatusBadge({
  today,
  fallback,
  weekly,
  weeklyLabel,
}: ComplianceStatusBadgeProps) {
  const comp = Math.round(today ?? fallback ?? 0);
  let badgeStyle = "bg-[#F7FAFC] text-[#718096] border-gray-200";
  let label = "Belum Ada Catatan Hari Ini";
  if (comp >= 70) {
    badgeStyle = "bg-[#F0FDF4] text-[#166534] border-emerald-200";
    label = `Patuh Hari Ini (${comp}%)`;
  } else if (comp >= 40) {
    badgeStyle = "bg-[#FFFBEB] text-[#B45309] border-amber-200";
    label = `Cukup (${comp}%)`;
  } else if (comp > 0) {
    badgeStyle = "bg-[#FFF5F5] text-[#C53030] border-red-200";
    label = `Kurang (${comp}%)`;
  }
  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-[11px] font-bold border tracking-tight ${badgeStyle}`}
      >
        {label}
      </span>
      {typeof weekly === "number" && (
        <span className="text-[10px] text-[#718096]" title="Tren kepatuhan 7 hari terakhir">
          Tren 7 Hari: {Math.round(weekly)}%
          {weeklyLabel ? ` (${weeklyLabel})` : ""}
        </span>
      )}
    </div>
  );
}
