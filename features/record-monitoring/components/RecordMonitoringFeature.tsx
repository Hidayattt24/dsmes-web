"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRecordMonitoring } from "../hooks/useRecordMonitoring";
import { RecordMonitoringStats } from "./RecordMonitoringStats";
import { RecordMonitoringFilters } from "./RecordMonitoringFilters";
import { RecordMonitoringTable } from "./RecordMonitoringTable";
import { MonitoringTabs } from "./MonitoringTabs";
import { StaffPriorityPatientTable } from "./StaffPriorityPatientTable";
import { IncreasingTrendTable } from "./IncreasingTrendTable";
import { MedicalGuideInfoModal } from "@/components/common/MedicalGuideInfoModal";

export function RecordMonitoringFeature() {
  const pageRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isStaff = pathname.startsWith("/staff");

  const [activeTab, setActiveTab] = useState("semua");
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const {
    patients,
    stats,
    isLoading,
    searchQuery,
    complianceFilter,
    riskFilter,
    genderFilter,
    sortBy,
    sortOrder,
    pagination,
    setSearchQuery,
    setComplianceFilter,
    setRiskFilter,
    setGenderFilter,
    setSortBy,
    setPage,
  } = useRecordMonitoring();

  const priorityPatients = patients.filter((p) => {
    const s = (p.dailySummary.status ?? "").toLowerCase();
    return (
      s === "prediabetes" ||
      s === "elevated" ||
      s === "hyperglycemia" ||
      s === "hipoglikemia"
    );
  });

  const trendPatients = patients.filter((p) => {
    const bs = p.dailySummary.avgBloodSugar;
    const latest = parseInt(p.dailySummary.bloodSugar) || 0;
    return bs ? latest > bs * 1.1 : false;
  });

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        "[data-page-section]",
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.06,
          ease: "power2.out",
        },
      );
    },
    { scope: pageRef },
  );

  return (
    <div ref={pageRef} className="space-y-8 max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)]">
      <div data-page-section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A202C] tracking-tight">
            Monitoring Record Pasien
          </h2>
          <p className="text-sm text-[#718096] mt-1">
            Pantau aktivitas harian dan catatan kesehatan seluruh pasien
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsGuideOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-bold text-[#3B67FC] shadow-sm transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">menu_book</span>
          <span>Panduan Standar</span>
        </button>
      </div>

      <MedicalGuideInfoModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <div data-page-section><RecordMonitoringStats stats={stats} /></div>

      <div data-page-section>
        <RecordMonitoringFilters
          searchQuery={searchQuery}
          complianceFilter={complianceFilter}
          riskFilter={riskFilter}
          genderFilter={genderFilter}
          onSearchChange={setSearchQuery}
          onComplianceChange={setComplianceFilter}
          onRiskChange={setRiskFilter}
          onGenderChange={setGenderFilter}
        />
      </div>

      {isStaff && (
        <div data-page-section><MonitoringTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={
            [
              {
                id: "semua",
                label: "Semua Pasien",
                icon: "group",
                badgeCount: pagination.total,
              },
              {
                id: "prioritas",
                label: "Pasien Prioritas Hari Ini",
                icon: "emergency",
                badgeCount: priorityPatients.length,
              },
              {
                id: "tren",
                label: "Pasien dengan Tren Meningkat",
                icon: "trending_up",
                badgeCount: trendPatients.length,
              },
            ] as const
          }
        /></div>
      )}

      <div data-page-section className="premium-card overflow-hidden">
        {isStaff ? (
          <>
            {activeTab === "semua" && (
              <RecordMonitoringTable
                patients={patients}
                loading={isLoading}
                sortBy={sortBy}
                sortOrder={sortOrder}
                pagination={pagination}
                onSort={setSortBy}
                onPageChange={setPage}
              />
            )}
            {activeTab === "prioritas" && (
              <StaffPriorityPatientTable
                patients={priorityPatients}
                loading={isLoading}
              />
            )}
            {activeTab === "tren" && (
              <IncreasingTrendTable
                patients={trendPatients}
                loading={isLoading}
              />
            )}
          </>
        ) : (
          <RecordMonitoringTable
            patients={patients}
            loading={isLoading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            pagination={pagination}
            onSort={setSortBy}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
