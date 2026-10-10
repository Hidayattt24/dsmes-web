"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { surveyService } from "@/services/surveyService";
import type { SurveyAnalytics, SurveyResponseItem } from "@/types/survey";
import { BackButton } from "@/components/common/BackButton";
import { useToast } from "@/components/ui/Toast";
import { DetailPageLoader } from "@/components/ui/loading/DetailPageLoader";

interface SurveyAnalyticsFeatureProps {
  surveyId: string;
  isStaff?: boolean;
}

export function SurveyAnalyticsFeature({ surveyId, isStaff = false }: SurveyAnalyticsFeatureProps) {
  const { showToast } = useToast();
  const [analytics, setAnalytics] = useState<SurveyAnalytics | null>(null);
  const [responses, setResponses] = useState<SurveyResponseItem[]>([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponseItem | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [analyticData, responseData] = await Promise.all([
        surveyService.getAnalytics(surveyId, isStaff),
        surveyService.getResponses(surveyId, { page, limit: 10, isStaff }),
      ]);
      setAnalytics(analyticData);
      setResponses(responseData.items);
      setTotalResponses(responseData.total);
    } catch {
      showToast({
        type: "error",
        title: "Gagal Memuat Analitik",
        description: "Gagal mengambil data laporan analitik survei.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surveyId, page]);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      await surveyService.exportCSV(surveyId, isStaff);
      showToast({
        type: "success",
        title: "Ekspor Berhasil",
        description: "File CSV respons peserta berhasil diunduh.",
      });
    } catch {
      showToast({
        type: "error",
        title: "Ekspor Gagal",
        description: "Gagal mengunduh file CSV.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const basePath = isStaff ? "/staff/survey" : "/admin/survey";
  const searchParams = useSearchParams();
  const fromDetail = searchParams.get("from") === "detail";
  const backHref = fromDetail ? `${basePath}/${surveyId}` : basePath;
  const backLabel = fromDetail ? "Kembali ke Detail Survei" : "Kembali ke Survei";

  if (isLoading) {
    return (
      <div className="max-w-[1600px] w-full mx-auto py-6 font-[family-name:var(--font-poppins)]">
        <DetailPageLoader type="record" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-12 text-center text-red-600 bg-white rounded-2xl border border-red-200 font-[family-name:var(--font-poppins)] max-w-[1600px] w-full mx-auto">
        Laporan analitik survei tidak ditemukan.
      </div>
    );
  }

  const isSUS = analytics.type === "SUS";

  return (
    <div className="space-y-8 max-w-[1600px] w-full mx-auto pb-16 font-[family-name:var(--font-poppins)]">
      {/* Navigation header with BackButton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <BackButton href={backHref} label={backLabel} />
          <h1 className="text-2xl font-bold text-[#1A202C] mt-2">Analitik & Laporan Respons Survei</h1>
          <p className="text-xs font-medium text-[#718096] mt-0.5">
            Analisis lengkap hasil penilaian kepuasan dan usability pengguna
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`${basePath}/${surveyId}`}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-[#1A202C] border border-[#E2E8F0] text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-base">visibility</span>
            <span>Lihat Pertanyaan</span>
          </Link>
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={isExporting || totalResponses === 0}
            className="px-5 py-2.5 bg-[#00695C] hover:bg-[#004D40] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>{isExporting ? "Mengunduh CSV..." : "Ekspor CSV"}</span>
          </button>
        </div>
      </div>

      {/* Main Metadata Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                isSUS
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              {isSUS ? "System Usability Scale (SUS)" : "Kepuasan Pengguna"}
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#1A202C]">{analytics.survey_title}</h2>
          <p className="text-xs text-[#718096] mt-1">Laporan Analitik & Hasil Evaluasi Responden Pasien</p>
        </div>
      </div>

      {/* Headline Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <span className="text-xs font-bold text-[#718096] uppercase tracking-wider block">Total Responden</span>
          <p className="text-3xl font-bold text-[#1A202C] mt-2">{analytics.total_participants}</p>
          <p className="text-[11px] font-medium text-[#718096] mt-1">
            Tingkat Penyelesaian: {analytics.completion_rate.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <span className="text-xs font-bold text-[#718096] uppercase tracking-wider block">Rata-rata Durasi</span>
          <p className="text-3xl font-bold text-[#00695C] mt-2">
            {Math.floor(analytics.average_duration_secs / 60)}m {analytics.average_duration_secs % 60}d
          </p>
          <p className="text-[11px] font-medium text-[#718096] mt-1">Waktu pengerjaan survei</p>
        </div>

        {!isSUS ? (
          <>
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
              <span className="text-xs font-bold text-[#718096] uppercase tracking-wider block">Skor Rata-Rata</span>
              <p className="text-3xl font-bold text-[#2B6CB0] mt-2">
                {analytics.average_score?.toFixed(2) || "0.00"} <span className="text-base text-[#718096]">/ 5</span>
              </p>
              <p className="text-[11px] font-medium text-[#718096] mt-1">Skala Likert (1 - 5)</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
              <span className="text-xs font-bold text-[#718096] uppercase tracking-wider block">Persentase Kepuasan</span>
              <p className="text-3xl font-bold text-emerald-600 mt-2">
                {analytics.average_percentage?.toFixed(1) || "0.0"}%
              </p>
              <p className="text-[11px] font-medium text-[#718096] mt-1">Persentase dari skor maksimum</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
              <span className="text-xs font-bold text-[#718096] uppercase tracking-wider block">Skor SUS Rata-Rata</span>
              <p className="text-3xl font-bold text-[#2B6CB0] mt-2">
                {analytics.average_sus_score?.toFixed(1) || "0.0"} <span className="text-base text-[#718096]">/ 100</span>
              </p>
              <p className="text-[11px] font-medium text-[#718096] mt-1">
                Tertinggi: {analytics.highest_sus_score?.toFixed(1) || 0} | Terendah: {analytics.lowest_sus_score?.toFixed(1) || 0}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
              <span className="text-xs font-bold text-[#718096] uppercase tracking-wider block">Tingkat Penerimaan (Skor ≥ 68)</span>
              <p className="text-3xl font-bold text-emerald-600 mt-2">
                {analytics.pass_rate?.toFixed(1) || "0.0"}%
              </p>
              <p className="text-[11px] font-medium text-[#718096] mt-1">
                Diterima (≥ 68): {analytics.pass_count || 0} | Perlu Peningkatan (&lt; 68): {analytics.fail_count || 0}
              </p>
            </div>
          </>
        )}
      </div>

      {/* SUS Interpretations Distribution (If SUS) */}
      {isSUS && analytics.interpretations && (
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-[#1A202C]">Distribusi Interpretasi Standar SUS</h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {analytics.interpretations.map((item) => (
              <div key={item.label} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                <span className="text-xs font-bold text-[#4A5568] block">{item.label}</span>
                <span className="text-2xl font-bold text-[#00695C] block mt-1">{item.count}</span>
                <span className="text-[11px] font-medium text-[#718096]">{item.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question Statistics Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-6">
        <h3 className="text-base font-bold text-[#1A202C]">Statistik Jawaban Per Pertanyaan</h3>
        <div className="space-y-6">
          {analytics.question_statistics.map((q) => (
            <div key={q.question_id} className="p-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
              <div className="flex justify-between items-start gap-4">
                <h4 className="font-bold text-sm text-[#1A202C] leading-relaxed">
                  Soal #{q.display_order}. {q.question_text}
                </h4>
                <span className="text-xs font-bold text-[#00695C] bg-[#E6FFFA] px-3 py-1 rounded-lg border border-[#00695C]/20 shrink-0">
                  Rata-rata: {q.average_rating.toFixed(2)} / 5
                </span>
              </div>

              {/* Rating Bars 1 to 5 */}
              <div className="space-y-2 pt-2">
                {[1, 2, 3, 4, 5].map((ratingVal) => {
                  const cnt = q.rating_counts[String(ratingVal)] || 0;
                  const pct = analytics.total_participants > 0 ? (cnt / analytics.total_participants) * 100 : 0;
                  return (
                    <div key={ratingVal} className="flex items-center text-xs gap-3">
                      <span className="w-16 font-bold text-[#4A5568]">Skor {ratingVal}</span>
                      <div className="flex-1 bg-[#E2E8F0] h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-[#00695C] h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-20 text-right font-semibold text-[#718096]">
                        {cnt} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Response Table */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-[#1A202C]">Daftar Respons Pasien ({totalResponses})</h3>
        </div>

        {responses.length === 0 ? (
          <p className="text-xs text-[#718096] text-center py-8">Belum ada respons dari peserta.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#4A5568]">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-bold uppercase tracking-wider text-[#718096]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Nama Pasien</th>
                  <th className="py-3.5 px-4 font-semibold">Kontak</th>
                  <th className="py-3.5 px-4 font-semibold">Waktu Selesai</th>
                  {isSUS ? (
                    <>
                      <th className="py-3.5 px-4 font-semibold">Skor Mentah</th>
                      <th className="py-3.5 px-4 font-semibold">Skor SUS</th>
                      <th className="py-3.5 px-4 font-semibold">Interpretasi</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3.5 px-4 font-semibold">Total Skor</th>
                      <th className="py-3.5 px-4 font-semibold">Skor Rata-Rata</th>
                      <th className="py-3.5 px-4 font-semibold">Persentase</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                    </>
                  )}
                  <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-xs font-medium">
                {responses.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-3.5 px-4 font-bold text-[#1A202C]">{r.patient_name}</td>
                    <td className="py-3.5 px-4 text-xs text-[#718096]">{r.patient_phone || r.patient_email || "-"}</td>
                    <td className="py-3.5 px-4 text-xs text-[#718096]">
                      {new Date(r.completed_at).toLocaleString("id-ID")}
                    </td>
                    {isSUS ? (
                      <>
                        <td className="py-3.5 px-4 font-semibold">{r.raw_score?.toFixed(1) ?? "-"}</td>
                        <td className="py-3.5 px-4 font-bold text-[#00695C]">{r.sus_score?.toFixed(1) ?? "-"}</td>
                        <td className="py-3.5 px-4 font-semibold">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getInterpretationBadgeClass(
                              r.interpretation
                            )}`}
                          >
                            {r.interpretation ?? "-"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase border bg-emerald-50 text-emerald-700 border-emerald-200">
                            TERISI LENGKAP
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3.5 px-4 font-semibold">{r.total_score?.toFixed(1) ?? "-"}</td>
                        <td className="py-3.5 px-4 font-bold text-[#00695C]">{r.average_score?.toFixed(2) ?? "-"}</td>
                        <td className="py-3.5 px-4 font-semibold">{r.percentage_score?.toFixed(1) ?? "-"}%</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase border bg-emerald-50 text-emerald-700 border-emerald-200">
                            TERISI LENGKAP
                          </span>
                        </td>
                      </>
                    )}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedResponse(r)}
                        className="px-3 py-1.5 bg-[#00695C]/10 hover:bg-[#00695C]/20 text-[#00695C] border border-[#00695C]/30 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Lihat Detail Jawaban Peserta"
                      >
                        <span className="material-symbols-outlined text-[16px] select-none">visibility</span>
                        <span>Lihat Jawaban</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalResponses > 10 && (
          <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
            <p className="text-xs text-[#718096]">
              Menampilkan {responses.length} dari {totalResponses} respons
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <span className="text-xs font-semibold px-2">Halaman {page}</span>
              <button
                type="button"
                disabled={page * 10 >= totalResponses}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Response Detail Modal Dialog */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E2E8F0] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-start bg-[#F8FAFC]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                    TERISI LENGKAP
                  </span>
                  <span className="text-xs text-[#718096]">
                    Waktu: {new Date(selectedResponse.completed_at).toLocaleString("id-ID")}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1A202C]">
                  Detail Jawaban: {selectedResponse.patient_name}
                </h3>
                <p className="text-xs text-[#718096] mt-0.5">
                  Kontak: {selectedResponse.patient_phone || selectedResponse.patient_email || "-"} • Durasi:{" "}
                  {Math.floor(selectedResponse.duration_seconds / 60)}m {selectedResponse.duration_seconds % 60}d
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedResponse(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Tutup dialog"
              >
                <span className="material-symbols-outlined text-xl select-none">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Summary Score Card */}
              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-4">
                {isSUS ? (
                  <>
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#718096] block">Skor SUS (0-100)</span>
                      <span className="text-2xl font-bold text-[#00695C]">
                        {selectedResponse.sus_score?.toFixed(1) ?? "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#718096] block">Skor Mentah</span>
                      <span className="text-lg font-bold text-[#1A202C]">
                        {selectedResponse.raw_score?.toFixed(1) ?? "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#718096] block">Interpretasi Usability</span>
                      <span
                        className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold border ${getInterpretationBadgeClass(
                          selectedResponse.interpretation
                        )}`}
                      >
                        {selectedResponse.interpretation ?? "-"}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#718096] block">Skor Rata-Rata</span>
                      <span className="text-2xl font-bold text-[#00695C]">
                        {selectedResponse.average_score?.toFixed(2) ?? "-"} / 5
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#718096] block">Total Skor</span>
                      <span className="text-lg font-bold text-[#1A202C]">
                        {selectedResponse.total_score?.toFixed(1) ?? "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#718096] block">Persentase Kepuasan</span>
                      <span className="text-lg font-bold text-emerald-600">
                        {selectedResponse.percentage_score?.toFixed(1) ?? "-"}%
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Question & Answer Details List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#1A202C]">
                  Rincian Jawaban Per Pertanyaan ({selectedResponse.answers.length} Soal)
                </h4>

                {selectedResponse.answers.length === 0 ? (
                  <p className="text-xs text-[#718096] py-4 text-center">
                    Data jawaban item pertanyaan tidak tersedia untuk catatan ini.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedResponse.answers.map((ans, idx) => (
                      <div
                        key={ans.question_id || idx}
                        className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#00695C]/30 transition-all space-y-2.5"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <p className="text-xs font-bold text-[#1A202C] leading-relaxed">
                            <span className="text-[#00695C] mr-1.5">#{idx + 1}.</span>
                            {ans.question_text || `Pertanyaan #${idx + 1}`}
                          </p>
                          <span className="px-2.5 py-1 bg-[#00695C]/10 text-[#00695C] text-xs font-bold rounded-lg shrink-0 border border-[#00695C]/20">
                            Skor: {ans.rating_value} / 5
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between text-xs pt-1 border-t border-[#E2E8F0]/60 gap-2">
                          <span className="font-semibold text-[#4A5568]">
                            Jawaban: <span className="text-[#1A202C] font-bold">{getLikertLabel(ans.rating_value)}</span>
                          </span>
                          {isSUS && ans.adjusted_score !== undefined && (
                            <span className="text-[11px] text-[#718096] font-medium bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">
                              Kontribusi Terbobot: +{ans.adjusted_score}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E2E8F0] flex justify-end bg-[#F8FAFC]">
              <button
                type="button"
                onClick={() => setSelectedResponse(null)}
                className="px-5 py-2.5 bg-white hover:bg-slate-100 text-[#1A202C] border border-[#E2E8F0] font-bold text-xs rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getLikertLabel(val: number): string {
  switch (val) {
    case 1:
      return "Sangat Tidak Setuju";
    case 2:
      return "Tidak Setuju";
    case 3:
      return "Netral";
    case 4:
      return "Setuju";
    case 5:
      return "Sangat Setuju";
    default:
      return `Skor ${val}`;
  }
}

function getInterpretationBadgeClass(interp?: string): string {
  switch (interp?.toLowerCase()) {
    case "excellent":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "good":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "ok":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
    case "poor":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "awful":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}
