"use client";

import type { ActivityLog } from "../types/record";

interface ActivityHistoryCardProps {
  readonly logs: ActivityLog[];
  readonly selectedDate?: string;
  readonly onDateChange?: (date: string) => void;
  readonly isLoading?: boolean;
}

export function ActivityHistoryCard({ logs = [], selectedDate, onDateChange, isLoading }: ActivityHistoryCardProps) {
  const hasData = logs.length > 0;
  const chartScale = Math.max(
    30,
    Math.ceil(Math.max(...logs.map((log) => log.duration), 0) / 30) * 30,
  );

  // Group activities by date
  const dailyMap: { [dateStr: string]: { duration: number; date: Date } } = {};
  logs.forEach((log) => {
    let d = log.rawDate ? new Date(log.rawDate) : null;
    if (!d || isNaN(d.getTime())) {
      const cleanTime = log.time.replace(" WIB", "").replace("WIB", "");
      d = new Date(cleanTime);
    }
    if (isNaN(d.getTime())) {
      d = new Date();
    }
    const dateStr = d.toDateString();
    if (!dailyMap[dateStr]) {
      dailyMap[dateStr] = { duration: 0, date: d };
    }
    dailyMap[dateStr].duration += log.duration;
  });

  // Base date for 5-day chart
  const baseDate = selectedDate ? new Date(selectedDate) : new Date();

  // Generate 5 days of chart bars ending on selected date
  const daysIndo = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const chartBars = Array.from({ length: 5 }).map((_, idx) => {
    const targetDate = new Date(baseDate);
    targetDate.setDate(targetDate.getDate() - (4 - idx));
    const dayLabel = daysIndo[targetDate.getDay()];
    const dateStr = targetDate.toDateString();

    const duration = dailyMap[dateStr]?.duration ?? 0;
    const height = duration > 0
      ? `${Math.min(100, Math.max(10, Math.round((duration / chartScale) * 100)))}%`
      : "8px";

    return {
      label: dayLabel,
      value: duration,
      height,
      active: idx === 4,
    };
  });

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm flex flex-col h-[520px] font-[family-name:var(--font-poppins)]">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h3 className="text-base font-bold text-[#1A202C] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#166534]">directions_run</span>
          Riwayat Aktivitas Fisik
        </h3>

        {onDateChange && (
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-[#718096]">calendar_today</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="text-xs font-medium border border-[#E2E8F0] rounded-lg px-2.5 py-1 bg-[#F8FAFC] text-[#4A5568] focus:outline-none focus:ring-1 focus:ring-[#3B67FC] cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Styled Bar Chart */}
      <div className="flex-1 w-full bg-[#F8FAFC] rounded-xl mb-4 p-4 border border-[#E2E8F0] flex flex-col justify-end">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B67FC] mb-2"></div>
            <p className="text-xs text-[#718096]">Memuat catatan aktivitas...</p>
          </div>
        ) : !hasData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <span className="material-symbols-outlined text-[#718096] text-3xl mb-2">directions_run</span>
            <p className="font-semibold text-sm text-[#4A5568]">Belum Ada Catatan Aktivitas</p>
            <p className="text-xs text-[#718096] mt-1">Data grafik durasi aktivitas fisik pasien pada tanggal ini akan muncul di sini.</p>
          </div>
        ) : (
          <div className="h-44 w-full flex items-end justify-around pb-2 relative border-b border-[#E2E8F0]">
            {/* Grid lines for Y-axis guide */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
              <div className="border-b border-dashed border-[#718096] w-full flex justify-between">
                 <span className="text-[9px] text-[#718096]">{chartScale}m</span>
              </div>
              <div className="border-b border-dashed border-[#718096] w-full flex justify-between">
                 <span className="text-[9px] text-[#718096]">{Math.round(chartScale / 2)}m</span>
              </div>
              <div className="border-b border-dashed border-[#718096] w-full"></div>
            </div>

            {chartBars.map((bar, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 z-10 h-full justify-end">
                <span className="text-[11px] font-bold text-[#3B67FC]">{bar.value}m</span>
                <div className="w-8 h-28 flex items-end justify-center bg-[#E2E8F0]/40 rounded-t-lg p-0.5">
                  <div 
                     style={{ height: `${bar.value > 0 ? Math.max(12, Math.min(100, Math.round((bar.value / chartScale) * 100))) : 4}%` }}
                    className={[
                      "w-full rounded-t-md transition-all duration-500 hover:opacity-90",
                      bar.value > 0
                        ? "bg-[#3B67FC] shadow-md shadow-[#3B67FC]/20"
                        : "bg-[#CBD5E0]"
                    ].join(" ")}
                  />
                </div>
                <span className="text-[11px] font-semibold text-[#4A5568]">{bar.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Log List */}
      <div className="overflow-y-auto pr-1 h-[170px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-center p-6 h-full min-h-[120px]">
            <p className="text-xs text-[#718096]">Memuat data...</p>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center text-center p-6 h-full min-h-[120px]">
            <p className="text-xs text-[#718096]">Tidak ada riwayat aktivitas fisik pada tanggal ini.</p>
          </div>
        ) : (
          <ul className="divide-y divide-[#E2E8F0]/40">
            {logs.map((log, idx) => (
              <li key={log.id || `activity-${idx}`} className="flex justify-between items-center py-3 px-1.5 hover:bg-[#F8FAFC] rounded-xl transition-colors">
                <div>
                  <p className="text-sm font-semibold text-[#1A202C]">{log.name}</p>
                  <div className="flex gap-2 items-center mt-1">
                    <span className="text-xs text-[#718096]">{log.time}</span>
                    <span className={[
                      "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                      log.intensity === "Ringan"
                        ? "bg-[#F0FDF4] text-[#166534]"
                        : log.intensity === "Sedang"
                        ? "bg-[#FFFBEB] text-[#B45309]"
                        : "bg-[#FFF5F5] text-[#C53030]"
                    ].join(" ")}>
                      {log.intensity}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#1A202C]">{log.duration} Menit</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
