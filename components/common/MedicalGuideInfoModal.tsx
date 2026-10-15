"use client";

import { useState, useEffect } from "react";
import { Portal } from "@/components/ui/Portal";

interface MedicalGuideInfoModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function MedicalGuideInfoModal({
  isOpen,
  onClose,
}: MedicalGuideInfoModalProps) {
  const [activeTab, setActiveTab] = useState<"glucose" | "compliance">(
    "glucose",
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Portal>
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 min-h-screen w-screen z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in font-[family-name:var(--font-poppins)] overflow-y-auto"
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-[#E2E8F0]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] text-[#3B67FC] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">
                menu_book
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#1A202C]">
                Panduan Standar & Klasifikasi
              </h3>
              <p className="text-xs text-[#718096]">
                Pedoman acuan klinis kadar gula darah (ADA/PERKENI) & kriteria
                kepatuhan pasien
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#718096] hover:bg-[#EDF2F7] hover:text-[#1A202C] transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E2E8F0] px-6 bg-white shrink-0">
          <button
            onClick={() => setActiveTab("glucose")}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "glucose"
                ? "border-[#3B67FC] text-[#3B67FC]"
                : "border-transparent text-[#718096] hover:text-[#1A202C]"
            }`}
          >
            1. Klasifikasi Glukosa Darah
          </button>
          <button
            onClick={() => setActiveTab("compliance")}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "compliance"
                ? "border-[#3B67FC] text-[#3B67FC]"
                : "border-transparent text-[#718096] hover:text-[#1A202C]"
            }`}
          >
            2. Status Kepatuhan Pasien
          </button>
        </div>

        {/* Modal Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === "glucose" ? (
            <div className="space-y-6">
              <div className="bg-[#F0FDF4] p-3.5 rounded-xl border border-emerald-200 text-xs text-[#166534] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
                  verified
                </span>
                <span>
                  Sistem mengklasifikasikan data kadar gula darah berdasarkan <strong>waktu pengukuran</strong> sesuai
                  pedoman ADA & Konsensus PERKENI. Untuk frekuensi periode satu bulan ini, perhitungan dan klasifikasi acuan difokuskan pada <strong>Puasa</strong> dan <strong>2 Jam Sesudah Makan</strong>.
                </span>
              </div>

              {/* 1. Puasa */}
              <div className="border border-[#E2E8F0] rounded-xl p-4 bg-white shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#1A202C] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3B67FC]" />
                    1. Puasa (GDP / Fasting Blood Glucose)
                  </h4>
                  <span className="text-[11px] font-semibold text-[#3B67FC] bg-[#E8F0FF] px-2 py-0.5 rounded font-medium">
                    Komponen Aktif Perhitungan
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#FFF5F5] border border-red-100">
                    <span className="font-bold text-red-700">
                      &lt; 70 mg/dL
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-800">
                      Hipoglikemia (Kritis)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#FFFBEB] border border-amber-100">
                    <span className="font-bold text-amber-700">
                      70 – 79 mg/dL
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800">
                      Waspada Rendah
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#F0FDF4] border border-emerald-100">
                    <span className="font-bold text-emerald-700">
                      80 – 130 mg/dL
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                      Normal / Terkontrol
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#FFFBEB] border border-amber-100">
                    <span className="font-bold text-amber-700">
                      131 – 180 mg/dL
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800">
                      Waspada / Elevated
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#FFF5F5] border border-red-100 sm:col-span-2">
                    <span className="font-bold text-red-700">
                      &gt; 180 mg/dL
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-800">
                      Hiperglikemia (Tinggi)
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. 2 Jam Sesudah Makan */}
              <div className="border border-[#E2E8F0] rounded-xl p-4 bg-white shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#1A202C] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E53E3E]" />
                    2. 2 Jam Sesudah Makan (GD2PP / Post-prandial)
                  </h4>
                  <span className="text-[11px] font-semibold text-[#3B67FC] bg-[#E8F0FF] px-2 py-0.5 rounded font-medium">
                    Komponen Aktif Perhitungan
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#FFF5F5] border border-red-100">
                    <span className="font-bold text-red-700">
                      &lt; 70 mg/dL
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-800">
                      Hipoglikemia
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#F0FDF4] border border-emerald-100">
                    <span className="font-bold text-emerald-700">
                      70 – 179 mg/dL
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                      Normal / Terkontrol
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#FFF5F5] border border-red-100">
                    <span className="font-bold text-red-700">
                      &ge; 180 mg/dL
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-800">
                      Hiperglikemia
                    </span>
                  </div>
                </div>
              </div>

              {/* Komponen lain (hanya untuk log pencatatan, tidak mempengaruhi perhitungan/klasifikasi periode 1 bulan) */}
              <div className="border border-dashed border-[#CBD5E1] rounded-xl p-4 bg-[#F8FAFC] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#64748B]">info</span>
                  <h4 className="font-bold text-xs text-[#475569]">
                    Kategori Pengukuran Lainnya (Tersimpan sebagai Catatan Log)
                  </h4>
                </div>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  Data pengukuran di bawah tetap dicatat dan tersimpan dalam riwayat medis pasien, namun saat ini tidak memengaruhi klasifikasi maupun perhitungan standar pada periode satu bulan ini:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                    <span className="font-semibold text-[#1A202C] block">Sebelum Makan</span>
                    <span className="text-[#64748B] text-[10px]">Pre-prandial</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                    <span className="font-semibold text-[#1A202C] block">Sebelum Tidur</span>
                    <span className="text-[#64748B] text-[10px]">Bedtime</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                    <span className="font-semibold text-[#1A202C] block">Sewaktu (Acak)</span>
                    <span className="text-[#64748B] text-[10px]">Random GDS</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-xs text-[#4A5568]">
              <div className="bg-[#F0FDF4] p-3.5 rounded-xl border border-emerald-200 text-xs text-[#166534] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
                  insights
                </span>
                <span>
                  <strong>Status Kepatuhan Pasien</strong> dihitung secara
                  otomatis oleh sistem berdasarkan konsistensi pengisian log
                  mandiri 3 pilar utama: <strong>Asupan Makanan</strong>, <strong>Aktivitas Fisik</strong>,
                  dan <strong>Kepatuhan Minum Obat</strong> (pencatatan gula darah dikecualikan dari perhitungan kepatuhan).
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-[#E2E8F0] rounded-xl p-3 bg-white">
                  <p className="font-bold text-[#1A202C]">Kepatuhan Hari Ini</p>
                  <p className="mt-1 leading-relaxed">
                    Dihitung hanya dari catatan pada hari ini. Jika pasien belum
                    mencatat apa pun, statusnya &quot;Belum Ada Catatan Hari
                    Ini&quot; (bukan Tidak Patuh). Ditampilkan pada Data Pasien
                    dan profil pasien.
                  </p>
                </div>
                <div className="border border-[#E2E8F0] rounded-xl p-3 bg-white">
                  <p className="font-bold text-[#1A202C]">
                    Tren Kepatuhan 7 Hari
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Rata-rata skor harian selama 7 hari terakhir untuk menilai
                    konsistensi jangka panjang. Dipakai pada Monitoring Catatan
                    dan klasifikasi di bawah ini.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Patuh */}
                <div className="border border-emerald-200 rounded-xl p-4 bg-[#F0FDF4] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                    ✓
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-emerald-900">
                        Patuh
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-200 text-emerald-900">
                        &ge; 70%
                      </span>
                    </div>
                    <p className="mt-1 text-emerald-800 leading-relaxed">
                      Pasien rutin, aktif, dan konsisten melakukan pencatatan
                      harian makanan, aktivitas fisik, dan kepatuhan
                      minum obat.
                    </p>
                  </div>
                </div>

                {/* Kurang Patuh */}
                <div className="border border-amber-200 rounded-xl p-4 bg-[#FFFBEB] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">
                    !
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-amber-900">
                        Kurang Patuh
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200 text-amber-900">
                        40% – 69%
                      </span>
                    </div>
                    <p className="mt-1 text-amber-800 leading-relaxed">
                      Pasien mengisi sebagian catatan secara berkala, namun
                      masih sering terlewat pada hari-hari tertentu.
                    </p>
                  </div>
                </div>

                {/* Tidak Patuh */}
                <div className="border border-red-200 rounded-xl p-4 bg-[#FFF5F5] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm shrink-0">
                    ✕
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-red-900">
                        Tidak Patuh
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-200 text-red-900">
                        &lt; 40%
                      </span>
                    </div>
                    <p className="mt-1 text-red-800 leading-relaxed">
                      Pasien sangat jarang atau tidak pernah melakukan pengisian
                      catatan harian pada aplikasi mobile. Memerlukan tindak
                      lanjut/pendampingan tenaga kesehatan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#3B67FC] hover:bg-[#1A63ED] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );
}
