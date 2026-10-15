"use client";

import { useState } from "react";

interface SugarPoint {
  readonly day: string;
  readonly dateStr: string;
  readonly label: string;
  readonly x: number;
  readonly y: number;
  readonly val: string;
  readonly rawValue: number;
  readonly hasData: boolean;
}

interface PatientBloodSugarChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly bloodSugarLogs?: any[];
}

export function PatientBloodSugarChart({ data = [], bloodSugarLogs = [] }: PatientBloodSugarChartProps) {
  const [selectedRange, setSelectedRange] = useState<"7" | "30" | "90">("7");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const daysIndo = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const xCoords = [71, 214, 357, 500, 643, 785, 928];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getLogDate = (log: any): Date => {
    const raw = log.measured_at || log.measuredAt || log.date || log.rawDate;
    if (raw instanceof Date) return raw;
    if (raw) {
      const d = new Date(raw as string | Date);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
  };

  const limitDays = parseInt(selectedRange, 10);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - limitDays);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredLogs = data.filter((log: any) => {
    return getLogDate(log) >= cutoffDate;
  });

  const chartSourceData = filteredLogs.length > 0 ? filteredLogs : data;
  const hasData = chartSourceData.length > 0;

  const glucoseValues = filteredLogs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((log: any) => log.glucose_value || log.glucoseValue || log.blood_sugar)
    .filter((val: unknown) => typeof val === "number" && val > 0) as number[];

  const totalCount = glucoseValues.length;
  const avgBloodSugar = totalCount > 0 ? Math.round(glucoseValues.reduce((a: number, b: number) => a + b, 0) / totalCount) : null;
  const maxBloodSugar = totalCount > 0 ? Math.max(...glucoseValues) : null;
  const minBloodSugar = totalCount > 0 ? Math.min(...glucoseValues) : null;

  // Dynamic interval step based on selected range (7, 30, or 90 days)
  const pointCount = 7;
  const stepDays = limitDays === 30 ? 4 : limitDays === 90 ? 13 : 1;

  const sugarData: SugarPoint[] = Array.from({ length: pointCount }).map((_, idx) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - (pointCount - 1 - idx) * stepDays);

    let dayName = "";
    if (limitDays === 7) {
      dayName = daysIndo[targetDate.getDay()];
    } else {
      dayName = `${targetDate.getDate()}/${targetDate.getMonth() + 1}`;
    }

    const label = `${targetDate.getDate()} ${targetDate.toLocaleDateString("id-ID", { month: "short" })}`;
    const targetDateStr = targetDate.toDateString();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dayLogs = chartSourceData.filter((log: any) => {
      const logD = getLogDate(log);
      if (limitDays === 7) {
        return logD.toDateString() === targetDateStr;
      }
      const diffMs = Math.abs(logD.getTime() - targetDate.getTime());
      const windowMs = stepDays * 24 * 60 * 60 * 1000;
      return diffMs <= windowMs / 2;
    });

    const hasDayData = dayLogs.length > 0;
    let value = 0;
    if (hasDayData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sum = dayLogs.reduce((acc: number, log: any) => {
        const val = log.glucose_value || log.glucoseValue || log.blood_sugar || 0;
        return acc + (val as number);
      }, 0);
      value = Math.round(sum / dayLogs.length);
    }

    const clamped = value > 0 ? Math.max(70, Math.min(220, value)) : 120;
    const y = 250 - ((clamped - 70) / 150) * 180;

    return {
      day: dayName,
      dateStr: targetDateStr,
      label,
      x: xCoords[idx],
      y,
      val: value > 0 ? `${value} mg/dL` : "-",
      rawValue: value,
      hasData: hasDayData,
    };
  });

  const validPoints = sugarData.filter((p) => p.hasData);

  const linePath = validPoints.length > 1
    ? `M ${validPoints.map((p) => `${p.x},${p.y}`).join(" L ")}`
    : validPoints.length === 1
    ? `M 0,${validPoints[0].y} L 1000,${validPoints[0].y}`
    : "";

  const areaPath = validPoints.length > 1
    ? `M ${validPoints[0].x},250 L ${validPoints.map((p) => `${p.x},${p.y}`).join(" L ")} L ${validPoints[validPoints.length - 1].x},250 Z`
    : "";

  return (
    <div className="premium-card p-8 font-[family-name:var(--font-poppins)]">
      {/* Chart Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h4 className="font-semibold text-lg text-[#1A202C]">
            Tren Gula Darah
          </h4>
          <p className="text-xs text-[#718096]">
            Monitoring kadar glukosa dalam rentang waktu terpilih ({selectedRange} Hari)
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex bg-[#F4F6F8] p-1 rounded-full border border-[#E2E8F0]/30 self-start md:self-auto">
          {(["7", "30", "90"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={[
                "px-6 py-2 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer",
                selectedRange === range
                  ? "bg-[#0F766E] text-white shadow-md shadow-[#0F766E]/15"
                  : "text-[#718096] hover:text-[#3B67FC]",
              ].join(" ")}
            >
              {range} Hari
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="w-full relative mb-10">
        <svg
          className="w-full h-auto aspect-[1000/300] px-4"
          viewBox="0 0 1000 300"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#3B67FC" stopOpacity={0.15}></stop>
              <stop offset="100%" stopColor="#3B67FC" stopOpacity={0}></stop>
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          <line stroke="#E5E7EB" strokeDasharray="4,4" x1="0" x2="1000" y1="75" y2="75"></line>
          <line stroke="#E5E7EB" strokeDasharray="4,4" x1="0" x2="1000" y1="150" y2="150"></line>
          <line stroke="#E5E7EB" strokeDasharray="4,4" x1="0" x2="1000" y1="225" y2="225"></line>

          {!hasData ? (
            <g>
              <rect x="250" y="90" width="500" height="120" rx="16" fill="#F8F9FA" stroke="#E2E8F0" strokeWidth="1" />
              <text
                x="500"
                y="140"
                fill="#4A5568"
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
              >
                Belum Ada Catatan Gula Darah ({selectedRange} Hari)
              </text>
              <text
                x="500"
                y="165"
                fill="#718096"
                fontSize="11"
                textAnchor="middle"
              >
                Catatan riwayat gula darah pasien akan muncul di sini setelah diinput.
              </text>
            </g>
          ) : (
            <>
              {/* Gradient Area */}
              {areaPath && <path d={areaPath} fill="url(#areaGradient)" />}

              {/* Main Smooth Path Line */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#3B67FC"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  strokeDasharray={validPoints.length === 1 ? "4 4" : undefined}
                />
              )}

              {/* Render circles only for days that have data */}
              {sugarData.map((pt, idx) => {
                if (!pt.hasData) return null;
                return (
                  <g key={`sugar-pt-${idx}`}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      fill="#ffffff"
                      r={hoveredIndex === idx ? 6 : 5}
                      stroke={hoveredIndex === idx ? "#0F766E" : "#3B67FC"}
                      strokeWidth={hoveredIndex === idx ? 3 : 2.5}
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 12}
                      textAnchor="middle"
                      fill="#3B67FC"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {pt.rawValue} mg/dL
                    </text>
                  </g>
                );
              })}

              {/* Hover State: Render dashed line and interactive popover tooltip */}
              {hoveredIndex !== null && (() => {
                const active = sugarData[hoveredIndex];
                if (!active || !active.hasData) return null;
                const ry = active.y - 45;
                return (
                  <g>
                    <line
                      x1={active.x}
                      y1="75"
                      x2={active.x}
                      y2="225"
                      stroke="#0F766E"
                      strokeWidth="1.5"
                      strokeDasharray="3,3"
                    />

                    <circle cx={active.x} cy={active.y} r="8" fill="#0F766E" fillOpacity="0.2" />

                    <g transform={`translate(${active.x - 70}, ${ry})`}>
                      <rect
                        width="140"
                        height="36"
                        rx="18"
                        fill="#0F766E"
                        className="shadow-xl"
                      />
                      <text
                        x="70"
                        y="18"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {active.label}: {active.val}
                      </text>
                    </g>
                  </g>
                );
              })()}
            </>
          )}

          {/* X Axis Labels */}
          {sugarData.map((pt, idx) => (
            <g
              key={pt.day + idx}
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <rect
                x={pt.x - 40}
                y="255"
                width="80"
                height="30"
                fill="transparent"
              />
              <text
                x={pt.x}
                y="275"
                fill={hoveredIndex === idx ? "#0F766E" : "#A0AEC0"}
                fontSize="12"
                fontWeight={hoveredIndex === idx ? "bold" : "500"}
                textAnchor="middle"
              >
                {pt.day}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Summary Footer Cards */}
      <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#E2E8F0]/30 mb-6">
        {/* Rata-Rata */}
        <div className="flex flex-col gap-1 bg-[#EEF2FF] p-3.5 rounded-xl border border-[#3B67FC]/15">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-[#3B67FC]/10 text-[#3B67FC] flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">analytics</span>
            </div>
            <span className="text-[10px] font-bold text-[#3B67FC] uppercase tracking-wider">
              Rata-Rata
            </span>
          </div>
          <span className="text-lg font-black text-[#3B67FC]">
            {avgBloodSugar !== null ? `${avgBloodSugar}` : "-"}
          </span>
          <span className="text-[10px] text-[#3B67FC]/70 font-semibold">mg/dL • {selectedRange} Hari</span>
        </div>

        {/* Tertinggi */}
        <div className="flex flex-col gap-1 bg-[#FFF5F5] p-3.5 rounded-xl border border-[#C53030]/15">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-[#C53030]/10 text-[#C53030] flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
            </div>
            <span className="text-[10px] font-bold text-[#C53030] uppercase tracking-wider">
              Tertinggi
            </span>
          </div>
          <span className="text-lg font-black text-[#C53030]">
            {maxBloodSugar !== null ? `${maxBloodSugar}` : "-"}
          </span>
          <span className="text-[10px] text-[#C53030]/70 font-semibold">mg/dL • {selectedRange} Hari</span>
        </div>

        {/* Terendah */}
        <div className="flex flex-col gap-1 bg-[#EBF8FF] p-3.5 rounded-xl border border-[#2B6CB0]/15">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-[#2B6CB0]/10 text-[#2B6CB0] flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">trending_down</span>
            </div>
            <span className="text-[10px] font-bold text-[#2B6CB0] uppercase tracking-wider">
              Terendah
            </span>
          </div>
          <span className="text-lg font-black text-[#2B6CB0]">
            {minBloodSugar !== null ? `${minBloodSugar}` : "-"}
          </span>
          <span className="text-[10px] text-[#2B6CB0]/70 font-semibold">mg/dL • {selectedRange} Hari</span>
        </div>
      </div>

      {/* Blood Sugar History Table */}
      {bloodSugarLogs.length > 0 && (
        <div className="border-t border-[#E2E8F0]/30 pt-5">
          <h5 className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-3">Riwayat Pencatatan Gula Darah</h5>
          <div className="overflow-y-auto max-h-[200px] rounded-xl border border-[#E2E8F0]/50">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#F8FAFC] z-10">
                <tr className="text-[#718096] text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3 border-b border-[#E2E8F0]">Tanggal</th>
                  <th className="py-2.5 px-3 border-b border-[#E2E8F0]">Jam</th>
                  <th className="py-2.5 px-3 border-b border-[#E2E8F0]">Nilai</th>
                  <th className="py-2.5 px-3 border-b border-[#E2E8F0]">Waktu</th>
                  <th className="py-2.5 px-3 border-b border-[#E2E8F0]">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs font-medium divide-y divide-[#E2E8F0]/40 bg-white">
                {[...bloodSugarLogs]
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .sort((a: any, b: any) => {
                    const da = new Date(a.measured_at || a.measuredAt || a.date || 0).getTime();
                    const db2 = new Date(b.measured_at || b.measuredAt || b.date || 0).getTime();
                    return db2 - da;
                  })
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      .map((log: any, idx: number) => {
                    const val = log.glucose_value || log.glucoseValue || log.blood_sugar || 0;
                    const measuredAt = log.measured_at || log.measuredAt || log.date || null;
                    const d = measuredAt ? new Date(measuredAt) : null;
                    const dateStr = d ? d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : (log.date || "-");
                    const timeStr = d ? d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB" : (log.time || "-");
                    const timeType = log.measurement_time_type || log.measurementTimeType || "sewaktu";
                    const timeLabel = log.measurementTimeLabel || (timeType === "sebelum_makan" ? "Sebelum Makan" : timeType === "sesudah_makan" ? "Sesudah Makan" : "Sewaktu");
                    const ptColor = timeType === "sesudah_makan" ? "#E53E3E" : timeType === "sewaktu" ? "#3182CE" : "#3B67FC";
                    // All classification comes from the backend ClassifyBloodGlucose().
                    const statusLabel = log.classificationLabel || log.status || "Normal";
                    const isDanger = log.status === "hyperglycemia" || log.status === "hypoglycemia";
                    const isWarning = log.status === "prediabetes" || log.status === "elevated";
                    const statusCls = isDanger
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : isWarning
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200";
                    return (
                      <tr key={log.id || `bsc-${idx}`} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-[#1A202C]">{dateStr}</td>
                        <td className="py-2.5 px-3 text-[#718096]">{timeStr}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-black text-[#1A202C]">{val}</span>
                          <span className="text-[#718096] text-[10px] ml-0.5">mg/dL</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold" style={{ color: ptColor }}>
                            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: ptColor }} />
                            {timeLabel}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusCls}`}>{statusLabel}</span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
