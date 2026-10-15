"use client";

import type { MedicationLog } from "../types/record";

interface MedicationComplianceCardProps {
  readonly logs: MedicationLog[];
  readonly selectedDate?: string;
  readonly onDateChange?: (date: string) => void;
  readonly isLoading?: boolean;
}

export function MedicationComplianceCard({ logs = [], selectedDate, onDateChange, isLoading }: MedicationComplianceCardProps) {
  // Filter out 'Mendatang' items — ONLY display actual logs inputted by user
  const actualLogs = logs.filter((log) => log.status !== "Mendatang");

  // Group logs by dateGroup
  const groupedLogs = actualLogs.reduce<Record<string, MedicationLog[]>>((acc, log) => {
    if (!acc[log.dateGroup]) {
      acc[log.dateGroup] = [];
    }
    acc[log.dateGroup].push(log);
    return acc;
  }, {});

  const hasData = actualLogs.length > 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm flex flex-col h-[520px] font-[family-name:var(--font-poppins)]">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h3 className="text-base font-bold text-[#1A202C] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#3B67FC]">medication</span>
          Kepatuhan Obat
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

      <div className="flex-1 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-center p-6 h-full min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B67FC] mb-2"></div>
            <p className="text-xs text-[#718096]">Memuat catatan obat...</p>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center text-center p-6 h-full min-h-[300px]">
            <span className="material-symbols-outlined text-[#718096] text-3xl mb-2">medication</span>
            <p className="font-semibold text-sm text-[#4A5568]">Belum Ada Catatan Obat</p>
            <p className="text-xs text-[#718096] mt-1">Jadwal konsumsi obat harian pasien pada tanggal ini akan muncul di sini.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedLogs).map(([dateGroup, items]) => (
              <div key={dateGroup}>
                <p className="text-xs font-bold text-[#718096] bg-[#F4F6F8] px-3 py-1.5 rounded-lg inline-block mb-3">
                  {dateGroup}
                </p>
                
                <div className="space-y-3">
                  {items.map((item) => {
                    const isDiminum = item.status === "Diminum";
                    const isTerlewat = item.status === "Terlewat";
                    const isMendatang = item.status === "Mendatang";

                    return (
                      <div
                        key={item.id}
                        className={[
                          "border rounded-xl p-4 flex justify-between items-center transition-all hover:shadow-sm",
                          isTerlewat
                            ? "border-[#FEB2B2] bg-[#FFF5F5]/30"
                            : "border-[#E2E8F0] bg-white",
                          isMendatang ? "opacity-60" : ""
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-4">
                          <div className={[
                            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                            isDiminum
                              ? "bg-[#EEF2FF] text-[#3B67FC]"
                              : isTerlewat
                              ? "bg-[#FFF5F5] text-[#C53030]"
                              : "bg-[#F4F6F8] text-[#718096]"
                          ].join(" ")}>
                            <span className="material-symbols-outlined text-[20px]">pill</span>
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${isTerlewat ? "text-[#C53030]" : "text-[#1A202C]"}`}>
                              {item.name}
                            </p>
                            <p className="text-xs text-[#718096] mt-0.5">
                              {item.dosage} • {item.time}
                            </p>
                          </div>
                        </div>

                        <span>
                          {isDiminum && (
                            <span className="bg-[#F0FDF4] text-[#166534] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">check_circle</span>
                              Diminum
                            </span>
                          )}
                          {isTerlewat && (
                            <span className="bg-[#FFF5F5] text-[#C53030] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">cancel</span>
                              Terlewat
                            </span>
                          )}
                          {isMendatang && (
                            <span className="bg-[#F4F6F8] text-[#718096] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                              Mendatang
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
