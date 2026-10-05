"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { surveyService } from "@/services/surveyService";
import type { QuestionRequest, SurveyType } from "@/types/survey";
import { BackButton } from "@/components/common/BackButton";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { FormSkeleton } from "@/components/ui/loading/FormSkeleton";

interface SurveyFormFeatureProps {
  surveyId?: string;
}

const DEFAULT_LIKERT_SATISFACTION = [
  "Sangat Tidak Setuju",
  "Tidak Setuju",
  "Netral",
  "Setuju",
  "Sangat Setuju",
];

const STANDARD_SUS_QUESTIONS: QuestionRequest[] = [
  {
    question_text: "Saya berpikir akan menggunakan sistem ini lagi secara sering.",
    description: "Pertanyaan #1 (Ganjil - Nilai Positif)",
    likert_labels: DEFAULT_LIKERT_SATISFACTION,
    is_required: true,
    display_order: 1,
  },
  {
    question_text: "Saya merasa sistem ini rumit untuk digunakan.",
    description: "Pertanyaan #2 (Genap - Nilai Negatif)",
    likert_labels: DEFAULT_LIKERT_SATISFACTION,
    is_required: true,
    display_order: 2,
  },
  {
    question_text: "Saya merasa sistem ini mudah digunakan.",
    description: "Pertanyaan #3 (Ganjil - Nilai Positif)",
    likert_labels: DEFAULT_LIKERT_SATISFACTION,
    is_required: true,
    display_order: 3,
  },
  {
    question_text: "Saya pikir saya membutuhkan bantuan dari orang teknis untuk dapat menggunakan sistem ini.",
    description: "Pertanyaan #4 (Genap - Nilai Negatif)",
    likert_labels: DEFAULT_LIKERT_SATISFACTION,
    is_required: true,
    display_order: 4,
  },
  {
    question_text: "Saya menemukan berbagai fungsi dalam sistem ini terintegrasi dengan baik.",
    description: "Pertanyaan #5 (Ganjil - Nilai Positif)",
    likert_labels: DEFAULT_LIKERT_SATISFACTION,
    is_required: true,
    display_order: 5,
  },
  {
    question_text: "Saya pikir ada terlalu banyak ketidaksesuaian dalam sistem ini.",
    description: "Pertanyaan #6 (Genap - Nilai Negatif)",
    likert_labels: DEFAULT_LIKERT_SATISFACTION,
    is_required: true,
    display_order: 6,
  },
  {
    question_text: "Saya membayangkan bahwa sebagian besar orang akan belajar menggunakan sistem ini dengan sangat cepat.",
    description: "Pertanyaan #7 (Ganjil - Nilai Positif)",
    likert_labels: DEFAULT_LIKERT_SATISFACTION,
    is_required: true,
    display_order: 7,
  },
  {
    question_text: "Saya merasa sistem ini sangat janggal saat digunakan.",
    description: "Pertanyaan #8 (Genap - Nilai Negatif)",
    likert_labels: DEFAULT_LIKERT_SATISFACTION,
    is_required: true,
    display_order: 8,
  },
  {
    question_text: "Saya merasa sangat percaya diri menggunakan sistem ini.",
    description: "Pertanyaan #9 (Ganjil - Nilai Positif)",
    likert_labels: DEFAULT_LIKERT_SATISFACTION,
    is_required: true,
    display_order: 9,
  },
  {
    question_text: "Saya perlu mempelajari banyak hal sebelum saya bisa mulai menggunakan sistem ini.",
    description: "Pertanyaan #10 (Genap - Nilai Negatif)",
    likert_labels: DEFAULT_LIKERT_SATISFACTION,
    is_required: true,
    display_order: 10,
  },
];

const instrumentTypeOptions = [
  {
    value: "USER_SATISFACTION",
    label: "Kepuasan Pengguna (Skala Likert Kustom)",
    icon: "sentiment_satisfied",
  },
  {
    value: "SUS",
    label: "System Usability Scale (SUS - 10 Pertanyaan Standar)",
    icon: "analytics",
  },
] as const;

export function SurveyFormFeature({ surveyId }: SurveyFormFeatureProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromDetail = searchParams.get("from") === "detail";
  const backHref = fromDetail && surveyId ? `/admin/survey/${surveyId}` : "/admin/survey";
  const backLabel = fromDetail && surveyId ? "Kembali ke Detail Survei" : "Manajemen Survey";

  const isEdit = Boolean(surveyId);
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<SurveyType>("USER_SATISFACTION");
  const [questions, setQuestions] = useState<QuestionRequest[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmTypeChange, setShowConfirmTypeChange] = useState(false);
  const [pendingType, setPendingType] = useState<SurveyType | null>(null);

  useEffect(() => {
    if (isEdit && surveyId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true);
      surveyService
        .getSurveyById(surveyId)
        .then((detail) => {
          setTitle(detail.title);
          setDescription(detail.description || "");
          setType(detail.type);
          setQuestions(
            detail.questions.map((q) => ({
              id: q.id,
              question_text: q.question_text,
              description: q.description || "",
              image_url: q.image_url || undefined,
              svg_illustration: q.svg_illustration || undefined,
              likert_labels: q.likert_labels || DEFAULT_LIKERT_SATISFACTION,
              is_required: q.is_required,
              display_order: q.display_order,
            }))
          );
        })
        .catch(() => {
          showToast({
            type: "error",
            title: "Gagal Memuat",
            description: "Gagal mengambil data detail survey.",
          });
        })
        .finally(() => setIsLoading(false));
    } else {
      // Default: Kepuasan Pengguna with 1 question
      setQuestions([
        {
          question_text: "",
          description: "",
          likert_labels: DEFAULT_LIKERT_SATISFACTION,
          is_required: true,
          display_order: 1,
        },
      ]);
    }
  }, [surveyId, isEdit, showToast]);

  const handleTypeSelect = (newType: string) => {
    const selected = newType as SurveyType;
    if (selected === type) return;

    if (questions.some((q) => q.question_text.trim() !== "")) {
      setPendingType(selected);
      setShowConfirmTypeChange(true);
    } else {
      applyTypeChange(selected);
    }
  };

  const applyTypeChange = (targetType: SurveyType) => {
    setType(targetType);
    if (targetType === "SUS") {
      setQuestions(STANDARD_SUS_QUESTIONS);
      showToast({
        type: "info",
        title: "Instrumen SUS Terpilih",
        description: "10 pertanyaan standar System Usability Scale otomatis dimuat.",
      });
    } else {
      setQuestions([
        {
          question_text: "",
          description: "",
          likert_labels: DEFAULT_LIKERT_SATISFACTION,
          is_required: true,
          display_order: 1,
        },
      ]);
    }
  };

  const handleLoadStandardSUS = () => {
    setQuestions(STANDARD_SUS_QUESTIONS);
    showToast({
      type: "success",
      title: "10 Pertanyaan SUS Dimuat",
      description: "Daftar pertanyaan telah diisi dengan item standar SUS.",
    });
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question_text: "",
        description: "",
        likert_labels: DEFAULT_LIKERT_SATISFACTION,
        is_required: true,
        display_order: prev.length + 1,
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) {
      showToast({
        type: "warning",
        title: "Perhatian",
        description: "Survei harus memiliki minimal 1 pertanyaan.",
      });
      return;
    }
    setQuestions((prev) =>
      prev.filter((_, i) => i !== index).map((q, idx) => ({ ...q, display_order: idx + 1 }))
    );
  };

  const handleMoveQuestion = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === questions.length - 1)
    ) {
      return;
    }
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const newQs = [...questions];
    const temp = newQs[index];
    newQs[index] = newQs[targetIdx];
    newQs[targetIdx] = temp;
    setQuestions(newQs.map((q, idx) => ({ ...q, display_order: idx + 1 })));
  };

  const handleQuestionChange = (index: number, field: keyof QuestionRequest, value: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleLabelChange = (qIndex: number, labelIndex: number, text: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const labels = [...(updated[qIndex].likert_labels || DEFAULT_LIKERT_SATISFACTION)];
      labels[labelIndex] = text;
      updated[qIndex] = { ...updated[qIndex], likert_labels: labels };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast({
        type: "error",
        title: "Form Belum Lengkap",
        description: "Judul survei wajib diisi.",
      });
      return;
    }
    if (questions.some((q) => !q.question_text.trim())) {
      showToast({
        type: "error",
        title: "Pertanyaan Kosong",
        description: "Semua item pertanyaan wajib memiliki teks pertanyaan.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        type,
        questions: questions.map((q, idx) => ({
          ...q,
          display_order: idx + 1,
        })),
      };

      if (isEdit && surveyId) {
        await surveyService.updateSurvey(surveyId, payload);
        showToast({
          type: "success",
          title: "Berhasil",
          description: "Survey berhasil diperbarui.",
        });
      } else {
        await surveyService.createSurvey(payload);
        showToast({
          type: "success",
          title: "Berhasil",
          description: "Survey penelitian baru berhasil dibuat.",
        });
      }
      router.push("/admin/survey");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast({
        type: "error",
        title: "Gagal Menyimpan",
        description: error.response?.data?.message || "Terjadi kesalahan saat menyimpan survey.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1600px] w-full mx-auto py-6">
        <FormSkeleton />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-[1600px] w-full mx-auto pb-16 font-[family-name:var(--font-poppins)]">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <BackButton href={backHref} label={backLabel} />
          <h1 className="text-2xl font-bold text-[#1A202C] tracking-tight mt-2">
            {isEdit ? "Edit Survey Penelitian" : "Buat Survey Penelitian Baru"}
          </h1>
          <p className="text-sm text-[#718096] mt-1">
            Konfigurasi instrumen evaluasi Kepuasan Pengguna atau System Usability Scale (SUS)
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] font-semibold text-sm rounded-xl transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-[#00695C] hover:bg-[#004D40] text-white font-bold text-sm rounded-xl shadow-md shadow-[#00695C]/15 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            <span>{isSaving ? "Menyimpan..." : "Simpan Survey"}</span>
          </button>
        </div>
      </div>

      {/* General Settings Section */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#EDF2F7] pb-4">
          <h2 className="text-lg font-bold text-[#1A202C] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00695C]">settings</span>
            Informasi Umum Survey
          </h2>
          <span className="text-xs text-[#718096]">(*) Wajib diisi</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-2">
              Judul Survey <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Evaluasi Kepuasan & Kebisaan Penggunaan Aplikasi DIBA Aceh"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#1A202C] focus:outline-none focus:border-[#00695C] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-2">
              Deskripsi / Petunjuk Pengisian (Opsional)
            </label>
            <textarea
              rows={3}
              placeholder="Petunjuk singkat bagi responden sebelum mulai mengisi pertanyaan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#1A202C] focus:outline-none focus:border-[#00695C] transition-all"
            />
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-2">
              Tipe Instrumen <span className="text-red-500">*</span>
            </label>
            <Select
              value={type}
              options={instrumentTypeOptions}
              onChange={handleTypeSelect}
              placeholder="Pilih Tipe Instrumen"
            />
          </div>
        </div>
      </div>

      {/* Instrument-Specific Information Banner */}
      {type === "SUS" ? (
        <div className="bg-[#EBF8FF] border border-[#BEE3F8] p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#2B6CB0] text-2xl mt-0.5">
              analytics
            </span>
            <div>
              <h4 className="font-bold text-sm text-[#2C5282]">
                Instrumen Standar System Usability Scale (SUS)
              </h4>
              <p className="text-xs text-[#2B6CB0] mt-1 leading-relaxed">
                SUS terdiri dari 10 pertanyaan standar dengan opsi Likert 1-5. Sistem akan
                mengakumulasi skor secara otomatis dengan formula Bangor & Sauro (skala 0-100)
                dan menentukan kelulusan (*Pass/Fail* threshold 68).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLoadStandardSUS}
            className="px-4 py-2.5 bg-[#2B6CB0] hover:bg-[#2C5282] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            Muat 10 Soal SUS Standar
          </button>
        </div>
      ) : (
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-5 rounded-2xl flex items-start gap-3">
          <span className="material-symbols-outlined text-[#166534] text-2xl mt-0.5">
            sentiment_satisfied
          </span>
          <div>
            <h4 className="font-bold text-sm text-[#14532D]">
              Instrumen Kepuasan Pengguna
            </h4>
            <p className="text-xs text-[#166534] mt-1 leading-relaxed">
              Anda dapat menambah, mengubah, atau menghapus item pertanyaan secara bebas serta
              mengustomisasi teks label skala Likert (opsi 1 sampai 5) sesuai kebutuhan survei.
            </p>
          </div>
        </div>
      )}

      {/* Questions Section Header */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <h2 className="text-lg font-bold text-[#1A202C]">
            Daftar Pertanyaan ({questions.length})
          </h2>
          <p className="text-xs text-[#718096] mt-0.5">
            {type === "SUS"
              ? "10 pertanyaan baku System Usability Scale"
              : "Pertanyaan yang akan ditampilkan kepada responden"}
          </p>
        </div>

        {type === "USER_SATISFACTION" && (
          <button
            type="button"
            onClick={handleAddQuestion}
            className="px-4 py-2.5 bg-[#E6FFFA] text-[#00695C] hover:bg-[#B2F5EA] font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-[#00695C]/20"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            Tambah Pertanyaan
          </button>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIdx) => (
          <div
            key={qIdx}
            className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4 relative hover:border-[#00695C]/40 transition-all"
          >
            <div className="flex justify-between items-center border-b border-[#EDF2F7] pb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#00695C] bg-[#E6FFFA] px-3 py-1 rounded-lg border border-[#00695C]/15">
                  Pertanyaan #{qIdx + 1}
                </span>
                {type === "SUS" && (
                  <span className="text-[11px] font-semibold text-[#718096]">
                    {qIdx % 2 === 0 ? "Opsi Ganjil (Skor - 1)" : "Opsi Genap (5 - Skor)"}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {type === "USER_SATISFACTION" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleMoveQuestion(qIdx, "up")}
                      disabled={qIdx === 0}
                      className="p-1.5 text-gray-500 hover:text-black disabled:opacity-30 rounded-lg hover:bg-gray-100"
                      title="Naikkan Urutan"
                    >
                      <span className="material-symbols-outlined text-lg">arrow_upward</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveQuestion(qIdx, "down")}
                      disabled={qIdx === questions.length - 1}
                      className="p-1.5 text-gray-500 hover:text-black disabled:opacity-30 rounded-lg hover:bg-gray-100"
                      title="Turunkan Urutan"
                    >
                      <span className="material-symbols-outlined text-lg">arrow_downward</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="p-1.5 text-red-500 hover:text-red-700 ml-1 rounded-lg hover:bg-red-50"
                      title="Hapus Pertanyaan"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1">
                Teks Pertanyaan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Masukkan kalimat pertanyaan..."
                value={q.question_text}
                onChange={(e) => handleQuestionChange(qIdx, "question_text", e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#1A202C] focus:outline-none focus:border-[#00695C]"
              />
            </div>

            {/* Additional Description */}
            <div>
              <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1">
                Keterangan Tambahan / Sub-Judul (Opsional)
              </label>
              <input
                type="text"
                placeholder="Penjelasan konteks atau petunjuk khusus untuk item ini..."
                value={q.description || ""}
                onChange={(e) => handleQuestionChange(qIdx, "description", e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#1A202C] focus:outline-none focus:border-[#00695C]"
              />
            </div>

            {/* Likert Scale Labels */}
            <div>
              <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-2">
                Label Skala Likert (Option 1 s/d 5)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {[0, 1, 2, 3, 4].map((lblIdx) => (
                  <div key={lblIdx} className="bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
                    <span className="text-[10px] font-bold text-[#00695C] uppercase block mb-1">
                      Skor {lblIdx + 1}
                    </span>
                    <input
                      type="text"
                      disabled={type === "SUS"}
                      value={(q.likert_labels || DEFAULT_LIKERT_SATISFACTION)[lblIdx] || ""}
                      onChange={(e) => handleLabelChange(qIdx, lblIdx, e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#1A202C] focus:outline-none focus:border-[#00695C] disabled:bg-gray-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Instrument Type Change Modal */}
      <ConfirmationModal
        open={showConfirmTypeChange}
        title="Ubah Tipe Instrumen?"
        description="Mengubah tipe instrumen akan mereset pertanyaan yang telah Anda tulis. Apakah Anda yakin ingin melanjutkan?"
        variant="warning"
        confirmText="Ubah Tipe"
        cancelText="Batal"
        onConfirm={() => {
          if (pendingType) applyTypeChange(pendingType);
          setShowConfirmTypeChange(false);
          setPendingType(null);
        }}
        onCancel={() => {
          setShowConfirmTypeChange(false);
          setPendingType(null);
        }}
      />
    </form>
  );
}
