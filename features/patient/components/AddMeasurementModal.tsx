"use client";

import { useState, useMemo, useEffect } from "react";
import type { Patient } from "@/types/patient";
import { calculateDSMESCalorieTarget } from "@/lib/calorieCalculator";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Portal } from "@/components/ui/Portal";

interface AddMeasurementModalProps {
  readonly isOpen: boolean;
  readonly patient: Patient;
  readonly onClose: () => void;
  readonly onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

const genderOptions: SelectOption[] = [
  { value: "laki_laki", label: "Laki-laki" },
  { value: "perempuan", label: "Perempuan" },
];

const bloodTypeOptions: SelectOption[] = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "AB", label: "AB" },
  { value: "O", label: "O" },
  { value: "Tidak Tahu", label: "Tidak Tahu" },
];

const activityOptions: SelectOption[] = [
  { value: "Sangat Rendah", label: "Sangat Rendah (Istirahat / Bedrest)" },
  { value: "Ringan", label: "Ringan (Kerja Kantor / Ringan)" },
  { value: "Sedang", label: "Sedang (Olahraga / Jalan 30-60m)" },
  { value: "Aktif", label: "Aktif (Kerja Fisik / Olahraga Berat)" },
  { value: "Sangat Aktif", label: "Sangat Aktif (Atlet / Pekerja Berat)" },
];

export function AddMeasurementModal({
  isOpen,
  patient,
  onClose,
  onSubmit,
}: AddMeasurementModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const now = new Date();
  const defaultTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const [formData, setFormData] = useState({
    measured_at: new Date().toISOString().split("T")[0],
    measurement_time: defaultTime,
    gender: patient.gender === "Perempuan" ? "perempuan" : "laki_laki",
    date_of_birth: "",
    age: String(patient.age || 40),
    blood_type: patient.bloodType || "A",
    height_cm: patient.height ? String(patient.height) : "160",
    weight_kg: patient.weight ? String(patient.weight) : "60",
    activity_level: patient.physicalActivityLevel || "Ringan",
    blood_sugar: "",
    blood_sugar_time_type: "fasting",
    waist_circumference_cm: patient.waistCircumferenceCm ? String(patient.waistCircumferenceCm) : "",
    notes: "",
  });

  // Lock body scrollbar when modal opens to eliminate scrollbar track right margin gap
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Calculate live dynamic TDEE calorie target using Mifflin-St Jeor equation when inputs change
  const liveCalorieTarget = useMemo(() => {
    const weight = parseFloat(formData.weight_kg) || patient.weight || 60;
    const height = parseFloat(formData.height_cm) || patient.height || 160;
    const age = parseInt(formData.age, 10) || patient.age || 40;

    return calculateDSMESCalorieTarget({
      gender: formData.gender,
      weightKg: weight,
      heightCm: height,
      age: age,
      activityLevel: formData.activity_level,
    });
  }, [
    formData.gender,
    formData.weight_kg,
    formData.height_cm,
    formData.age,
    formData.activity_level,
    patient.weight,
    patient.height,
    patient.age,
  ]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Combine date and time into a full ISO datetime string (WIB / UTC+7)
      const measuredAt = `${formData.measured_at}T${formData.measurement_time}:00+07:00`;

      const payload: Record<string, unknown> = {
        measured_at: measuredAt,
        notes: formData.notes,
        daily_calorie_target: liveCalorieTarget,
        gender: formData.gender,
        blood_type: formData.blood_type,
        physical_activity_level: formData.activity_level,
      };

      if (formData.weight_kg) payload.weight_kg = parseFloat(formData.weight_kg);
      if (formData.height_cm) payload.height_cm = parseFloat(formData.height_cm);
      if (formData.blood_sugar) {
        payload.blood_sugar = parseInt(formData.blood_sugar, 10);
        payload.blood_sugar_time_type = formData.blood_sugar_time_type;
      }
      if (formData.waist_circumference_cm) payload.waist_circumference_cm = parseFloat(formData.waist_circumference_cm);

      await onSubmit(payload);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Portal>
    <div className="fixed top-0 left-0 w-screen h-screen z-[9000] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto font-[family-name:var(--font-poppins)]">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Input Pengukuran Kesehatan Baru</h3>
            <p className="text-xs text-slate-500 mt-1">
              Pasien: <strong className="text-slate-700">{patient.name}</strong> • Terhubung dengan Kalkulator Kalori Mifflin-St Jeor
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tanggal Pengukuran */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Tanggal Pengukuran</label>
              <input
                type="date"
                value={formData.measured_at}
                onChange={(e) => setFormData((prev) => ({ ...prev, measured_at: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#3B67FC]/20 focus:border-[#3B67FC] transition-all"
                required
              />
            </div>

            {/* 1. Custom Select: Gender */}
            <div>
              <Select
                label="Jenis Kelamin"
                value={formData.gender}
                options={genderOptions}
                onChange={(val: string) => setFormData((prev) => ({ ...prev, gender: val as string }))}
              />
            </div>

            {/* 2. Umur */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Usia / Umur (Tahun)</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#3B67FC]/20 focus:border-[#3B67FC] transition-all"
              />
            </div>

            {/* 3. Custom Select: Golongan Darah */}
            <div>
              <Select
                label="Golongan Darah"
                value={formData.blood_type}
                options={bloodTypeOptions}
                onChange={(val: string) => setFormData((prev) => ({ ...prev, blood_type: val as "A" | "B" | "AB" | "O" }))}
              />
            </div>

            {/* 4. Custom Select: Tingkat Aktivitas Fisik */}
            <div>
              <Select
                label="Tingkat Aktivitas Fisik"
                value={formData.activity_level}
                options={activityOptions}
                onChange={(val: string) => setFormData((prev) => ({ ...prev, activity_level: val as string }))}
              />
            </div>

            {/* 5. Tinggi Badan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Tinggi Badan (cm)</label>
              <input
                type="number"
                step="0.1"
                placeholder="misal: 165"
                value={formData.height_cm}
                onChange={(e) => setFormData((prev) => ({ ...prev, height_cm: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#3B67FC]/20 focus:border-[#3B67FC] transition-all"
                required
              />
            </div>

            {/* 6. Berat Badan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Berat Badan (kg)</label>
              <input
                type="number"
                step="0.1"
                placeholder="misal: 65.5"
                value={formData.weight_kg}
                onChange={(e) => setFormData((prev) => ({ ...prev, weight_kg: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#3B67FC]/20 focus:border-[#3B67FC] transition-all"
                required
              />
            </div>

            {/* Gula Darah + Jam Pengukuran + Waktu Pengukuran */}
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Gula Darah (mg/dL)</label>
                <input
                  type="number"
                  placeholder="misal: 140"
                  value={formData.blood_sugar}
                  onChange={(e) => setFormData((prev) => ({ ...prev, blood_sugar: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#3B67FC]/20 focus:border-[#3B67FC] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Jam Pengukuran</label>
                <input
                  type="time"
                  value={formData.measurement_time}
                  onChange={(e) => setFormData((prev) => ({ ...prev, measurement_time: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#3B67FC]/20 focus:border-[#3B67FC] transition-all"
                />
              </div>
              <div>
                <Select
                  label="Waktu Pengukuran (Konteks)"
                  value={formData.blood_sugar_time_type}
                  options={[
                    { value: "fasting", label: "Puasa" },
                    { value: "before_meal", label: "Sebelum Makan" },
                    { value: "after_meal", label: "2 Jam Sesudah Makan" },
                    { value: "before_bed", label: "Sebelum Tidur" },
                    { value: "random", label: "Sewaktu" },
                  ]}
                  onChange={(val: string) => setFormData((prev) => ({ ...prev, blood_sugar_time_type: val as string }))}
                />
              </div>
            </div>

            {/* Lingkar Pinggang */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Lingkar Pinggang (cm)</label>
              <input
                type="number"
                step="0.1"
                placeholder="misal: 82.5"
                value={formData.waist_circumference_cm}
                onChange={(e) => setFormData((prev) => ({ ...prev, waist_circumference_cm: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#3B67FC]/20 focus:border-[#3B67FC] transition-all"
              />
            </div>

            {/* Live Synchronized Target Calories Calculation Result */}
            <div className="sm:col-span-2 bg-[#EEF2FF] p-4 rounded-xl border border-[#3B67FC]/20 flex items-center justify-between shadow-2xs">
              <div>
                <span className="text-[10px] font-bold text-[#3B67FC] uppercase tracking-wider block">
                  Target Kalori Harian Terhitung (Live Calculation)
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dihitung otomatis via Persamaan Mifflin-St Jeor (Gender, Usia, TB, BB &amp; Aktivitas).
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#3B67FC] font-mono">
                  {liveCalorieTarget}
                </span>
                <span className="text-xs font-bold text-[#3B67FC] ml-1">kcal/hari</span>
              </div>
            </div>

            {/* Catatan / Notes */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Catatan Observasi (Opsional)</label>
              <textarea
                rows={2}
                placeholder="misal: Pengukuran minggu ke-4 penelitian lapangan..."
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#3B67FC]/20 focus:border-[#3B67FC] transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#3B67FC] hover:bg-[#1A63ED] text-white text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Simpan..." : "Simpan Pengukuran"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </Portal>
  );
}
