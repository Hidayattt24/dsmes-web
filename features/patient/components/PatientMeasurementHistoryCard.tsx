"use client";

import { useState } from "react";
import type { PatientMeasurement } from "@/types/patient";
import { calculateDSMESCalorieTarget } from "@/lib/calorieCalculator";

interface PatientMeasurementHistoryCardProps {
  readonly measurements?: PatientMeasurement[];
  readonly isAdmin?: boolean;
  readonly onAddMeasurement?: () => void;
}

export function PatientMeasurementHistoryCard({
  measurements = [],
  isAdmin = false,
  onAddMeasurement,
}: PatientMeasurementHistoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleMeasurements = isExpanded ? measurements : measurements.slice(0, 3);

  return (
    <div className="premium-card p-6 w-full font-[family-name:var(--font-poppins)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#3B67FC]/10 text-[#3B67FC] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">history</span>
            </span>
            <h3 className="font-bold text-lg text-[#1A202C]">
              Riwayat Pengukuran Kesehatan Pasien
            </h3>
          </div>
          <p className="text-xs text-[#718096] mt-1 ml-10">
            Jejak historis data antropometri & pengukuran kesehatan Berkala (Sesuai Protokol Penelitian Field Research).
          </p>
        </div>

        {isAdmin && onAddMeasurement && (
          <button
            type="button"
            onClick={onAddMeasurement}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#3B67FC] hover:bg-[#1A63ED] text-white text-xs font-bold rounded-lg transition-colors shadow-sm self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            Catat Pengukuran Baru
          </button>
        )}
      </div>

      {measurements.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">monitoring</span>
          <p className="text-sm font-semibold text-slate-600">Belum Ada Riwayat Pengukuran</p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            {isAdmin
              ? "Klik tombol 'Catat Pengukuran Baru' di atas untuk menginput hasil pengukuran fisik berkala pasien."
              : "Belum ada catatan pengukuran kesehatan berkala yang diinputkan."}
          </p>
        </div>
      ) : (
        <>
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {visibleMeasurements.map((item, idx) => {
              const isLatest = idx === 0;
              const dateStr = item.measuredAt
                ? new Date(item.measuredAt).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-";

              const isRoleAdmin = item.recordedByRole === "admin";

              return (
                <div key={item.id} className="relative group">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-[30px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                      isLatest ? "bg-[#3B67FC] ring-4 ring-[#3B67FC]/15" : "bg-slate-400"
                    }`}
                  />

                  <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-5 hover:border-[#3B67FC]/30 transition-all duration-200">
                    {/* Card Header: Timestamp & Audit Trail */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-200/60">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1A202C]">
                          {dateStr}
                        </span>
                        {isLatest && (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
                            Terbaru
                          </span>
                        )}
                      </div>

                      {/* Audit Trail Badge */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-[#718096]">Recorded By:</span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border uppercase ${
                            isRoleAdmin
                              ? "bg-[#3B67FC]/10 text-[#3B67FC] border-[#3B67FC]/20"
                              : "bg-[#07CADE]/10 text-[#07CADE] border-[#07CADE]/20"
                          }`}
                        >
                          {isRoleAdmin ? "Admin" : "Pasien"} ({item.recordedByName})
                        </span>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {/* Weight & BMI */}
                      <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Berat Badan
                        </span>
                        <span className="text-sm font-bold text-slate-800">
                          {item.weightKg ? `${item.weightKg} kg` : "-"}
                        </span>
                        {item.bmi && (
                          <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                            BMI: <strong>{item.bmi}</strong>
                          </span>
                        )}
                      </div>

                      {/* Height */}
                      <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Tinggi Badan
                        </span>
                        <span className="text-sm font-bold text-slate-800">
                          {item.heightCm ? `${item.heightCm} cm` : "-"}
                        </span>
                      </div>

                      {/* Blood Pressure */}
                      <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Tekanan Darah
                        </span>
                        <span className="text-sm font-bold text-slate-800">
                          {item.bloodPressureSystolic && item.bloodPressureDiastolic
                            ? `${item.bloodPressureSystolic}/${item.bloodPressureDiastolic}`
                            : "-"}
                          <span className="text-[10px] text-slate-400 font-normal ml-0.5">mmHg</span>
                        </span>
                      </div>

                      {/* Blood Sugar */}
                      <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Gula Darah
                        </span>
                        <span className="text-sm font-bold text-slate-800">
                          {item.bloodSugar ? `${item.bloodSugar}` : "-"}
                          <span className="text-[10px] text-slate-400 font-normal ml-0.5">mg/dL</span>
                        </span>
                        {item.bloodSugar && (
                          <span className="text-[10px] text-[#3B67FC] block mt-0.5 font-semibold">
                            {item.bloodSugarTimeType === "fasting" || item.bloodSugarTimeType === "puasa" ? "Puasa" :
                             item.bloodSugarTimeType === "before_meal" || item.bloodSugarTimeType === "sebelum_makan" ? "Sebelum Makan" :
                             item.bloodSugarTimeType === "after_meal" || item.bloodSugarTimeType === "sesudah_makan" ? "2 Jam Sesudah Makan" :
                             item.bloodSugarTimeType === "before_bed" || item.bloodSugarTimeType === "sebelum_tidur" ? "Sebelum Tidur" : "Sewaktu"}
                          </span>
                        )}
                      </div>

                      {/* Waist Circumference */}
                      <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Lingkar Pinggang
                        </span>
                        <span className="text-sm font-bold text-slate-800">
                          {item.waistCircumferenceCm ? `${item.waistCircumferenceCm} cm` : "-"}
                        </span>
                      </div>

                      {/* Calorie Target */}
                      <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Target Kalori
                        </span>
                        <span className="text-sm font-bold text-slate-800">
                          {item.dailyCalorieTarget && item.dailyCalorieTarget > 0
                            ? `${item.dailyCalorieTarget}`
                            : calculateDSMESCalorieTarget({
                                weightKg: item.weightKg,
                                heightCm: item.heightCm,
                              })}
                          <span className="text-[10px] text-slate-400 font-normal ml-0.5">kcal</span>
                        </span>
                      </div>
                    </div>

                    {/* Notes */}
                    {item.notes && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/50 flex items-start gap-1.5 text-xs text-slate-600 italic">
                        <span className="material-symbols-outlined text-[14px] text-slate-400 mt-0.5">notes</span>
                        <span>Catatan: &quot;{item.notes}&quot;</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {measurements.length > 3 && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center">
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#3B67FC] font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                <span>
                  {isExpanded
                    ? "Sembunyikan"
                    : `Lihat Lebih Banyak (${measurements.length - 3} Pengukuran Lainnya)`}
                </span>
                <span className="material-symbols-outlined text-sm">
                  {isExpanded ? "expand_less" : "expand_more"}
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
