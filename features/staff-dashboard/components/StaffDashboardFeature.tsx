"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useStaffDashboard } from "../hooks/useStaffDashboard";
import { DashboardSummaryCards } from "./DashboardSummaryCards";
import { MonitoringCharts } from "./MonitoringCharts";
import { PriorityPatientTable } from "./PriorityPatientTable";
import { TrendPatientTable } from "./TrendPatientTable";
import { MedicalGuideInfoModal } from "@/components/common/MedicalGuideInfoModal";

export function StaffDashboardFeature() {
  const { user } = useAuth();
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const {
    isLoading,
    hasError,
    summaryCards,
    physicalActivity,
    foodIntake,
    medicationAdherence,
    foodPatients,
    activityPatients,
    medicationPatients,
    priorityPatients,
    trendPatients,
    foodRange,
    activityRange,
    adherenceRange,
    trendRange,
    setFoodRange,
    setActivityRange,
    setAdherenceRange,
    setTrendRange,
  } = useStaffDashboard();

  const puskesmasName = user?.puskesmas
    ? user.puskesmas.toLowerCase().startsWith("puskesmas")
      ? user.puskesmas
      : `Puskesmas ${user.puskesmas}`
    : "";

  return (
    <div className="space-y-6 sm:space-y-8 max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)]">
      {/* Welcome Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A202C] tracking-tight">
            Dashboard Pemantauan {puskesmasName ? `- ${puskesmasName}` : ""}
          </h2>
          <p className="text-xs sm:text-sm text-[#718096] mt-1">
            Pantau status kesehatan dan grafik tren populasi pasien diabetes {puskesmasName ? `di ${puskesmasName}` : ""} secara menyeluruh
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsGuideOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-bold text-[#00695C] shadow-sm transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">menu_book</span>
          <span>Panduan Standar</span>
        </button>
      </div>

      <MedicalGuideInfoModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Summary Cards */}
      <DashboardSummaryCards
        cards={summaryCards}
        loading={isLoading}
        hasError={hasError}
      />

      {/* Population Trends & Distribution Charts */}
      <div className="space-y-6">
        <div className="border-b border-[#E2E8F0] pb-2">
          <h3 className="text-lg font-bold text-[#1A202C]">
            Metrik Kesehatan Populasi
          </h3>
          <p className="text-xs text-[#718096] mt-0.5">
            Grafik statistik agregasi dari seluruh catatan harian pasien
          </p>
        </div>
        <MonitoringCharts
          physicalActivity={physicalActivity}
          foodIntake={foodIntake}
          medicationAdherence={medicationAdherence}
          foodPatients={foodPatients}
          activityPatients={activityPatients}
          medicationPatients={medicationPatients}
          foodRange={foodRange}
          activityRange={activityRange}
          adherenceRange={adherenceRange}
          onFoodRangeChange={setFoodRange}
          onActivityRangeChange={setActivityRange}
          onAdherenceRangeChange={setAdherenceRange}
        />
      </div>

      {/* Monitoring Tables (Stacked Vertically, Full Width) */}
      <div className="flex flex-col gap-8 w-full">
        <PriorityPatientTable patients={priorityPatients} loading={isLoading} />
        <TrendPatientTable
          patients={trendPatients}
          loading={isLoading}
          trendRange={trendRange}
          onTrendRangeChange={setTrendRange}
        />
      </div>
    </div>
  );
}
