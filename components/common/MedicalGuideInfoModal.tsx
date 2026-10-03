"use client";

import { useState, useEffect } from "react";

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
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 min-h-screen w-screen z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in font-[family-name:var(--font-poppins)] overflow-y-auto"
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-[#E2E8F0]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6F2F1] text-[#00695C] flex items-center justify-center">
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
                ? "border-[#00695C] text-[#00695C]"
                : "border-transparent text-[#718096] hover:text-[#1A202C]"
            }`}
          >
            1. Klasifikasi Glukosa Darah
          </button>
          <button
            onClick={() => setActiveTab("compliance")}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "compliance"
                ? "border-[#00695C] text-[#00695C]"
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
                  Sistem secara otomatis mengklasifikasikan data kadar gula
                  darah berdasarkan <strong>waktu pengukuran</strong> sesuai
                  pedoman ADA (American Diabetes Association) & Konsensus
                  PERKENI.
                </span>
              </div>

              {/* 1. Puasa */}
              <div className="border border-[#E2E8F0] rounded-xl p-4 bg-white shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#1A202C] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00695C]" />
                    1. Puasa (GDP / Fasting Blood Glucose)
                  </h4>
                  <span className="text-[11px] font-semibold text-[#718096] bg-[#F1F5F9] px-2 py-0.5 rounded">
                    Minimal puasa 8 jam
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

              {/* 2. Sebelum Makan */}
              <div className="border border-[#E2E8F0] rounded-xl p-4 bg-white shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#1A202C] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                    2. Sebelum Makan (Pre-prandial)
                  </h4>
                  <span className="text-[11px] font-semibold text-[#718096] bg-[#F1F5F9] px-2 py-0.5 rounded">
                    Sebelum makan siang/malam
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#FFF5F5] border border-red-100">
                    <span className="font-bold text-red-700">
                      &lt; 70 mg/dL
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-800">
                      Hipoglikemia
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
                      &gt; 130 mg/dL
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800">
                      Waspada / Elevated
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. 2 Jam Sesudah Makan */}
              <div className="border border-[#E2E8F0] rounded-xl p-4 bg-white shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#1A202C] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E53E3E]" />
                    3. 2 Jam Sesudah Makan (GD2PP / Post-prandial)
                  </h4>
                  <span className="text-[11px] font-semibold text-[#718096] bg-[#F1F5F9] px-2 py-0.5 rounded">
                    Tepat 2 jam sesudah makan
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

              {/* 4. Sebelum Tidur */}
              <div className="border border-[#E2E8F0] rounded-xl p-4 bg-white shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#1A202C] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                    4. Sebelum Tidur (Bedtime)
                  </h4>
                  <span className="text-[11px] font-semibold text-[#718096] bg-[#F1F5F9] px-2 py-0.5 rounded">
                    Malam hari sebelum tidur
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#FFF5F5] border border-red-100">
                    <span className="font-bold text-red-700">
                      &lt; 100 mg/dL
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-800">
                      Hipoglikemia Malam
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#F0FDF4] border border-emerald-100">
                    <span className="font-bold text-emerald-700">
                      100 – 140 mg/dL
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                      Normal / Terkontrol
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#FFFBEB] border border-amber-100">
                    <span className="font-bold text-amber-700">
                      &gt; 140 mg/dL
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800">
                      Waspada / Elevated
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Sewaktu */}
              <div className="border border-[#E2E8F0] rounded-xl p-4 bg-white shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#1A202C] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3182CE]" />
                    5. Sewaktu (GDS / Random Blood Glucose)
                  </h4>
                  <span className="text-[11px] font-semibold text-[#718096] bg-[#F1F5F9] px-2 py-0.5 rounded">
                    Pengukuran acak
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
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
                      70 – 139 mg/dL
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                      Normal / Terkontrol
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#FFFBEB] border border-amber-100">
                    <span className="font-bold text-amber-700">
                      140 – 199 mg/dL
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800">
                      Waspada / TGT
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#FFF5F5] border border-red-100">
                    <span className="font-bold text-red-700">
                      &ge; 200 mg/dL
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-800">
                      Hiperglikemia Tinggi
                    </span>
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
                  mandiri 4 pilar (Gula Darah, Asupan Makanan, Aktivitas Fisik,
                  dan Obat/Insulin).
                </span>
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
                      harian gula darah, makanan, aktivitas fisik, dan kepatuhan
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
            className="px-5 py-2 bg-[#00695C] hover:bg-[#005247] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
}
