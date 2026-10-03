"use client";

import type { BloodSugarLog } from "../types/record";
import { useState } from "react";

interface BloodSugarHistoryCardProps {
  readonly logs: BloodSugarLog[];
  readonly diabetesType?: string;
}

export function BloodSugarHistoryCard({ logs = [], diabetesType }: BloodSugarHistoryCardProps) {
  const [period, setPeriod] = useState<"7" | "30">("7");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const getParsedDate = (log: BloodSugarLog): Date => {
    if (log.rawDate instanceof Date && !isNaN(log.rawDate.getTime())) return log.rawDate;
    if (log.rawDate && (typeof log.rawDate === "string" || typeof log.rawDate === "number")) {
      const d = new Date(log.rawDate);
      if (!isNaN(d.getTime())) return d;
    }
    if (log.measuredAt) {
      const d = new Date(log.measuredAt);
      if (!isNaN(d.getTime())) return d;
    }
    if (log.date) {
      const d = new Date(log.date);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
  };

  const limitDays = parseInt(period, 10);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - limitDays);

  const dateFiltered = logs.filter((log) => getParsedDate(log) >= cutoffDate);
  const chartSourceLogs = dateFiltered.length > 0 ? dateFiltered : logs;
  const hasData = logs.length > 0;

  // Sort chronological ascending, take last 7 for chart
  const chartLogs = [...chartSourceLogs]
    .sort((a, b) => getParsedDate(a).getTime() - getParsedDate(b).getTime())
    .slice(-7);

  const N = chartLogs.length;

  // Dynamic Y scale with evenly-spaced tick labels
  const values = chartLogs.map((l) => l.glucoseValue);
  const rawMin = values.length > 0 ? Math.min(...values) : 70;
  const rawMax = values.length > 0 ? Math.max(...values) : 200;
  const rawRange = Math.max(rawMax - rawMin, 60);
  const tickStep = rawRange <= 60 ? 15 : rawRange <= 100 ? 20 : rawRange <= 160 ? 30 : 50;
  const minVal = Math.floor(rawMin / tickStep) * tickStep - tickStep;
  const maxVal = Math.ceil(rawMax / tickStep) * tickStep + tickStep;
  const range = maxVal - minVal;

  const SVG_W = 800;
  const SVG_H = 220;
  const CHART_L = 48;
  const CHART_R = SVG_W - 24;
  const CHART_T = 24;
  const CHART_B = SVG_H - 40;
  const CHART_W = CHART_R - CHART_L;
  const CHART_H = CHART_B - CHART_T;

  const getX = (idx: number) =>
    N > 1 ? CHART_L + (idx / (N - 1)) * CHART_W : CHART_L + CHART_W / 2;

  const getY = (val: number) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    return CHART_B - ((clamped - minVal) / range) * CHART_H;
  };

  const getPointColor = (type: string) => {
    switch (type) {
      case "fasting":
      case "puasa":
        return "#00695C"; // Teal
      case "before_meal":
      case "sebelum_makan":
        return "#0284C7"; // Light Blue
      case "after_meal":
      case "sesudah_makan":
        return "#E53E3E"; // Red
      case "before_bed":
      case "sebelum_tidur":
        return "#8B5CF6"; // Purple
      case "random":
      case "sewaktu":
      default:
        return "#3182CE"; // Blue
    }
  };

  const getGlucoseStatus = (log: BloodSugarLog) => {
    const status = (log.status || "").toLowerCase();
    const label =
      log.classificationLabel ||
      (status === "severe_hypoglycemia" || status === "hypoglycemia" || status === "hipoglikemia"
        ? "Hipoglikemia"
        : status === "low_warning" || status === "waspada rendah"
        ? "Waspada Rendah"
        : status === "severe_hyperglycemia" || status === "hyperglycemia" || status === "hiperglikemia"
        ? "Hiperglikemia"
        : status === "elevated" || status === "prediabetes" || status === "waspada"
        ? "Waspada"
        : "Normal");

    const cls =
      label === "Hiperglikemia" || label === "Hipoglikemia" || status === "severe_hypoglycemia" || status === "severe_hyperglycemia"
        ? "bg-rose-50 text-rose-700 border-rose-200"
        : label === "Waspada" || label === "Waspada Rendah" || label === "Elevated" || label === "Prediabetes"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-emerald-50 text-emerald-700 border-emerald-200";

    return { label, cls };
  };

  const points = chartLogs.map((log, idx) => ({
    x: getX(idx),
    y: getY(log.glucoseValue),
    val: log.glucoseValue,
    label: log.measurementTimeLabel,
    type: log.measurementTimeType,
    date: log.date,
    time: log.time,
    classificationLabel: log.classificationLabel || getGlucoseStatus(log).label,
    rangeText: log.referenceRangeText || "< 140 mg/dL",
  }));

  const linePath =
    N > 1
      ? `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`
      : N === 1
      ? `M ${CHART_L},${points[0].y} L ${CHART_R},${points[0].y}`
      : "";

  const areaPath =
    N > 1
      ? `M ${points[0].x},${CHART_B} L ${points.map((p) => `${p.x},${p.y}`).join(" L ")} L ${points[points.length - 1].x},${CHART_B} Z`
      : "";

  // Y-axis labels — evenly spaced ticks
  const yLabels: number[] = [];
  for (let v = minVal; v <= maxVal; v += tickStep) {
    yLabels.push(v);
  }

  const avgVal = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : null;
  const latestVal = chartLogs.length > 0 ? chartLogs[chartLogs.length - 1].glucoseValue : null;

  return (
    <div className="premium-card p-6 flex flex-col font-[family-name:var(--font-poppins)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E6F2F1] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#00695C] text-[20px]">water_drop</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1A202C]">Riwayat Gula Darah Pasien</h3>
            <p className="text-xs text-[#718096]">Monitoring & Klasifikasi Medis Glukosa Darah</p>
          </div>
        </div>

        {/* Period Selector + Stats */}
        <div className="flex items-center gap-3">
          {/* Summary Pills */}
          {avgVal !== null && (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex flex-col items-center min-w-[80px] px-4 py-2.5 bg-[#F0F9F8] rounded-xl border border-[#00695C]/20">
                <span className="text-[9px] font-bold text-[#00695C] uppercase tracking-widest mb-0.5">Rata-rata</span>
                <span className="text-base font-black text-[#00695C] leading-none">{avgVal}</span>
                <span className="text-[9px] font-semibold text-[#00695C]/60 mt-0.5">mg/dL</span>
              </div>
              {latestVal !== null && (
                <div className="flex flex-col items-center min-w-[80px] px-4 py-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[9px] font-bold text-[#718096] uppercase tracking-widest mb-0.5">Terakhir</span>
                  <span className="text-base font-black text-[#1A202C] leading-none">{latestVal}</span>
                  <span className="text-[9px] font-semibold text-[#718096] mt-0.5">mg/dL</span>
                </div>
              )}
            </div>
          )}

          {/* Period Buttons */}
          <div className="flex bg-[#F4F6F8] p-1 rounded-full border border-[#E2E8F0]/30">
            {(["7", "30"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={[
                  "px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer",
                  period === p
                    ? "bg-[#0F766E] text-white shadow-md shadow-[#0F766E]/15"
                    : "text-[#718096] hover:text-[#00695C]",
                ].join(" ")}
              >
                {p} Hari
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full mb-6 bg-[#FAFBFC] rounded-xl border border-[#E2E8F0]/60 p-4">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-[#F4F6F8] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[#A0AEC0] text-3xl">water_drop</span>
            </div>
            <p className="font-semibold text-sm text-[#4A5568]">Belum Ada Catatan Gula Darah</p>
            <p className="text-xs text-[#718096] mt-1">Data grafik riwayat gula darah pasien akan muncul di sini.</p>
          </div>
        ) : (
          <svg
            className="w-full h-auto"
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            style={{ overflow: "visible" }}
          >
            <defs>
              <linearGradient id="bsAreaGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#00695C" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#00695C" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Y-axis reference lines */}
            {yLabels.map((label, i) => {
              const lineY = getY(label);
              return (
                <g key={`y-grid-${i}`}>
                  <line
                    x1={CHART_L}
                    y1={lineY}
                    x2={CHART_R}
                    y2={lineY}
                    stroke="#E2E8F0"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={CHART_L - 8}
                    y={lineY + 4}
                    textAnchor="end"
                    fill="#A0AEC0"
                    fontSize="10"
                    fontWeight="500"
                  >
                    {label}
                  </text>
                </g>
              );
            })}

            {/* Area under line */}
            {areaPath && <path d={areaPath} fill="url(#bsAreaGradient)" />}

            {/* Connecting line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#00695C"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data points */}
            {points.map((pt, idx) => {
              const isHovered = hoveredIdx === idx;
              const color = getPointColor(pt.type);
              const tooltipX = Math.max(CHART_L, Math.min(CHART_R - 140, pt.x - 70));

              return (
                <g key={`pt-${idx}`}>
                  {/* Outer glow ring on hover */}
                  {isHovered && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={9}
                      fill={color}
                      fillOpacity={0.25}
                    />
                  )}
                  {/* Point circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 4.5}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />

                  {/* Value label above point */}
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    fill={color}
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {pt.val}
                  </text>

                  {/* Enhanced Hover tooltip */}
                  {isHovered && (
                    <g>
                      <rect
                        x={tooltipX}
                        y={pt.y - 65}
                        width={140}
                        height={50}
                        rx={10}
                        fill="#1E293B"
                        fillOpacity={0.95}
                      />
                      <text
                        x={tooltipX + 70}
                        y={pt.y - 48}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {pt.val} mg/dL ({pt.classificationLabel})
                      </text>
                      <text
                        x={tooltipX + 70}
                        y={pt.y - 34}
                        textAnchor="middle"
                        fill="#94A3B8"
                        fontSize="9"
                      >
                        {pt.label} • Acuan: {pt.rangeText}
                      </text>
                      <text
                        x={tooltipX + 70}
                        y={pt.y - 20}
                        textAnchor="middle"
                        fill="#CBD5E1"
                        fontSize="9"
                      >
                        {pt.date} • {pt.time}
                      </text>
                    </g>
                  )}

                  {/* X-axis date label */}
                  <text
                    x={pt.x}
                    y={CHART_B + 16}
                    textAnchor="middle"
                    fill={isHovered ? "#00695C" : "#A0AEC0"}
                    fontSize="10"
                    fontWeight={isHovered ? "bold" : "500"}
                  >
                    {pt.date?.split(" ").slice(0, 2).join(" ")}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Legend for 5 Measurement Types */}
      {hasData && (
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold mb-5 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]/50">
          {[
            { color: "#00695C", label: "Puasa" },
            { color: "#0284C7", label: "Sebelum Makan" },
            { color: "#E53E3E", label: "2 Jam Sesudah Makan" },
            { color: "#8B5CF6", label: "Sebelum Tidur" },
            { color: "#3182CE", label: "Sewaktu" },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-1.5 text-[#4A5568]">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </span>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-y-auto max-h-[260px] rounded-xl border border-[#E2E8F0]/50">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#F8FAFC] z-10">
            <tr className="text-[#718096] text-[10px] font-bold uppercase tracking-wider">
              <th className="py-2.5 px-3 border-b border-[#E2E8F0]">Tanggal & Jam</th>
              <th className="py-2.5 px-3 border-b border-[#E2E8F0]">Jenis Pengukuran</th>
              <th className="py-2.5 px-3 border-b border-[#E2E8F0]">Nilai</th>
              <th className="py-2.5 px-3 border-b border-[#E2E8F0]">Status Klasifikasi Medis Glukosa Darah</th>
              <th className="py-2.5 px-3 border-b border-[#E2E8F0]">Rentang Acuan</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium divide-y divide-[#E2E8F0]/40 bg-white">
            {!hasData ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-xs text-[#718096]">
                  Tidak ada catatan riwayat gula darah.
                </td>
              </tr>
            ) : (
              [...logs]
                .sort((a, b) => getParsedDate(b).getTime() - getParsedDate(a).getTime())
                .map((log, idx) => {
                  const status = getGlucoseStatus(log);
                  const ptColor = getPointColor(log.measurementTimeType);
                  return (
                    <tr
                      key={log.id || `bs-${idx}`}
                      className="hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="py-2.5 px-3 font-semibold text-[#1A202C]">
                        {log.date} <span className="text-[#718096] font-normal">({log.time})</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold"
                          style={{ color: ptColor }}
                        >
                          <span
                            className="w-2 h-2 rounded-full inline-block"
                            style={{ backgroundColor: ptColor }}
                          />
                          {log.measurementTimeLabel}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-black text-[#1A202C]">{log.glucoseValue}</span>
                        <span className="text-[#718096] text-[10px] ml-0.5">mg/dL</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${status.cls}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#4A5568] text-[11px]">
                        {log.referenceRangeText || "< 140 mg/dL"}
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
