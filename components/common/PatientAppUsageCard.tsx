"use client";

interface DailyUsageItem {
  readonly date: string;
  readonly totalSeconds: number;
  readonly totalFormatted: string;
  readonly sessionCount: number;
}

interface PatientAppUsageCardProps {
  readonly totalFormatted: string;
  readonly dailyUsages: DailyUsageItem[];
  readonly isLoading?: boolean;
  readonly error?: string | null;
}

export function PatientAppUsageCard({
  totalFormatted,
  dailyUsages,
  isLoading = false,
  error = null,
}: PatientAppUsageCardProps) {
  return (
    <div className="premium-card p-6 flex flex-col font-[family-name:var(--font-poppins)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] text-[#3B67FC] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">timer</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1A202C]">
              Durasi Penggunaan Aplikasi
            </h3>
            <p className="text-xs text-[#718096]">
              Waktu aktif pasien menggunakan aplikasi mobile DIBA per hari
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#718096] block">
            Total Durasi
          </span>
          <span className="text-sm font-extrabold text-[#3B67FC]">
            {totalFormatted}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 flex items-center justify-center text-xs text-[#718096]">
          Memuat data durasi penggunaan...
        </div>
      ) : error ? (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-3xl text-[#F59E0B] mb-2">
            warning
          </span>
          <p className="text-xs text-[#718096]">{error}</p>
        </div>
      ) : dailyUsages.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-3xl text-[#CBD5E1] mb-2">
            schedule
          </span>
          <p className="text-xs text-[#718096]">
            Belum ada riwayat durasi penggunaan yang tercatat.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#718096] uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Tanggal</th>
                <th className="py-2.5 px-3">Jumlah Sesi</th>
                <th className="py-2.5 px-3 text-right">Durasi Harian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {dailyUsages.map((item) => {
                const formattedDate = new Date(item.date).toLocaleDateString("id-ID", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                return (
                  <tr key={item.date} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-[#1A202C]">
                      {formattedDate}
                    </td>
                    <td className="py-2.5 px-3 text-[#4A5568]">
                      {item.sessionCount} sesi
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#3B67FC]">
                      {item.totalFormatted}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
