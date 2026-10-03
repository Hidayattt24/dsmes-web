"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";
import { ErrorState } from "@/components/common/ErrorState";
import { DetailPageLoader } from "@/components/ui/loading";
import { patientService } from "@/services/patientService";
import { usePatientDetail } from "../hooks/usePatientDetail";
import type { BloodSugarLog } from "@/features/record-monitoring/types/record";
import { PatientSummaryCard } from "./PatientSummaryCard";
import { PatientProfileCard } from "./PatientProfileCard";
import { PatientPersonalInfoCard } from "./PatientPersonalInfoCard";
import { PatientMeasurementHistoryCard } from "./PatientMeasurementHistoryCard";
import { BloodSugarHistoryCard } from "@/features/record-monitoring/components/BloodSugarHistoryCard";
import { PatientCalorieChart } from "./PatientCalorieChart";
import { PatientEducationActivity, type PatientEducationSummary } from "./PatientEducationActivity";
import { EditPatientModal } from "./EditPatientModal";
import { AddMeasurementModal } from "./AddMeasurementModal";

interface PatientDetailFeatureProps {
  readonly patientId: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toBloodSugarLog(log: any): BloodSugarLog {
  const d = log.measured_at ? new Date(log.measured_at) : new Date();
  const dateStr = d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  const timeStr = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

  const mType = log.measurement_time_type || "random";
  let measurementTimeLabel = log.measurement_time_label;
  if (!measurementTimeLabel || measurementTimeLabel.includes("(")) {
    if (mType === "fasting" || mType === "puasa") measurementTimeLabel = "Puasa";
    else if (mType === "before_meal" || mType === "sebelum_makan") measurementTimeLabel = "Sebelum Makan";
    else if (mType === "after_meal" || mType === "sesudah_makan") measurementTimeLabel = "2 Jam Sesudah Makan";
    else if (mType === "before_bed" || mType === "sebelum_tidur") measurementTimeLabel = "Sebelum Tidur";
    else measurementTimeLabel = "Sewaktu";
  }

  return {
    id: log.id,
    date: dateStr,
    time: timeStr,
    glucoseValue: log.glucose_value ?? 0,
    measurementTimeType: mType,
    measurementTimeLabel,
    status: log.category || log.status || "normal",
    classificationLabel: log.category_label || log.classification_label || "Normal",
    referenceRangeText: log.reference_range_text || "< 140 mg/dL",
    recommendation: log.recommendation || "-",
    colorIndicator: log.color_indicator || "#10B981",
    rawDate: d,
  };
}

export function PatientDetailFeature({ patientId }: PatientDetailFeatureProps) {
  const { patient, bloodSugar, meals, educationActivities, isLoading, error, refetch } = usePatientDetail(patientId);
  const bloodSugarLogs = bloodSugar.map(toBloodSugarLog);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddMeasurementOpen, setIsAddMeasurementOpen] = useState(false);
  const { showToast } = useToast();

  const handleUpdatePatient = async (data: Record<string, unknown>) => {
    try {
      const res = await patientService.updatePatientByAdmin(patientId, data);
      if (res) {
        showToast({
          type: "success",
          title: "Berhasil",
          description: "Informasi pasien berhasil diperbarui.",
        });
        refetch();
      }
    } catch {
      showToast({
        type: "error",
        title: "Gagal",
        description: "Gagal memperbarui informasi pasien.",
      });
    }
  };

  const handleAddMeasurement = async (data: Record<string, unknown>) => {
    try {
      const res = await patientService.createPatientMeasurement(patientId, data);
      if (res) {
        showToast({
          type: "success",
          title: "Berhasil",
          description: "Pengukuran kesehatan berkala berhasil dicatat.",
        });
        refetch();
      }
    } catch {
      showToast({
        type: "error",
        title: "Gagal",
        description: "Gagal mencatat pengukuran kesehatan.",
      });
    }
  };

  if (isLoading) {
    return <DetailPageLoader type="patient" />;
  }

  if (error || !patient) {
    return <ErrorState message={error ?? "Pasien tidak ditemukan."} onRetry={refetch} />;
  }

  return (
    <section className="space-y-8 max-w-[1600px] mx-auto w-full p-1 font-[family-name:var(--font-poppins)]">
      {/* Back link and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/data-pasien"
            className="flex items-center gap-2 text-[#718096] hover:text-[#00695C] transition-colors font-medium text-sm"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span>Monitoring Pasien</span>
          </Link>
          <span className="text-[#718096]/40 text-sm">/</span>
          <span className="font-semibold text-sm text-[#1A202C]">
            Detail Pasien
          </span>
        </div>

        {/* Action Buttons for Admin */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-500">edit</span>
            Edit Informasi Pasien
          </button>
          <button
            type="button"
            onClick={() => setIsAddMeasurementOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#00695C] hover:bg-[#004D40] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            Catat Pengukuran Baru
          </button>
        </div>
      </div>

      {/* Patient Health Summary Card Grid */}
      <PatientSummaryCard patient={patient} />

      {/* Profile summary bento cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4">
          <PatientProfileCard patient={patient} />
        </div>
        <div className="lg:col-span-8">
          <PatientPersonalInfoCard patient={patient} />
        </div>
      </div>

      {/* Health Measurements Timeline Section */}
      <PatientMeasurementHistoryCard
        measurements={patient.measurements}
        isAdmin={true}
        onAddMeasurement={() => setIsAddMeasurementOpen(true)}
      />

      {/* Metrics & Analytics section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <BloodSugarHistoryCard logs={bloodSugarLogs} diabetesType={patient.diabetesType} />
        </div>
        <div className="lg:col-span-7">
          <PatientCalorieChart data={meals} patient={patient} />
        </div>
        <div className="lg:col-span-5">
          <PatientEducationActivity data={educationActivities as PatientEducationSummary | null} />
        </div>
      </div>

      {/* Modals */}
      <EditPatientModal
        isOpen={isEditOpen}
        patient={patient}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleUpdatePatient}
      />

      <AddMeasurementModal
        isOpen={isAddMeasurementOpen}
        patient={patient}
        onClose={() => setIsAddMeasurementOpen(false)}
        onSubmit={handleAddMeasurement}
      />
    </section>
  );
}
