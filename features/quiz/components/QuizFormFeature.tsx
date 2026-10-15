"use client";

import { useState, useRef } from "react";
import { useQuizForm } from "../hooks/useQuizForm";
import { BackButton } from "@/components/common/BackButton";
import { ROUTES } from "@/constants/routes";
import { FormLoader } from "@/components/ui/loading";
import { Select } from "@/components/ui/Select";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useToast } from "@/components/ui/Toast";

interface QuizFormFeatureProps {
  readonly quizId?: string;
}

interface QuestionImageUploaderProps {
  readonly imageUrl?: string;
  readonly onChange: (url: string) => void;
}

function compressImage(file: File, maxWidth = 1000, maxHeight = 1000, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve((e.target?.result as string) ?? "");
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = (e.target?.result as string) ?? "";
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

function QuestionImageUploader({
  imageUrl,
  onChange,
}: QuestionImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast({
        type: "error",
        title: "Gagal Unggah",
        description:
          "Hanya file gambar (JPG, JPEG, PNG, WEBP) yang diperbolehkan.",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const MAX_SIZE = 1 * 1024 * 1024; // 1 MB
    if (file.size > MAX_SIZE) {
      showToast({
        type: "error",
        title: "Ukuran Terlalu Besar",
        description: "Maksimal ukuran gambar adalah 1 MB untuk pengiriman yang cepat & stabil.",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      const compressedUrl = await compressImage(file);
      onChange(compressedUrl);
    } catch {
      showToast({
        type: "error",
        title: "Gagal Mengolah Gambar",
        description: "Terjadi kesalahan saat memproses file gambar.",
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/jpg, image/png, image/webp"
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#718096] flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-[#3B67FC]">
            image
          </span>
          <span>Ilustrasi Gambar Pertanyaan (Opsional)</span>
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-semibold text-[#3B67FC] hover:underline cursor-pointer"
        >
          {showUrlInput
            ? "Unggah Gambar dari Komputer"
            : "Atau Tempel URL Direct"}
        </button>
      </div>

      {imageUrl ? (
        <div className="relative border border-[#E2E8F0] rounded-xl p-3 bg-slate-50 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Ilustrasi Soal"
            className="w-20 h-20 object-cover rounded-lg border border-[#E2E8F0] shrink-0 bg-white"
          />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-[#1A202C] block truncate mb-1">
              {imageUrl.startsWith("data:")
                ? "Gambar Ilustrasi Terunggah"
                : imageUrl}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 rounded-lg border border-[#3B67FC] bg-[#EEF2FF] text-[#3B67FC] text-xs font-bold hover:bg-[#3B67FC] hover:text-white transition-all cursor-pointer"
              >
                Ganti Gambar
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="px-3 py-1 rounded-lg border border-red-200 bg-red-50 text-red-600 text-xs font-bold hover:bg-red-600 hover:text-white transition-all cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      ) : showUrlInput ? (
        <input
          value={imageUrl || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 rounded-xl border border-[#E2E8F0] bg-white px-4 text-xs text-[#1A202C] focus:ring-1 focus:ring-[#3B67FC] outline-none"
          placeholder="https://example.com/illustration.png"
        />
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#E2E8F0] hover:border-[#3B67FC] bg-slate-50/50 hover:bg-[#EEF2FF]/50 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center justify-center gap-2 text-[#718096] group-hover:text-[#3B67FC]">
            <span className="material-symbols-outlined text-xl">
              cloud_upload
            </span>
            <span className="text-xs font-bold">
              Klik untuk Unggah Gambar Ilustrasi Pertanyaan
            </span>
          </div>
          <span className="text-[10px] text-[#A0AEC0] block mt-1">
            Format: JPG, PNG, WEBP (Maksimal 5MB)
          </span>
        </div>
      )}
    </div>
  );
}

const difficultyOptions = [
  { value: "Mudah", label: "Mudah" },
  { value: "Sedang", label: "Sedang" },
  { value: "Sulit", label: "Sulit" },
] as const;

export function QuizFormFeature({ quizId }: QuizFormFeatureProps) {
  const { showToast } = useToast();

  // Modal confirmation for deleting a Category (Pre-Test only)
  const [categoryToDeleteIndex, setCategoryToDeleteIndex] = useState<
    number | null
  >(null);

  const {
    fields,
    articleOptions,
    existingPreTest,
    eligiblePreTests,
    isLoadingPreTests,
    isLoading,
    isSaving,
    handleChange,
    deleteCategory,
    addQuestion,
    deleteQuestion,
    handleQuestionChange,
    addChoice,
    deleteChoice,
    handleChoiceChange,
    handleChoiceScoreChange,
    setCorrectChoice,
    handleQuestionImageChange,
    save,
    cancel,
  } = useQuizForm(quizId);

  if (isLoading) {
    return <FormLoader />;
  }

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    save("Draft");
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    save("Aktif");
  };

  const isPreTest = fields.type === "PRE_TEST";
  const isEducation = fields.scope === "EDUCATION";
  const isApplication = !isEducation;
  const selectedPreTest = eligiblePreTests.find((item) => item.id === fields.sourcePreTestId);

  return (
    <div className="max-w-[1400px] mx-auto w-full font-[family-name:var(--font-poppins)] space-y-8 pb-12">
      {/* Page Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-[#E2E8F0] pb-4">
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <BackButton
              href={ROUTES.MANAJEMEN_KUISIONER}
              label="Manajemen Kuesioner"
            />
          </div>
          <h2 className="text-2xl font-bold text-[#1A202C]">
            {quizId ? "Edit Kuesioner" : "Tambah Kuesioner Baru"}
          </h2>
          <p className="text-xs text-[#718096] mt-1 flex items-center gap-1.5">
            {isApplication
              ? `${isPreTest ? "Pre-Test" : "Post-Test"} Aplikasi: DSMQR & DSMES (Pilihan Jawaban Bebas, Tanpa Benar/Salah & Passing Score)`
              : `${isPreTest ? "Pre-Test" : "Post-Test"} Edukasi: Terikat pada 1 Materi Edukasi (Dengan Kunci Jawaban)`}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto flex-wrap sm:flex-nowrap">
          <button
            onClick={cancel}
            type="button"
            className="h-12 px-6 rounded-xl border border-[#E2E8F0] bg-white text-sm font-bold text-[#1A202C] hover:bg-slate-50 transition-all cursor-pointer shadow-xs shrink-0"
          >
            Batal
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            type="button"
            className="h-12 px-6 rounded-xl border border-[#3B67FC] bg-[#EEF2FF] text-[#3B67FC] text-sm font-bold hover:bg-[#A8EEFA]/20 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            Simpan Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={isSaving}
            type="button"
            className="h-12 px-6 rounded-xl bg-[#3B67FC] text-white text-sm font-bold hover:bg-[#1A63ED] transition-all cursor-pointer shadow-md shadow-[#3B67FC]/10 disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-lg select-none">
              publish
            </span>
            <span>Aktifkan / Terbitkan</span>
          </button>
        </div>
      </div>

      <form className="space-y-8">
        {/* Section 1: Type Switcher & Basic Info */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
          <h3 className="text-base font-bold text-[#1A202C] flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
            <span className="material-symbols-outlined text-[#3B67FC] text-xl select-none">
              tune
            </span>
            <span>Buat Kuesioner</span>
          </h3>

          {/* Scope Switcher: primary decision */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#3B67FC] uppercase tracking-[0.16em]">
                1. Pilih Ranah Kuesioner <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-[#718096] mt-1">
                Tentukan tujuan utama kuesioner. Pengaturan pertanyaan akan menyesuaikan pilihan ini.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {(
                [
                  {
                    value: "APPLICATION",
                    icon: "monitor_heart",
                    eyebrow: "Evaluasi Program DIBA",
                    title: "Kuesioner Aplikasi",
                    desc: "Bandingkan perkembangan kemampuan pengelolaan diabetes pasien selama menggunakan aplikasi.",
                    features: ["Instrumen DSMQR & DSMES", "Tanpa benar atau salah", "Perbandingan skor awal & akhir"],
                  },
                  {
                    value: "EDUCATION",
                    icon: "menu_book",
                    eyebrow: "Evaluasi Per Materi",
                    title: "Kuesioner Edukasi",
                    desc: "Ukur perubahan pemahaman pasien untuk satu materi edukasi tertentu.",
                    features: ["Terhubung ke materi edukasi", "Pre-Test sebelum membaca", "Post-Test setelah ulasan"],
                  },
                ] as const
              ).map((opt) => {
                const selected = fields.scope === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={Boolean(quizId)}
                    onClick={() => handleChange("scope", opt.value)}
                    className={[
                      "relative overflow-hidden text-left p-6 rounded-2xl border-2 transition-all duration-200",
                      quizId ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:-translate-y-0.5",
                      selected
                        ? "border-[#3B67FC] bg-gradient-to-br from-[#E8F0FF] via-white to-[#EEF2FF] shadow-lg shadow-[#3B67FC]/10"
                        : "border-[#E2E8F0] bg-white hover:border-[#61DDEB] hover:shadow-md",
                    ].join(" ")}
                  >
                    {selected && <span className="absolute inset-y-0 left-0 w-1.5 bg-[#3B67FC]" />}
                    <div className="flex items-start gap-4">
                      <div className={[
                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                        selected ? "bg-[#3B67FC] text-white" : "bg-[#EEF2FF] text-[#3B67FC]",
                      ].join(" ")}>
                        <span className="material-symbols-outlined text-[28px]">{opt.icon}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#3B67FC]">{opt.eyebrow}</span>
                            <h4 className="text-lg font-extrabold text-[#1A202C] mt-0.5">{opt.title}</h4>
                          </div>
                          <span className={[
                            "material-symbols-outlined text-xl",
                            selected ? "text-[#3B67FC]" : "text-[#CBD5E1]",
                          ].join(" ")}>{selected ? "check_circle" : "radio_button_unchecked"}</span>
                        </div>
                        <p className="text-xs text-[#4A5568] leading-relaxed mt-2">{opt.desc}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {opt.features.map((feature) => (
                            <span key={feature} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#DDE7E5] text-[10px] font-bold text-[#4A5568]">
                              <span className="material-symbols-outlined text-[12px] text-[#3B67FC]">check</span>
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Type Switcher: secondary compact decision */}
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:flex sm:items-center sm:justify-between gap-5">
            <div className="mb-3 sm:mb-0">
              <label className="block text-[11px] font-bold text-[#4A5568] uppercase tracking-wider">
                2. Tahap Pengukuran
              </label>
              <p className="text-[11px] text-[#718096] mt-0.5">
                {isEducation ? "Sebelum atau sesudah pasien membaca materi." : "Kondisi awal atau perkembangan setelah program."}
              </p>
            </div>
            <div className="inline-grid grid-cols-2 rounded-xl border border-[#CBD5E1] bg-white p-1 w-full sm:w-auto sm:min-w-[380px]">
              <button
                type="button"
                onClick={() => handleChange("type", "PRE_TEST")}
                className={[
                  "h-10 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  isPreTest ? "bg-[#3B67FC] text-white shadow-sm" : "text-[#4A5568] hover:bg-[#EEF2FF]",
                ].join(" ")}
              >
                Sebelum <span className="hidden sm:inline">({isEducation ? "Pre-Test Materi" : "Pre-Test"})</span>
              </button>
              <button
                type="button"
                onClick={() => handleChange("type", "POST_TEST")}
                className={[
                  "h-10 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  !isPreTest ? "bg-[#3B67FC] text-white shadow-sm" : "text-[#4A5568] hover:bg-[#EEF2FF]",
                ].join(" ")}
              >
                Sesudah <span className="hidden sm:inline">({isEducation ? "Post-Test Materi" : "Post-Test"})</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-2">
                Judul Kuesioner <span className="text-red-500">*</span>
              </label>
              <input
                value={fields.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full h-12 rounded-xl border border-[#E2E8F0] bg-white px-4 focus:ring-1 focus:ring-[#3B67FC] focus:border-[#3B67FC] text-sm text-[#1A202C] outline-none"
                placeholder={
                  isPreTest
                    ? "misal: Pre-Test Evaluasi Pengetahuan Awal DIBA"
                    : "misal: Quiz Evaluasi Nutrisi Sehat Diabetes"
                }
                required
                type="text"
              />
            </div>

            {/* Description */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-2">
                Deskripsi Kuesioner (Opsional)
              </label>
              <textarea
                value={fields.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-[#E2E8F0] bg-white p-3 focus:ring-1 focus:ring-[#3B67FC] focus:border-[#3B67FC] text-sm text-[#1A202C] outline-none"
                placeholder="Penjelasan singkat mengenai kuesioner ini..."
              />
            </div>

            {/* Linked Education Material for both PRE-TEST and POST-TEST */}
            {isEducation && (
            <div className="col-span-1">
              <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-2">
                Materi Edukasi Terkait{" "}
                <span className="text-red-500">*</span>
              </label>
              <Select
                value={fields.educationId}
                onChange={(val) => handleChange("educationId", val)}
                options={articleOptions}
                placeholder="Pilih Materi Edukasi Terkait"
                required
              />
            </div>
            )}

            {!isPreTest && (
              <div className="col-span-1 md:col-span-2 rounded-2xl border border-[#A8EEFA] bg-[#EEF2FF]/60 p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#3B67FC]">link</span>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A202C]">Pasangkan dengan Pre-Test</h4>
                    <p className="text-xs text-[#718096] mt-0.5">
                      {isEducation && !fields.educationId
                        ? "Pilih materi edukasi terlebih dahulu agar Pre-Test yang sesuai dapat ditampilkan."
                        : "Hanya Pre-Test dengan ranah dan materi yang sama yang dapat dipilih."}
                    </p>
                  </div>
                </div>
                <Select
                  value={fields.sourcePreTestId || ""}
                  onChange={(val) => handleChange("sourcePreTestId", val)}
                  options={eligiblePreTests.map((item) => ({ value: item.id, label: item.title }))}
                  placeholder={isLoadingPreTests ? "Memuat Pre-Test..." : "Pilih Pre-Test pasangan"}
                  disabled={isLoadingPreTests || (isEducation && !fields.educationId)}
                  required
                />
                {(selectedPreTest || existingPreTest) && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-white border border-[#DDE7E5] p-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1A202C] truncate">
                        {selectedPreTest?.title ?? existingPreTest?.title}
                      </p>
                      <p className="text-[11px] text-[#718096] mt-0.5">
                        {selectedPreTest ? `${selectedPreTest.questionCount} soal - ${selectedPreTest.status}` : "Pre-Test terpasang"}
                      </p>
                    </div>
                    <div className="inline-grid grid-cols-2 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] p-1 text-[11px] font-bold shrink-0">
                      <button
                        type="button"
                        onClick={() => handleChange("copyQuestionsFromPreTest", true)}
                        className={`px-3 py-2 rounded-md ${fields.copyQuestionsFromPreTest ? "bg-[#3B67FC] text-white" : "text-[#4A5568]"}`}
                      >
                        Salin soal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange("copyQuestionsFromPreTest", false)}
                        className={`px-3 py-2 rounded-md ${!fields.copyQuestionsFromPreTest ? "bg-[#3B67FC] text-white" : "text-[#4A5568]"}`}
                      >
                        Soal berbeda
                      </button>
                    </div>
                  </div>
                )}
                {!isLoadingPreTests && (!isEducation || fields.educationId) && eligiblePreTests.length === 0 && !existingPreTest && (
                  <p className="text-xs font-semibold text-amber-700">Belum ada Pre-Test yang memenuhi syarat dan belum memiliki pasangan.</p>
                )}
              </div>
            )}

            {/* Conditional Fields: Only for POST-TEST */}
            {isEducation && !isPreTest ? (
              <>
                {/* Difficulty */}
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-2">
                    Tingkat Kesulitan <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={fields.difficulty}
                    onChange={(val) => handleChange("difficulty", val)}
                    options={difficultyOptions}
                    placeholder="Pilih Tingkat Kesulitan"
                    required
                  />
                </div>

                {/* Passing Score */}
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-2">
                    Nilai Kelulusan (Passing Score){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      value={fields.passingScore}
                      onChange={(e) =>
                        handleChange(
                          "passingScore",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-full h-12 rounded-xl border border-[#E2E8F0] bg-white px-4 focus:ring-1 focus:ring-[#3B67FC] focus:border-[#3B67FC] text-sm text-[#1A202C] pr-12 outline-none"
                      max={100}
                      min={0}
                      placeholder="80"
                      required
                      type="number"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#718096] text-sm font-semibold select-none">
                      %
                    </span>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </section>

        {/* Section 2: Questions Builder */}
        {!isPreTest && fields.copyQuestionsFromPreTest ? (
          <section className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
            <div className="flex items-start gap-3 rounded-xl bg-[#EEF2FF] border border-[#A8EEFA] p-4">
              <span className="material-symbols-outlined text-[#3B67FC]">content_copy</span>
              <div>
                <h3 className="text-sm font-bold text-[#1A202C]">Pertanyaan mengikuti Pre-Test</h3>
                <p className="text-xs text-[#718096] mt-1">Kategori, pertanyaan, pilihan jawaban, gambar, dan pembahasan akan disalin saat Post-Test disimpan.</p>
              </div>
            </div>
          </section>
        ) : isEducation ? (
          /* POST-TEST: Direct Questions Builder (No Categories) */
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#1A202C] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3B67FC] text-xl select-none">
                    quiz
                  </span>
                  <span>Daftar Soal Post-Test</span>
                </h3>
                <p className="text-xs text-[#718096] mt-1">
                  Soal-soal evaluasi langsung untuk menguji pemahaman materi
                  edukasi terkait (Tanpa Kategori).
                </p>
              </div>
              <span className="text-xs font-extrabold text-[#3B67FC] bg-[#EEF2FF] px-3 py-1.5 rounded-full border border-[#3B67FC]/20 self-start sm:self-auto">
                Total {fields.categories[0]?.questions.length || 0} Soal
              </span>
            </div>

            {/* Direct Questions List */}
            <div className="space-y-6">
              {(fields.categories[0]?.questions || []).map((question, qIdx) => (
                <div
                  key={`post_q_${qIdx}`}
                  className="bg-slate-50/50 rounded-2xl border border-[#E2E8F0] p-6 space-y-4 hover:border-[#3B67FC]/30 transition-all"
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between border-b border-[#E2E8F0]/80 pb-3">
                    <span className="text-xs font-bold text-[#3B67FC] bg-[#E8F0FF] px-3 py-1 rounded-lg">
                      Soal #{qIdx + 1}
                    </span>
                    {(fields.categories[0]?.questions.length || 0) > 1 && (
                      <button
                        onClick={() => deleteQuestion(0, qIdx)}
                        type="button"
                        className="px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-red-200"
                      >
                        <span className="material-symbols-outlined text-base select-none">
                          delete
                        </span>
                        <span>Hapus Soal</span>
                      </button>
                    )}
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-xs font-bold text-[#4A5568] mb-1.5">
                      Teks Pertanyaan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={question.questionText}
                      onChange={(e) =>
                        handleQuestionChange(
                          0,
                          qIdx,
                          "questionText",
                          e.target.value,
                        )
                      }
                      rows={2}
                      className="w-full rounded-xl border border-[#E2E8F0] bg-white p-3.5 text-sm text-[#1A202C] focus:ring-1 focus:ring-[#3B67FC] outline-none"
                      placeholder="Tuliskan pertanyaan evaluasi di sini..."
                    />
                  </div>

                  <QuestionImageUploader
                    imageUrl={question.questionImageUrl}
                    onChange={(url) => handleQuestionImageChange(0, qIdx, url)}
                  />

                  {/* Choices */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-[#4A5568]">
                        {isApplication ? "Pilihan Jawaban (Skala Respon)" : "Pilihan Jawaban (Tandai jawaban yang benar)"}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <button
                        onClick={() => addChoice(0, qIdx)}
                        type="button"
                        className="text-xs font-bold text-[#3B67FC] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">
                          add
                        </span>
                        <span>Tambah Pilihan</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {question.choices.map((choice, choiceIdx) => (
                        <div
                          key={`post_c_${qIdx}_${choiceIdx}`}
                          className={[
                            "flex items-center gap-2 p-2.5 rounded-xl border transition-all",
                            choice.isCorrect
                              ? "border-emerald-500 bg-emerald-50/50"
                              : "border-[#E2E8F0] bg-white",
                          ].join(" ")}
                        >
                          {!isApplication && (
                            <input
                              type="radio"
                              name={`correct_post_${qIdx}`}
                              checked={choice.isCorrect}
                              onChange={() => setCorrectChoice(0, qIdx, choiceIdx)}
                              className="w-4 h-4 accent-emerald-600 cursor-pointer"
                            />
                          )}
                          <input
                            value={choice.optionText}
                            onChange={(e) =>
                              handleChoiceChange(
                                0,
                                qIdx,
                                choiceIdx,
                                e.target.value,
                              )
                            }
                            className="flex-1 text-xs text-[#1A202C] bg-transparent outline-none font-semibold"
                            placeholder={`Pilihan ${String.fromCharCode(65 + choiceIdx)}...`}
                          />
                          {!isApplication && choice.isCorrect && (
                            <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full select-none">
                              BENAR
                            </span>
                          )}
                          {question.choices.length > 2 && (
                            <button
                              onClick={() => deleteChoice(0, qIdx, choiceIdx)}
                              type="button"
                              className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm">
                                close
                              </span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-[#718096] mb-1.5">
                      Pembahasan / Penjelasan Jawaban (Opsional)
                    </label>
                    <input
                      value={question.explanation}
                      onChange={(e) =>
                        handleQuestionChange(
                          0,
                          qIdx,
                          "explanation",
                          e.target.value,
                        )
                      }
                      className="w-full h-11 rounded-xl border border-[#E2E8F0] bg-white px-4 text-xs text-[#1A202C] focus:ring-1 focus:ring-[#3B67FC] outline-none"
                      placeholder="Penjelasan mengapa jawaban tersebut benar..."
                    />
                  </div>
                </div>
              ))}

              {/* Add Question Button */}
              <button
                onClick={() => addQuestion(0)}
                type="button"
                className="w-full py-4 rounded-xl border-2 border-dashed border-[#3B67FC] text-[#3B67FC] text-sm font-bold hover:bg-[#EEF2FF] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-lg">
                  add_circle
                </span>
                <span>Tambah Soal Post-Test Baru</span>
              </button>
            </div>
          </section>
        ) : (
          /* APPLICATION: Questions Builder (DSMQR, DSMES) with free-form choices, images, no correct answer */
          <div className="space-y-8">
            <div className="bg-[#F0FDF4] p-4 rounded-2xl border border-emerald-200 text-xs text-[#166534] flex items-start gap-3">
              <span className="material-symbols-outlined text-xl text-[#3B67FC] shrink-0 mt-0.5">
                tune
              </span>
              <div>
                <strong className="block text-sm text-[#3B67FC] mb-1">
                  Pengelolaan Pertanyaan Pre-Test & Skala Respon Bebas
                </strong>
                <span>
                  Admin dapat mengelola pertanyaan dan menentukan pilihan jawaban sesuai kebutuhan pada masing-masing kategori instrumen (Pre-Test Pengetahuan, DSMQR, dan DSMES). Dari sisi mobile, pasien akan menjawab seluruh pertanyaan secara mengalir tanpa melihat label kategori.
                </span>
              </div>
            </div>

            {fields.categories.map((cat, catIdx) => (
              <section
                key={`pre_cat_${catIdx}`}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6"
              >
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[#E8F0FF] text-[#3B67FC] font-extrabold flex items-center justify-center text-sm">
                      #{catIdx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#1A202C]">
                          {cat.title}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#3B67FC] text-white uppercase tracking-wider">
                          {cat.instrumentCategory || "PRE_TEST"}
                        </span>
                      </div>
                      <p className="text-xs text-[#718096] mt-0.5">
                        Kategori instrumen evaluasi:{" "}
                        {cat.instrumentCategory === "DSMQR"
                          ? "Diabetes Self-Management Questionnaire Revised"
                          : cat.instrumentCategory === "DSMES"
                          ? "Diabetes Self-Management Education and Support"
                          : "Pengetahuan Umum Pre-Test"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#3B67FC] bg-[#EEF2FF] px-3 py-1.5 rounded-full border border-[#3B67FC]/20">
                      Total {cat.questions.length} Pertanyaan
                    </span>
                  </div>
                </div>

                {/* Questions under this category */}
                <div className="space-y-6">
                  {cat.questions.map((question, qIdx) => (
                    <div
                      key={`pre_q_${catIdx}_${qIdx}`}
                      className="bg-slate-50/50 rounded-2xl border border-[#E2E8F0] p-6 space-y-4 hover:border-[#3B67FC]/30 transition-all"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-[#E2E8F0]/80 pb-3">
                        <span className="text-xs font-bold text-[#3B67FC] bg-[#E8F0FF] px-3 py-1 rounded-lg">
                          Pertanyaan #{qIdx + 1} ({cat.instrumentCategory})
                        </span>
                        {cat.questions.length > 1 && (
                          <button
                            onClick={() => deleteQuestion(catIdx, qIdx)}
                            type="button"
                            className="px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-red-200"
                          >
                            <span className="material-symbols-outlined text-base select-none">
                              delete
                            </span>
                            <span>Hapus Pertanyaan</span>
                          </button>
                        )}
                      </div>

                      {/* Question Text */}
                      <div>
                        <label className="block text-xs font-bold text-[#4A5568] mb-1.5">
                          Teks Pertanyaan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={question.questionText}
                          onChange={(e) =>
                            handleQuestionChange(
                              catIdx,
                              qIdx,
                              "questionText",
                              e.target.value,
                            )
                          }
                          rows={2}
                          className="w-full rounded-xl border border-[#E2E8F0] bg-white p-3.5 text-sm text-[#1A202C] focus:ring-1 focus:ring-[#3B67FC] outline-none"
                          placeholder="Tuliskan pertanyaan di sini..."
                        />
                      </div>

                      <QuestionImageUploader
                        imageUrl={question.questionImageUrl}
                        onChange={(url) => handleQuestionImageChange(catIdx, qIdx, url)}
                      />

                      {/* Dynamic Choices for Pre-Test */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-[#4A5568]">
                            Pilihan Jawaban & Skala Respon {cat.instrumentCategory === "DSMQR" ? "DSMQR" : cat.instrumentCategory === "DSMES" ? "DSMES" : ""} (Sesuai Input Anda){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <button
                            onClick={() => addChoice(catIdx, qIdx)}
                            type="button"
                            className="text-xs font-bold text-[#3B67FC] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">
                              add
                            </span>
                            <span>Tambah Pilihan</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {question.choices.map((choice, choiceIdx) => (
                            <div
                              key={`pre_c_${catIdx}_${qIdx}_${choiceIdx}`}
                              className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E2E8F0] bg-white transition-all hover:border-[#3B67FC]/40"
                            >
                              <span className="w-6 h-6 rounded-lg bg-[#EEF2FF] text-[#3B67FC] font-bold text-xs flex items-center justify-center shrink-0">
                                {choiceIdx + 1}
                              </span>
                              <input
                                value={choice.optionText}
                                onChange={(e) =>
                                  handleChoiceChange(
                                    catIdx,
                                    qIdx,
                                    choiceIdx,
                                    e.target.value,
                                  )
                                }
                                className="flex-1 text-xs text-[#1A202C] bg-transparent outline-none font-semibold"
                                placeholder={`misal: ${choiceIdx === 0 ? "Tidak Yakin" : choiceIdx === 1 ? "Kurang Yakin" : "Pilihan " + (choiceIdx + 1)}...`}
                              />
                              <input
                                type="number"
                                value={choice.scoreValue ?? ""}
                                onChange={(e) => handleChoiceScoreChange(catIdx, qIdx, choiceIdx, e.target.value)}
                                className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-xs text-center outline-none focus:border-[#3B67FC]"
                                placeholder="Nilai"
                                aria-label="Nilai skor pilihan"
                              />
                              {question.choices.length > 2 && (
                                <button
                                  onClick={() => deleteChoice(catIdx, qIdx, choiceIdx)}
                                  type="button"
                                  className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    close
                                  </span>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Question Button per Category */}
                  <button
                    onClick={() => addQuestion(catIdx)}
                    type="button"
                    className="w-full py-3.5 rounded-xl border-2 border-dashed border-[#3B67FC] text-[#3B67FC] text-xs font-bold hover:bg-[#EEF2FF] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-base">
                      add_circle
                    </span>
                    <span>Tambah Pertanyaan ({cat.title})</span>
                  </button>
                </div>
              </section>
            ))}
          </div>
        )}
      </form>

      {/* Confirmation Modal for Category Deletion */}
      <ConfirmationModal
        open={categoryToDeleteIndex !== null}
        title="Hapus Kategori Pembelajaran?"
        description={`Apakah Anda yakin ingin menghapus Bagian Kategori "${fields.categories[categoryToDeleteIndex ?? 0]?.title || "Kategori"}" beserta seluruh soal di dalamnya?`}
        variant="danger"
        confirmText="Ya, Hapus Kategori"
        cancelText="Batal"
        onConfirm={() => {
          if (categoryToDeleteIndex !== null) {
            deleteCategory(categoryToDeleteIndex);
            setCategoryToDeleteIndex(null);
            showToast({
              type: "success",
              title: "Berhasil Hapus",
              description: "Kategori berhasil dihapus.",
            });
          }
        }}
        onCancel={() => setCategoryToDeleteIndex(null)}
      />
    </div>
  );
}
