"use client";

import type { PatientRecord } from "../types/record";
import { calculateDSMESCalorieTarget } from "@/lib/calorieCalculator";

interface RecordPatientSummaryCardProps {
  readonly patient: PatientRecord;
}

function getBmiStatus(bmi?: number) {
  if (!bmi) return { label: "-", color: "text-slate-600 bg-slate-50 border-slate-100" };
  if (bmi < 18.5) return { label: "Kurus", color: "text-amber-700 bg-amber-50 border-amber-100" };
  if (bmi < 25) return { label: "Normal", color: "text-emerald-700 bg-emerald-50 border-emerald-100" };
  if (bmi < 30) return { label: "Gemuk", color: "text-orange-700 bg-orange-50 border-orange-100" };
  return { label: "Obesitas", color: "text-rose-700 bg-rose-50 border-rose-100" };
}

export function RecordPatientSummaryCard({ patient }: RecordPatientSummaryCardProps) {
  const bmiStatus = getBmiStatus(patient.bmi);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full font-[family-name:var(--font-poppins)]">
      <div className="premium-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center justify-between mb-4">
          <span className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">bloodtype</span>
          </span>
          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full uppercase border border-rose-100">
            Glukosa
          </span>
        </div>
        <div>
          <h4 className="text-[10px] font-bold text-[#718096] uppercase tracking-widest mb-1">
            Gula Darah Terakhir
          </h4>
          <p className="text-2xl font-bold text-[#1A202C]">
            {patient.latestBloodSugar ? `${patient.latestBloodSugar} ` : "- "}
            <span className="text-xs font-semibold text-[#718096]">mg/dL</span>
          </p>
          <p className="text-xs text-[#718096] mt-2 font-medium">
            Rata-rata: {patient.averageBloodSugar ? `${Math.round(patient.averageBloodSugar)} mg/dL` : "-"}
          </p>
        </div>
      </div>

      <div className="premium-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center justify-between mb-4">
          <span className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">fitness_center</span>
          </span>
          {patient.bmi && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${bmiStatus.color}`}>
              {bmiStatus.label}
            </span>
          )}
        </div>
        <div>
          <h4 className="text-[10px] font-bold text-[#718096] uppercase tracking-widest mb-1">
            Berat Badan / BMI
          </h4>
          <p className="text-2xl font-bold text-[#1A202C]">
            {patient.weight ? `${patient.weight} ` : "- "}
            <span className="text-xs font-semibold text-[#718096]">kg</span>
          </p>
          <p className="text-xs text-[#718096] mt-2 font-medium">
            BMI: {patient.bmi ? patient.bmi.toFixed(1) : "-"}
          </p>
        </div>
      </div>

      {/* 3. Compliance & Calorie Target Status Card */}
      {(() => {
        const cal = patient.calorieStatusInfo;
        const getTheme = (code?: string) => {
          switch (code) {
            case "excellent":
              return {
                badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
                icon: "bg-emerald-50 text-emerald-600",
                bar: "bg-emerald-500",
              };
            case "slightly_below":
              return {
                badge: "bg-blue-50 text-blue-700 border-blue-200",
                icon: "bg-blue-50 text-blue-600",
                bar: "bg-blue-500",
              };
            case "below":
            case "above":
              return {
                badge: "bg-amber-50 text-amber-700 border-amber-200",
                icon: "bg-amber-50 text-amber-600",
                bar: "bg-amber-500",
              };
            case "very_low":
            case "excessive":
            default:
              return {
                badge: "bg-rose-50 text-rose-700 border-rose-200",
                icon: "bg-rose-50 text-rose-600",
                bar: "bg-rose-500",
              };
          }
        };

        const theme = getTheme(cal?.calorieStatusCode);
        const target = calculateDSMESCalorieTarget(patient);
        const consumed = cal?.consumedCalories ?? 0;
        const achievement = target > 0 ? Math.round((consumed / target) * 1000) / 10 : 0;
        const diffStr = cal?.calorieDifferenceStr ?? `${consumed - target} kcal`;
        const statusLabel = cal?.calorieStatus ?? "Asupan Sangat Rendah";
        const desc = cal?.calorieDescription ?? "Pasien mengonsumsi kalori sangat rendah dari target.";

        return (
          <div className="premium-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className={`w-10 h-10 rounded-full flex items-center justify-center ${theme.icon}`}>
                <span className="material-symbols-outlined text-[20px]">restaurant</span>
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${theme.badge}`}>
                {statusLabel}
              </span>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-[#718096] uppercase tracking-widest mb-1">
                Target & Asupan Kalori (Hari Ini)
              </h4>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold text-[#1A202C]">
                  {consumed.toLocaleString("id-ID")}{" "}
                  <span className="text-xs font-semibold text-[#718096]">/ {target.toLocaleString("id-ID")} kcal</span>
                </p>
                <span className="text-xs font-extrabold text-[#1A202C]">
                  {achievement}%
                </span>
              </div>

              {/* Progress Bar Indicator */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden my-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${theme.bar}`}
                  style={{ width: `${Math.min(100, Math.max(0, achievement))}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] font-semibold text-[#718096] mt-1">
                <span>Beda: <strong className="text-[#1A202C]">{diffStr}</strong></span>
                <span>Kepatuhan 7H: <strong className="text-[#00695C]">{Math.round(patient.weeklyCompliance ?? patient.compliance)}%</strong></span>
              </div>
              <p className="text-[11px] text-[#718096] mt-2 font-medium leading-tight">
                {desc}
              </p>
            </div>
          </div>
        );
      })()}

      <div className="premium-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center justify-between mb-4">
          <span className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">directions_walk</span>
          </span>
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase border border-amber-100">
            Aktivitas
          </span>
        </div>
        <div>
          <h4 className="text-[10px] font-bold text-[#718096] uppercase tracking-widest mb-1">
            Aktivitas Terakhir
          </h4>
          <p className="text-sm font-bold text-[#1A202C] truncate max-w-full">
            {patient.latestActivityName ?? "Belum ada catatan"}
          </p>
          <p className="text-xs text-[#718096] mt-2 font-medium truncate">
            {patient.latestActivityTime
              ? new Date(patient.latestActivityTime).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
