import Link from "next/link";
import { EmptyState } from "@/components/common/EmptyState";
import type { FoodIntakeItem, AdherenceItem, PatientContribution, TimeRange } from "../hooks/useStaffDashboard";

interface PhysicalActivityItem {
  readonly level: string;
  readonly count: number;
}

interface RangeSelectorProps {
  readonly value: TimeRange;
  readonly onChange: (range: TimeRange) => void;
}

const RANGE_OPTIONS: readonly { label: string; value: TimeRange }[] = [
  { label: "7 Hari", value: 7 },
  { label: "30 Hari", value: 30 },
  { label: "90 Hari", value: 90 },
];

function RangeSelector({ value, onChange }: RangeSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-[#F1F5F9] rounded-lg p-0.5 w-full sm:w-auto shrink-0 justify-between sm:justify-start">
      {RANGE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 sm:flex-initial text-center px-2.5 py-1.5 sm:py-1 text-[11px] sm:text-[10px] font-bold rounded-md transition-all cursor-pointer ${
            value === opt.value
              ? "bg-white text-[#00695C] shadow-sm"
              : "text-[#718096] hover:text-[#4A5568]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

interface MonitoringChartsProps {
  readonly physicalActivity: readonly PhysicalActivityItem[];
  readonly foodIntake: readonly FoodIntakeItem[];
  readonly medicationAdherence: readonly AdherenceItem[];
  readonly foodPatients: readonly PatientContribution[];
  readonly activityPatients: readonly PatientContribution[];
  readonly medicationPatients: readonly PatientContribution[];
  readonly foodRange: TimeRange;
  readonly activityRange: TimeRange;
  readonly adherenceRange: TimeRange;
  readonly onFoodRangeChange: (range: TimeRange) => void;
  readonly onActivityRangeChange: (range: TimeRange) => void;
  readonly onAdherenceRangeChange: (range: TimeRange) => void;
}

function initialOf(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed.charAt(0).toUpperCase() : "?";
}

// PatientList shows which patients contributed data (up to 5) and links to the
// full record-monitoring page when there are more than 5.
function PatientList({ patients }: { readonly patients: readonly PatientContribution[] }) {
  if (patients.length === 0) return null;

  const visible = patients.slice(0, 5);

  return (
    <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#718096] mb-2">
        Pasien dengan data
      </p>
      <div className="space-y-2">
        {visible.map((p) => (
          <div key={p.patientId} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {p.avatarUrl ? (
                <img
                  src={p.avatarUrl}
                  alt={p.name}
                  className="w-5 h-5 rounded-full object-cover shrink-0"
                />
              ) : (
                <span className="w-5 h-5 rounded-full bg-[#00695C] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                  {initialOf(p.name)}
                </span>
              )}
              <span className="text-xs text-[#4A5568] font-semibold truncate">{p.name}</span>
            </div>
            <span className="text-[10px] font-extrabold text-[#1A202C] shrink-0">{p.count} log</span>
          </div>
        ))}
      </div>
      {patients.length > 5 && (
        <Link
          href="/staff/pemantauan-catatan-pasien"
          className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#00695C] hover:text-[#004d40] transition-colors"
        >
          Lihat Semua ({patients.length}) <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}

export function MonitoringCharts({
  physicalActivity,
  foodIntake,
  medicationAdherence,
  foodPatients,
  activityPatients,
  medicationPatients,
  foodRange,
  activityRange,
  adherenceRange,
  onFoodRangeChange,
  onActivityRangeChange,
  onAdherenceRangeChange,
}: MonitoringChartsProps) {
  const totalFood = foodIntake.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* 1. Global Food Intake (Doughnut Chart of Meal Log Distribution) */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col font-[family-name:var(--font-poppins)] min-h-[320px]">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div>
            <h3 className="text-base font-bold text-[#1A202C]">Distribusi Asupan Makanan</h3>
            <p className="text-xs text-[#718096] mt-0.5">Distribusi pencatatan makanan harian (Sarapan, Siang, Malam, Cemilan)</p>
          </div>
          <RangeSelector value={foodRange} onChange={onFoodRangeChange} />
        </div>

        {foodIntake.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon="restaurant"
              title="Belum ada data"
              message="Belum terdapat data pada rentang waktu ini. Data akan muncul setelah pasien mulai melakukan pencatatan makanan."
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {/* SVG Doughnut */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="70" fill="transparent" stroke="#F8FAFC" strokeWidth="20" />
                {foodIntake.length > 0 && (
                  <>
                    {(() => {
                      const circumference = 2 * Math.PI * 70;
                      let offset = 0;
                      return foodIntake.map((item) => {
                        const length = circumference * (item.percentage / 100);
                        const seg = (
                          <circle
                            key={item.category}
                            cx="100"
                            cy="100"
                            r="70"
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth="20"
                            strokeDasharray={`${length} ${circumference}`}
                            strokeDashoffset={-offset}
                            strokeLinecap="round"
                          />
                        );
                        offset += length;
                        return seg;
                      });
                    })()}
                  </>
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-extrabold text-[#1A202C]">{totalFood.toLocaleString("id-ID")}</span>
                <span className="text-[9px] text-[#718096] uppercase tracking-wider font-bold">Total Log</span>
              </div>
            </div>

            {/* Details list */}
            <div className="w-full space-y-2">
              {foodIntake.map((item) => (
                <div key={item.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[#4A5568] font-semibold">{item.category}</span>
                  </div>
                  <span className="font-bold text-[#1A202C]">
                    {item.percentage}% <span className="text-[#718096] font-medium text-[10px]">({item.count})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <PatientList patients={foodPatients} />
      </div>

      {/* 2. Physical Activity Distribution (Vertical Bar Chart) */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col font-[family-name:var(--font-poppins)] min-h-[320px]">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div>
            <h3 className="text-base font-bold text-[#1A202C]">Distribusi Aktivitas Fisik</h3>
            <p className="text-xs text-[#718096] mt-0.5">Persentase tingkat intensitas aktivitas fisik populasi pasien</p>
          </div>
          <RangeSelector value={activityRange} onChange={onActivityRangeChange} />
        </div>

        {physicalActivity.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon="directions_run"
              title="Belum ada data"
              message="Belum terdapat data pada rentang waktu ini. Data akan muncul setelah pasien mencatat aktivitas fisik."
            />
          </div>
        ) : (
          <div className="flex-1 flex gap-2 sm:gap-4 items-end justify-around h-36 border-b border-[#E2E8F0] pb-2">
            {(() => {
              const total = physicalActivity.reduce((s, a) => s + a.count, 0) || 1;
              const maxCount = Math.max(...physicalActivity.map((a) => a.count), 1);
              return physicalActivity.map((point) => {
                const pct = Math.round((point.count / total) * 100);
                const heightPct = (point.count / maxCount) * 100;
                return (
                  <div key={point.level} className="flex flex-col items-center flex-1 max-w-[72px] min-w-0 group relative">
                    <div className="absolute -top-10 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-md z-10">
                      {pct}% Pasien
                    </div>

                    <div className="w-full bg-[#F1F5F9] rounded-t-lg h-28 flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-[#00695C] to-[#10B981] rounded-t-lg hover:opacity-90 transition-all cursor-default"
                        style={{ height: `${Math.max(heightPct, 5)}%` }}
                      />
                    </div>

                    <span className="text-[10px] sm:text-xs font-bold text-[#4A5568] mt-2 text-center truncate w-full" title={point.level}>
                      {point.level}
                    </span>
                    <span className="text-[10px] font-extrabold text-[#00695C] mt-0.5">{pct}%</span>
                  </div>
                );
              });
            })()}
          </div>
        )}
        <PatientList patients={activityPatients} />
      </div>

      {/* 3. Medication Adherence (Horizontal Progress bars) */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col font-[family-name:var(--font-poppins)] min-h-[320px] lg:col-span-2 xl:col-span-1">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div>
            <h3 className="text-base font-bold text-[#1A202C]">Kepatuhan Minum Obat</h3>
            <p className="text-xs text-[#718096] mt-0.5">Tingkat kepatuhan konsumsi obat/insulin pasien terdaftar</p>
          </div>
          <RangeSelector value={adherenceRange} onChange={onAdherenceRangeChange} />
        </div>

        {medicationAdherence.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon="medication"
              title="Belum ada data"
              message="Belum terdapat data pada rentang waktu ini. Data akan muncul setelah pasien mulai mencatat konsumsi obat."
            />
          </div>
        ) : (
          <div className="flex-1 justify-center grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-1 gap-4">
            {medicationAdherence.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#4A5568]">{item.label}</span>
                  <span className="font-extrabold text-[#1A202C]">
                    {item.percentage}% <span className="text-[#718096] font-medium text-[10px]">({item.count})</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        <PatientList patients={medicationPatients} />
      </div>
    </div>
  );
}
