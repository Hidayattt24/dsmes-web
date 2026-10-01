import { StatisticCard } from "@/components/dashboard/StatisticCard";
import { StatisticCardSkeleton } from "@/components/ui/Skeleton";
import type { DashboardSummaryCardData } from "../hooks/useStaffDashboard";
import type { MetricCard } from "@/types/dashboard";

interface DashboardSummaryCardsProps {
  readonly cards: readonly DashboardSummaryCardData[];
  readonly loading: boolean;
  readonly hasError: boolean;
}

export function DashboardSummaryCards({ cards, loading, hasError }: DashboardSummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatisticCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="premium-card p-6 flex flex-col items-center justify-center text-center min-h-[160px]"
          >
            <span className="material-symbols-outlined text-[28px] text-[#EF4444] mb-2">
              error_outline
            </span>
            <p className="text-xs font-semibold text-[#4A5568]">Gagal memuat data</p>
            <p className="text-[10px] text-[#718096] mt-1">Silakan coba lagi nanti</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card) => {
        const metricCard: MetricCard = {
          label: card.label,
          value: card.value,
          badgeVariant: card.variant,
          badgeLabel: card.change,
          icon: card.icon,
          progressBar: card.progressBar,
        };
        return <StatisticCard key={card.label} card={metricCard} />;
      })}
    </div>
  );
}
