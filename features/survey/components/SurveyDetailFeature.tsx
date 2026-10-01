"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { surveyService } from "@/services/surveyService";
import type { SurveyDetail } from "@/types/survey";
import { BackButton } from "@/components/common/BackButton";
import { useToast } from "@/components/ui/Toast";
import { DetailPageLoader } from "@/components/ui/loading/DetailPageLoader";

interface SurveyDetailFeatureProps {
  surveyId: string;
  isStaff?: boolean;
}

export function SurveyDetailFeature({ surveyId, isStaff = false }: SurveyDetailFeatureProps) {
  const { showToast } = useToast();
  const [survey, setSurvey] = useState<SurveyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    surveyService
      .getSurveyById(surveyId, isStaff)
      .then(setSurvey)
      .catch(() => {
        showToast({
          type: "error",
          title: "Gagal Memuat",
          description: "Gagal mengambil detail survey.",
        });
      })
      .finally(() => setIsLoading(false));
  }, [surveyId, isStaff, showToast]);

  if (isLoading) {
    return (
      <div className="max-w-[1600px] w-full mx-auto py-6">
        <DetailPageLoader type="education" />
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="p-12 text-center text-red-600 bg-white rounded-2xl border border-red-200 max-w-[1600px] w-full mx-auto">
        Survey tidak ditemukan
      </div>
    );
  }

  const isSUS = survey.type === "SUS";
  const basePath = isStaff ? "/staff/survey" : "/admin/survey";

  return (
    <div className="space-y-8 max-w-[1600px] w-full mx-auto pb-16 font-[family-name:var(--font-poppins)]">
      {/* Back button */}
      <div>
        <BackButton href={basePath} label="Daftar Survey Penelitian" />
      </div>

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                isSUS
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              {isSUS ? "System Usability Scale (SUS)" : "Kepuasan Pengguna"}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase border ${
                survey.status === "published" || survey.is_active
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {survey.status === "published" || survey.is_active ? "Aktif" : "Draft"}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[#1A202C]">{survey.title}</h1>
          <p className="text-sm text-[#718096] mt-1">
            {survey.description || "Tidak ada deskripsi"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`${basePath}/${survey.id}/analytics?from=detail`}
            className="px-4 py-2.5 bg-[#00695C] hover:bg-[#004D40] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-base">analytics</span>
            Analitik & Respons
          </Link>

          {!isStaff && (
            <Link
              href={`/admin/survey/${survey.id}/edit?from=detail`}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              Edit Survey
            </Link>
          )}
        </div>
      </div>

      {/* Question List Details */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-[#1A202C]">
          Daftar Pertanyaan ({survey.questions.length})
        </h2>

        <div className="space-y-4">
          {survey.questions.map((q, idx) => (
            <div key={q.id} className="p-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-sm text-[#1A202C]">
                  {idx + 1}. {q.question_text}
                </h4>
                {q.is_required && (
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    Wajib
                  </span>
                )}
              </div>
              {q.description && <p className="text-xs text-[#718096]">{q.description}</p>}

              <div className="pt-2 flex flex-wrap gap-2">
                {q.likert_labels.map((lbl, lIdx) => (
                  <span
                    key={lIdx}
                    className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#4A5568]"
                  >
                    <strong className="text-[#00695C] mr-1">{lIdx + 1}:</strong> {lbl}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
