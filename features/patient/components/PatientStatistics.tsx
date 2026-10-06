"use client";

import type { PatientStats } from "@/types/patient";

interface PatientStatisticsProps {
  readonly stats: PatientStats | null;
}

export function PatientStatistics({ stats }: PatientStatisticsProps) {
  const total = stats?.totalPatients ?? 0;
  const active = stats?.activePatients ?? 0;
  const youngestAge = stats?.youngestAge ?? 0;
  const oldestAge = stats?.oldestAge ?? 0;
  
  // Calculate percentage of active patients
  const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Pasien */}
      <div className="premium-card p-7 hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center justify-between mb-6">
          <span className="w-10 h-10 rounded-full bg-[#F0F9F8] text-[#00695C] flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">group</span>
          </span>
        </div>
        <h4 className="text-[11px] font-bold text-[#718096] uppercase tracking-widest mb-1 font-[family-name:var(--font-poppins)]">
          Total Pasien
        </h4>
        <p className="text-3xl font-bold text-[#1A202C] font-[family-name:var(--font-poppins)]">
          {total.toLocaleString("id-ID")}
        </p>
      </div>

      {/* Pasien Aktif Hari Ini */}
      <div className="premium-card p-7 hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center justify-between mb-6">
          <span className="w-10 h-10 rounded-full bg-[#F0F9F8] text-[#00695C] flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">person_check</span>
          </span>
          <span className="text-[10px] font-bold text-[#00695C] bg-[#F0F9F8] px-2 py-0.5 rounded-full uppercase border border-[#B2DFDB]">
            Hari Ini
          </span>
        </div>
        <h4 className="text-[11px] font-bold text-[#718096] uppercase tracking-widest mb-1 font-[family-name:var(--font-poppins)]">
          Pasien Aktif Hari Ini
        </h4>
        <p className="text-3xl font-bold text-[#1A202C] font-[family-name:var(--font-poppins)]">
          {active.toLocaleString("id-ID")}
        </p>
        <div className="w-full bg-[#F4F6F8] h-1.5 rounded-full mt-4 overflow-hidden">
          <div 
            className="bg-[#00695C] h-full rounded-full transition-all duration-500" 
            style={{ width: `${activePercent}%` }}
          />
        </div>
      </div>

      {/* Usia Termuda */}
      <div className="premium-card p-7 hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center justify-between mb-6">
          <span className="w-10 h-10 rounded-full bg-[#EBF8FF] text-[#2B6CB0] flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">child_care</span>
          </span>
          <span className="text-[10px] font-bold text-[#2B6CB0] bg-[#EBF8FF] px-2 py-0.5 rounded-full uppercase border border-[#BEE3F8]">
            Termuda
          </span>
        </div>
        <h4 className="text-[11px] font-bold text-[#718096] uppercase tracking-widest mb-1 font-[family-name:var(--font-poppins)]">
          Usia Termuda
        </h4>
        <p className="text-3xl font-bold text-[#1A202C] font-[family-name:var(--font-poppins)]">
          {youngestAge}{" "}
          <span className="text-sm text-[#718096] font-normal">Tahun</span>
        </p>
        <p className="text-xs text-[#718096] mt-2 font-medium">
          Pasien Termuda
        </p>
      </div>

      {/* Usia Tertua */}
      <div className="premium-card p-7 hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center justify-between mb-6">
          <span className="w-10 h-10 rounded-full bg-[#FFFBEB] text-[#B45309] flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">elderly</span>
          </span>
          <span className="text-[10px] font-bold text-[#B45309] bg-[#FFFBEB] px-2 py-0.5 rounded-full uppercase border border-[#FEF3C7]">
            Tertua
          </span>
        </div>
        <h4 className="text-[11px] font-bold text-[#718096] uppercase tracking-widest mb-1 font-[family-name:var(--font-poppins)]">
          Usia Tertua
        </h4>
        <p className="text-3xl font-bold text-[#1A202C] font-[family-name:var(--font-poppins)]">
          {oldestAge}{" "}
          <span className="text-sm text-[#718096] font-normal">Tahun</span>
        </p>
        <p className="text-xs text-[#718096] mt-2 font-medium">
          Pasien Tertua
        </p>
      </div>
    </div>
  );
}
