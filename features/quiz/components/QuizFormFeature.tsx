"use client";

import { useState, useRef } from "react";
import { useQuizForm } from "../hooks/useQuizForm";
import { BackButton } from "@/components/common/BackButton";
import { ROUTES } from "@/constants/routes";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
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

function QuestionImageUploader({ imageUrl, onChange }: QuestionImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast({
        type: "error",
        title: "Gagal Unggah",
        description: "Hanya file gambar (JPG, JPEG, PNG, WEBP) yang diperbolehkan.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast({
        type: "error",
        title: "Ukuran Terlalu Besar",
        description: "Ukuran gambar maksimal adalah 5MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        onChange(event.target.result);
      }
    };
    reader.readAsDataURL(file);
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
          <span className="material-symbols-outlined text-sm text-[#00695C]">image</span>
          <span>Ilustrasi Gambar Pertanyaan (Opsional)</span>
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-semibold text-[#00695C] hover:underline cursor-pointer"
        >
          {showUrlInput ? "Unggah Gambar dari Komputer" : "Atau Tempel URL Direct"}
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
              {imageUrl.startsWith("data:") ? "Gambar Ilustrasi Terunggah" : imageUrl}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 rounded-lg border border-[#00695C] bg-[#F0F9F8] text-[#00695C] text-xs font-bold hover:bg-[#00695C] hover:text-white transition-all cursor-pointer"
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
          className="w-full h-11 rounded-xl border border-[#E2E8F0] bg-white px-4 text-xs text-[#1A202C] focus:ring-1 focus:ring-[#00695C] outline-none"
          placeholder="https://example.com/illustration.png"
        />
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#E2E8F0] hover:border-[#00695C] bg-slate-50/50 hover:bg-[#F0F9F8]/50 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center justify-center gap-2 text-[#718096] group-hover:text-[#00695C]">
            <span className="material-symbols-outlined text-xl">cloud_upload</span>
            <span className="text-xs font-bold">Klik untuk Unggah Gambar Ilustrasi Pertanyaan</span>
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
  const [categoryToDeleteIndex, setCategoryToDeleteIndex] = useState<number | null>(null);

  const {
    fields,
    articleOptions,
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
    setCorrectChoice,
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

  return (
    <div className="max-w-[1400px] mx-auto w-full font-[family-name:var(--font-poppins)] space-y-8 pb-12">
      {/* Page Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-[#E2E8F0] pb-4">
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <BackButton href={ROUTES.MANAJEMEN_KUISIONER} label="Manajemen Kuesioner" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A202C]">
            {quizId ? "Edit Kuesioner" : "Tambah Kuesioner Baru"}
          </h2>
          <p className="text-xs text-[#718096] mt-1 flex items-center gap-1.5">
            {isPreTest
              ? "Pre-Test Efikasi Diri DMSES (Respon Skala 1–5 Otomatis & Tanpa Passing Score)"
              : "Post-Test Evaluasi Pemahaman Edukasi (Terikat Khusus pada 1 Materi Edukasi & Tanpa Kategori)"}
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
            className="h-12 px-6 rounded-xl border border-[#00695C] bg-[#F0F9F8] text-[#00695C] text-sm font-bold hover:bg-[#B2DFDB]/20 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            Simpan Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={isSaving}
            type="button"
            className="h-12 px-6 rounded-xl bg-[#00695C] text-white text-sm font-bold hover:bg-[#004d43] transition-all cursor-pointer shadow-md shadow-[#00695C]/10 disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-lg select-none">publish</span>
            <span>Aktifkan / Terbitkan</span>
          </button>
        </div>
      </div>

      <form className="space-y-8">
        {/* Section 1: Type Switcher & Basic Info */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
          <h3 className="text-base font-bold text-[#1A202C] flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
            <span className="material-symbols-outlined text-[#00695C] text-xl select-none">tune</span>
            <span>Tipe & Informasi Dasar Kuesioner</span>
          </h3>

          {/* Type Switcher */}
          <div>
            <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-3">
              Pilih Tipe Kuesioner <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
              {/* PRE-TEST Card */}
              <div
                onClick={() => handleChange("type", "PRE_TEST")}
                className={[
                  "relative p-5 sm:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between select-none group",
                  isPreTest
                    ? "border-[#00695C] bg-gradient-to-br from-[#F0F9F8] via-white to-[#E6F2F1]/30 shadow-md shadow-[#00695C]/10 ring-2 ring-[#00695C]/20"
                    : "border-[#E2E8F0] bg-white hover:border-[#00695C]/40 hover:bg-[#F0F9F8]/40 shadow-xs",
                ].join(" ")}
              >
                {isPreTest && (
                  <div className="absolute top-4 right-4 bg-[#00695C] text-white p-1 rounded-full flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-base">check</span>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3.5 mb-3">
                    <div
                      className={[
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                        isPreTest
                          ? "bg-[#00695C] text-white shadow-md shadow-[#00695C]/30"
                          : "bg-teal-100 text-[#00695C] group-hover:bg-[#00695C] group-hover:text-white",
                      ].join(" ")}
                    >
                      <span className="material-symbols-outlined text-2xl">psychology</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-[#1A202C]">PRE-TEST</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-teal-100 text-teal-800 uppercase">
                          Awal
                        </span>
                      </div>
                      <span className="text-xs text-[#718096] font-medium block">
                        Efikasi Diri (Keyakinan Diri Pasien)
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#4A5568] leading-relaxed mb-4">
                    Mengukur tingkat efikasi diri (keyakinan diri) pasien dalam mengelola diabetes menggunakan skala DMSES.
                  </p>
                </div>
                <div className="pt-3 border-t border-teal-100/80 grid grid-cols-1 gap-1.5 text-[11px] font-bold text-[#4A5568]">
                  <div className="flex items-center gap-1.5 text-[#00695C]">
                    <span className="material-symbols-outlined text-sm">psychology</span>
                    <span>Skala Efikasi Diri DMSES (Respon 1–5 Otomatis)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#00695C]">
                    <span className="material-symbols-outlined text-sm">remove_circle_outline</span>
                    <span>Tanpa Passing Score & Tanpa Kategori</span>
                  </div>
                </div>
              </div>

              {/* POST-TEST Card */}
              <div
                onClick={() => handleChange("type", "POST_TEST")}
                className={[
                  "relative p-5 sm:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between select-none group",
                  !isPreTest
                    ? "border-[#00695C] bg-gradient-to-br from-[#F0F9F8] via-white to-[#E6F2F1]/30 shadow-md shadow-[#00695C]/10 ring-2 ring-[#00695C]/20"
                    : "border-[#E2E8F0] bg-white hover:border-[#00695C]/40 hover:bg-[#F0F9F8]/40 shadow-xs",
                ].join(" ")}
              >
                {!isPreTest && (
                  <div className="absolute top-4 right-4 bg-[#00695C] text-white p-1 rounded-full flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-base">check</span>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3.5 mb-3">
                    <div
                      className={[
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                        !isPreTest
                          ? "bg-[#00695C] text-white shadow-md shadow-[#00695C]/30"
                          : "bg-teal-100 text-[#00695C] group-hover:bg-[#00695C] group-hover:text-white",
                      ].join(" ")}
                    >
                      <span className="material-symbols-outlined text-2xl">workspace_premium</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-[#1A202C]">POST-TEST</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-teal-100 text-teal-800 uppercase">
                          Evaluasi
                        </span>
                      </div>
                      <span className="text-xs text-[#718096] font-medium block">
                        Uji Pemahaman Edukasi
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#4A5568] leading-relaxed mb-4">
                    Menguji tingkat pemahaman pasien setelah membaca dan menyelesaikan materi edukasi spesifik.
                  </p>
                </div>
                <div className="pt-3 border-t border-teal-100/80 grid grid-cols-1 gap-1.5 text-[11px] font-bold text-[#4A5568]">
                  <div className="flex items-center gap-1.5 text-[#00695C]">
                    <span className="material-symbols-outlined text-sm">menu_book</span>
                    <span>Terikat Khusus pada 1 Materi Edukasi</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#00695C]">
                    <span className="material-symbols-outlined text-sm">assignment</span>
                    <span>Langsung Daftar Soal (Tanpa Kategori)</span>
                  </div>
                </div>
              </div>
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
                className="w-full h-12 rounded-xl border border-[#E2E8F0] bg-white px-4 focus:ring-1 focus:ring-[#00695C] focus:border-[#00695C] text-sm text-[#1A202C] outline-none"
                placeholder={isPreTest ? "misal: Pre-Test Evaluasi Pengetahuan Awal DSMES" : "misal: Quiz Evaluasi Nutrisi Sehat Diabetes"}
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
                className="w-full rounded-xl border border-[#E2E8F0] bg-white p-3 focus:ring-1 focus:ring-[#00695C] focus:border-[#00695C] text-sm text-[#1A202C] outline-none"
                placeholder="Penjelasan singkat mengenai kuesioner ini..."
              />
            </div>

            {/* Conditional Fields: Only for POST-TEST */}
            {!isPreTest && (
              <>
                {/* Linked Education Material */}
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-2">
                    Materi Edukasi Terkait <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={fields.educationId}
                    onChange={(val) => handleChange("educationId", val)}
                    options={articleOptions}
                    placeholder="Pilih Materi Edukasi"
                    required
                  />
                </div>

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
                    Nilai Kelulusan (Passing Score) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      value={fields.passingScore}
                      onChange={(e) => handleChange("passingScore", parseInt(e.target.value) || 0)}
                      className="w-full h-12 rounded-xl border border-[#E2E8F0] bg-white px-4 focus:ring-1 focus:ring-[#00695C] focus:border-[#00695C] text-sm text-[#1A202C] pr-12 outline-none"
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
            )}
          </div>
        </section>

        {/* Section 2: Questions Builder */}
        {!isPreTest ? (
          /* POST-TEST: Direct Questions Builder (No Categories) */
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#1A202C] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00695C] text-xl select-none">quiz</span>
                  <span>Daftar Soal Post-Test</span>
                </h3>
                <p className="text-xs text-[#718096] mt-1">
                  Soal-soal evaluasi langsung untuk menguji pemahaman materi edukasi terkait (Tanpa Kategori).
                </p>
              </div>
              <span className="text-xs font-extrabold text-[#00695C] bg-[#F0F9F8] px-3 py-1.5 rounded-full border border-[#00695C]/20 self-start sm:self-auto">
                Total {fields.categories[0]?.questions.length || 0} Soal
              </span>
            </div>

            {/* Direct Questions List */}
            <div className="space-y-6">
              {(fields.categories[0]?.questions || []).map((question, qIdx) => (
                <div
                  key={`post_q_${qIdx}`}
                  className="bg-slate-50/50 rounded-2xl border border-[#E2E8F0] p-6 space-y-4 hover:border-[#00695C]/30 transition-all"
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between border-b border-[#E2E8F0]/80 pb-3">
                    <span className="text-xs font-bold text-[#00695C] bg-[#E6F2F1] px-3 py-1 rounded-lg">
                      Soal #{qIdx + 1}
                    </span>
                    {(fields.categories[0]?.questions.length || 0) > 1 && (
                      <button
                        onClick={() => deleteQuestion(0, qIdx)}
                        type="button"
                        className="px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-red-200"
                      >
                        <span className="material-symbols-outlined text-base select-none">delete</span>
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
                      onChange={(e) => handleQuestionChange(0, qIdx, "questionText", e.target.value)}
                      rows={2}
                      className="w-full rounded-xl border border-[#E2E8F0] bg-white p-3.5 text-sm text-[#1A202C] focus:ring-1 focus:ring-[#00695C] outline-none"
                      placeholder="Tuliskan pertanyaan evaluasi di sini..."
                    />
                  </div>

                  {/* Choices */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-[#4A5568]">
                        Pilihan Jawaban (Tandai jawaban yang benar) <span className="text-red-500">*</span>
                      </label>
                      <button
                        onClick={() => addChoice(0, qIdx)}
                        type="button"
                        className="text-xs font-bold text-[#00695C] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
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
                          <input
                            type="radio"
                            name={`correct_post_${qIdx}`}
                            checked={choice.isCorrect}
                            onChange={() => setCorrectChoice(0, qIdx, choiceIdx)}
                            className="w-4 h-4 accent-emerald-600 cursor-pointer"
                          />
                          <input
                            value={choice.optionText}
                            onChange={(e) => handleChoiceChange(0, qIdx, choiceIdx, e.target.value)}
                            className="flex-1 text-xs text-[#1A202C] bg-transparent outline-none font-semibold"
                            placeholder={`Pilihan ${String.fromCharCode(65 + choiceIdx)}...`}
                          />
                          {choice.isCorrect && (
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
                              <span className="material-symbols-outlined text-sm">close</span>
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
                      onChange={(e) => handleQuestionChange(0, qIdx, "explanation", e.target.value)}
                      className="w-full h-11 rounded-xl border border-[#E2E8F0] bg-white px-4 text-xs text-[#1A202C] focus:ring-1 focus:ring-[#00695C] outline-none"
                      placeholder="Penjelasan mengapa jawaban tersebut benar..."
                    />
                  </div>
                </div>
              ))}

              {/* Add Question Button */}
              <button
                onClick={() => addQuestion(0)}
                type="button"
                className="w-full py-4 rounded-xl border-2 border-dashed border-[#00695C] text-[#00695C] text-sm font-bold hover:bg-[#F0F9F8] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                <span>Tambah Soal Post-Test Baru</span>
              </button>
            </div>
          </section>
        ) : (
          /* PRE-TEST: Sequential Questions Builder (DMSES Likert Scale - No Categories & No Choices) */
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#1A202C] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00695C] text-xl select-none">psychology</span>
                  <span>Daftar Pertanyaan Pre-Test (DMSES)</span>
                </h3>
                <p className="text-xs text-[#718096] mt-1">
                  Kuesioner Efikasi Diri (Keyakinan Diri Pasien). Pilihan jawaban 1–5 disediakan otomatis oleh sistem.
                </p>
              </div>
              <span className="text-xs font-extrabold text-[#00695C] bg-[#F0F9F8] px-3 py-1.5 rounded-full border border-[#00695C]/20 self-start sm:self-auto">
                Total {(fields.categories[0]?.questions || []).length} Pertanyaan
              </span>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {(fields.categories[0]?.questions || []).map((question, qIdx) => (
                <div
                  key={`pre_q_${qIdx}`}
                  className="bg-slate-50/50 rounded-2xl border border-[#E2E8F0] p-6 space-y-4 hover:border-[#00695C]/30 transition-all"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#E2E8F0]/80 pb-3">
                    <span className="text-xs font-bold text-[#00695C] bg-[#E6F2F1] px-3 py-1 rounded-lg">
                      Pertanyaan #{qIdx + 1}
                    </span>
                    {(fields.categories[0]?.questions.length || 0) > 1 && (
                      <button
                        onClick={() => deleteQuestion(0, qIdx)}
                        type="button"
                        className="px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-red-200"
                      >
                        <span className="material-symbols-outlined text-base select-none">delete</span>
                        <span>Hapus Pertanyaan</span>
                      </button>
                    )}
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-xs font-bold text-[#4A5568] mb-1.5">
                      Teks Pertanyaan DMSES <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={question.questionText}
                      onChange={(e) => handleQuestionChange(0, qIdx, "questionText", e.target.value)}
                      rows={2}
                      className="w-full rounded-xl border border-[#E2E8F0] bg-white p-3.5 text-sm text-[#1A202C] focus:ring-1 focus:ring-[#00695C] outline-none"
                      placeholder="misal: Seberapa yakin Anda dapat mengontrol kadar gula darah saat beraktivitas?"
                    />
                  </div>

                  {/* Question Image Upload (Optional) */}
                  <QuestionImageUploader
                    imageUrl={question.questionImageUrl}
                    onChange={(url) => {
                      const updatedCats = [...fields.categories];
                      const cat = updatedCats[0];
                      if (cat) {
                        const updatedQuestions = [...cat.questions];
                        updatedQuestions[qIdx] = { ...updatedQuestions[qIdx], questionImageUrl: url };
                        updatedCats[0] = { ...cat, questions: updatedQuestions };
                        handleChange("categories", updatedCats);
                      }
                    }}
                  />

                  {/* Likert Scale Auto Preview */}
                  <div className="bg-[#F0F9F8] border border-[#00695C]/20 rounded-xl p-4 space-y-2">
                    <span className="text-[11px] font-bold text-[#00695C] uppercase tracking-wider block">
                      Skala Respon Dihasilkan Otomatis oleh Sistem:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-semibold text-[#1A202C]">
                      <div className="bg-white p-2 rounded-lg border border-teal-100 shadow-2xs">
                        <span className="block text-base">😟</span>
                        <span className="text-[10px] text-[#718096]">1. Tidak Yakin</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-teal-100 shadow-2xs">
                        <span className="block text-base">🙁</span>
                        <span className="text-[10px] text-[#718096]">2. Kurang Yakin</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-teal-100 shadow-2xs">
                        <span className="block text-base">😐</span>
                        <span className="text-[10px] text-[#718096]">3. Cukup Yakin</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-teal-100 shadow-2xs">
                        <span className="block text-base">🙂</span>
                        <span className="text-[10px] text-[#718096]">4. Yakin</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-teal-100 shadow-2xs">
                        <span className="block text-base">😊</span>
                        <span className="text-[10px] text-[#718096]">5. Sangat Yakin</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Question Button */}
              <button
                onClick={() => addQuestion(0)}
                type="button"
                className="w-full py-4 rounded-xl border-2 border-dashed border-[#00695C] text-[#00695C] text-sm font-bold hover:bg-[#F0F9F8] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                <span>Tambah Pertanyaan Pre-Test Baru</span>
              </button>
            </div>
          </section>
        )}
      </form>

      {/* Confirmation Modal for Category Deletion */}
      <ConfirmationModal
        open={categoryToDeleteIndex !== null}
        title="Hapus Kategori Pembelajaran?"
        description={`Apakah Anda yakin ingin menghapus Bagian Kategori "${fields.categories[categoryToDeleteIndex ?? 0]?.title || 'Kategori'}" beserta seluruh soal di dalamnya?`}
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
