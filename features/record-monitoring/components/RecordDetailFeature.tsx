"use client";

import { usePathname } from "next/navigation";
import { useRecordDetail } from "../hooks/useRecordDetail";
import { RecordPatientSummaryCard } from "./RecordPatientSummaryCard";
import { RecordPatientProfileCard } from "./RecordPatientProfileCard";
import { BloodSugarHistoryCard } from "./BloodSugarHistoryCard";
import { MealHistoryCard } from "./MealHistoryCard";
import { ActivityHistoryCard } from "./ActivityHistoryCard";
import { MedicationComplianceCard } from "./MedicationComplianceCard";
import { PatientActivityAnalyticsCard } from "./PatientActivityAnalyticsCard";
import { ErrorState } from "@/components/common/ErrorState";
import { DetailPageLoader } from "@/components/ui/loading";
import { BackButton } from "@/components/common/BackButton";

import { PatientMeasurementHistoryCard } from "@/features/patient/components/PatientMeasurementHistoryCard";
import { calculateDSMESCalorieTarget } from "@/lib/calorieCalculator";

interface RecordDetailFeatureProps {
  readonly patientId: string;
}

export function RecordDetailFeature({ patientId }: RecordDetailFeatureProps) {
  const pathname = usePathname();
  const isStaff = pathname.startsWith("/staff");
  const listHref = isStaff ? "/staff/pemantauan-catatan-pasien" : "/admin/pemantauan-catatan-pasien";

  const {
    patient,
    bloodSugarLogs,
    mealLogs,
    activityLogs,
    medicationLogs,
    activityAnalytics,
    analyticsDays,
    setAnalyticsDays,
    isAnalyticsLoading,
    isLoading,
    error,
    refetch,
    mealDate,
    setMealDate,
    activityDate,
    setActivityDate,
    medicationDate,
    setMedicationDate,
    isMealLoading,
    isActivityLoading,
    isMedicationLoading,
  } = useRecordDetail(patientId);

  if (isLoading) {
    return <DetailPageLoader type="record" />;
  }

  if (error || !patient) {
    return <ErrorState message={error ?? "Data catatan pasien tidak ditemukan."} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)]">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
          <div className="mb-2">
            <BackButton href={listHref} label="Data Pasien" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-[#1A202C]">{patient.name}</h2>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
              patient.compliance >= 75
                ? "bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]"
                : patient.compliance >= 60
                ? "bg-[#EBF8FF] text-[#2B6CB0] border border-[#BEE3F8]"
                : patient.compliance >= 40
                ? "bg-[#FFFBEB] text-[#B45309] border border-[#FEF3C7]"
                : "bg-[#FFF5F5] text-[#C53030] border border-[#FED7D7]"
            }`}>
              <span className="material-symbols-outlined text-[14px] mr-1">task_alt</span>
              {patient.complianceLabel || (patient.compliance >= 75 ? "Patuh" : "Kurang")} ({patient.compliance}%)
            </span>
          </div>
          {patient.puskesmas && patient.puskesmas !== "-" && (
            <p className="text-xs font-medium text-[#718096] mt-1">
              {patient.puskesmas}
            </p>
          )}
        </div>
      </header>

      <RecordPatientSummaryCard patient={patient} />

      <RecordPatientProfileCard patient={patient} />

      <PatientMeasurementHistoryCard
        measurements={patient.measurements}
        isAdmin={false}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <BloodSugarHistoryCard logs={bloodSugarLogs} diabetesType={patient.diabetesType} />
        <MealHistoryCard
          logs={mealLogs}
          targetCalories={patient.dailyCalorieTarget || calculateDSMESCalorieTarget(patient)}
          selectedDate={mealDate}
          onDateChange={setMealDate}
          isLoading={isMealLoading}
        />
        <ActivityHistoryCard
          logs={activityLogs}
          selectedDate={activityDate}
          onDateChange={setActivityDate}
          isLoading={isActivityLoading}
        />
        <MedicationComplianceCard
          logs={medicationLogs}
          selectedDate={medicationDate}
          onDateChange={setMedicationDate}
          isLoading={isMedicationLoading}
        />
      </div>

      <div className="pb-12">
        <PatientActivityAnalyticsCard
          analytics={activityAnalytics}
          selectedDays={analyticsDays}
          onDaysChange={setAnalyticsDays}
          isLoading={isAnalyticsLoading}
        />
      </div>
    </div>
  );
}
