"use client";

import type { RecordMonitoringStats as StatsType } from "../types/record";

interface RecordMonitoringStatsProps {
  readonly stats: StatsType | null;
}

export function RecordMonitoringStats({ stats }: RecordMonitoringStatsProps) {
  const bloodSugarCount = stats?.totalBloodSugarRecords ?? 0;
  const mealCount = stats?.totalMealRecords ?? 0;
  const activityCount = stats?.totalActivityRecords ?? 0;
  const medicationCount = stats?.totalMedicationRecords ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Gula Darah */}
      <div className="premium-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 group">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-2xl">bloodtype</span>
        </div>
        <div>
          <p className="text-xs font-bold text-[#718096] uppercase tracking-widest mb-1 font-[family-name:var(--font-poppins)]">
            Catatan Gula Darah
          </p>
          <p className="text-2xl font-bold text-[#1A202C] font-[family-name:var(--font-poppins)]">
            {bloodSugarCount.toLocaleString("id-ID")}{" "}
            <span className="text-xs font-semibold text-[#718096] lowercase">Catatan</span>
          </p>
        </div>
      </div>

      {/* Makanan */}
      <div className="premium-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 group">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-2xl">restaurant</span>
        </div>
        <div>
          <p className="text-xs font-bold text-[#718096] uppercase tracking-widest mb-1 font-[family-name:var(--font-poppins)]">
            Catatan Makanan
          </p>
          <p className="text-2xl font-bold text-[#1A202C] font-[family-name:var(--font-poppins)]">
            {mealCount.toLocaleString("id-ID")}{" "}
            <span className="text-xs font-semibold text-[#718096] lowercase">Catatan</span>
          </p>
        </div>
      </div>

      {/* Aktivitas */}
      <div className="premium-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 group">
        <div className="w-12 h-12 rounded-full bg-[#EEF2FF] text-[#3B67FC] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-2xl">directions_run</span>
        </div>
        <div>
          <p className="text-xs font-bold text-[#718096] uppercase tracking-widest mb-1 font-[family-name:var(--font-poppins)]">
            Aktivitas Fisik
          </p>
          <p className="text-2xl font-bold text-[#1A202C] font-[family-name:var(--font-poppins)]">
            {activityCount.toLocaleString("id-ID")}{" "}
            <span className="text-xs font-semibold text-[#718096] lowercase">Catatan</span>
          </p>
        </div>
      </div>

      {/* Obat */}
      <div className="premium-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 group">
        <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-2xl">medication</span>
        </div>
        <div>
          <p className="text-xs font-bold text-[#718096] uppercase tracking-widest mb-1 font-[family-name:var(--font-poppins)]">
            Kepatuhan Obat
          </p>
          <p className="text-2xl font-bold text-[#1A202C] font-[family-name:var(--font-poppins)]">
            {medicationCount.toLocaleString("id-ID")}{" "}
            <span className="text-xs font-semibold text-[#718096] lowercase">Catatan</span>
          </p>
        </div>
      </div>
    </div>
  );
}
