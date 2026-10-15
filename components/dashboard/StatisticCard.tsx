import { Badge } from "@/components/ui/Badge";
import type { MetricCard } from "@/types/dashboard";

interface StatisticCardProps {
  readonly card: MetricCard;
}

export function StatisticCard({ card }: StatisticCardProps) {
  const isPrimary = card.badgeVariant === "primary";

  return (
    <div className="premium-card p-6 flex flex-col items-start hover:-translate-y-1 transition-all duration-300 cursor-default">
      {/* Icon + Badge row */}
      <div className="w-full flex justify-between items-start mb-6">
        <span
          className={[
            "w-12 h-12 rounded-2xl flex items-center justify-center",
            isPrimary
              ? "bg-[#EEF2FF] text-[#3B67FC]"
              : "bg-[#F4F6F8] text-[#718096]",
          ].join(" ")}
        >
          <span className="material-symbols-outlined text-[22px]">
            {card.icon}
          </span>
        </span>
        {card.badgeLabel && (
          <Badge variant={card.badgeVariant}>{card.badgeLabel}</Badge>
        )}
      </div>

      {/* Label */}
      <h4 className="text-[11px] font-bold text-[#718096] uppercase tracking-widest mb-1 font-[family-name:var(--font-poppins)]">
        {card.label}
      </h4>

      {/* Value */}
      <p className="text-3xl font-bold text-[#1A202C] font-[family-name:var(--font-poppins)]">
        {typeof card.value === "number" ? card.value.toLocaleString("id-ID") : card.value}
      </p>

      {/* Optional Progress Bar */}
      {card.progressBar !== undefined && (
        <div className="w-full mt-4">
          <div className="w-full bg-[#E2E8F0] rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(Math.max(card.progressBar, 0), 100)}%`,
                backgroundColor: isPrimary ? "#3B67FC" : "#F59E0B",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
