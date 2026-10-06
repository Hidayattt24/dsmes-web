"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useEducationDetail } from "../hooks/useEducationDetail";
import { educationService } from "../services/educationService";
import type { EducationArticle } from "../types/education";
import { ErrorState } from "@/components/common/ErrorState";
import { BackButton } from "@/components/common/BackButton";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useToast } from "@/components/ui/Toast";

import { DetailPageLoader } from "@/components/ui/loading";

interface EducationDetailFeatureProps {
  readonly articleId: string;
}

export function EducationDetailFeature({ articleId }: EducationDetailFeatureProps) {
  const pathname = usePathname();
  const isStaff = pathname.startsWith("/staff");
  const rolePrefix = isStaff ? "staff" : "admin";

  const {
    article,
    isLoading,
    isDeleting,
    error,
    deleteArticle,
    refetch,
    goBack,
    goToEdit,
  } = useEducationDetail(articleId);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { showToast } = useToast();

  const [relatedArticles, setRelatedArticles] = useState<EducationArticle[]>([]);

  useEffect(() => {
    educationService
      .getArticles(rolePrefix)
      .then((list) => {
        const filtered = list.filter((art) => art.id !== articleId).slice(0, 3);
        setRelatedArticles(filtered);
      })
      .catch(() => {});
  }, [articleId, rolePrefix]);

  const handleConfirmDelete = async () => {
    if (isStaff) return;
    showToast({
      type: "success",
      title: "Berhasil",
      description: "Materi edukasi berhasil dihapus.",
    });
    await deleteArticle();
    setIsDeleteOpen(false);
  };

  if (isLoading) {
    return <DetailPageLoader type="education" />;
  }

  if (error || !article) {
    return <ErrorState message={error ?? "Artikel tidak ditemukan."} onRetry={refetch} />;
  }

  const fallbackCover =
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop";

  return (
    <section className="max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)] p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Scope CSS rules to style rich-text content rendered from editor & match user POV */}
      <style>{`
        .article-reader-container .editor-only-overlay,
        .article-reader-container .editor-actions {
          display: none !important;
        }
        .article-reader-container h2 {
          font-size: 1.35rem;
          font-weight: 700;
          color: #0F172A;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          line-height: 1.35;
        }
        .article-reader-container h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1E293B;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        .article-reader-container h4 {
          font-size: 1rem;
          font-weight: 700;
          color: #1E293B;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .article-reader-container p {
          font-size: 0.975rem;
          color: #334155;
          line-height: 1.8;
          margin-bottom: 1.15rem;
        }
        .article-reader-container ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
          color: #334155;
        }
        .article-reader-container ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
          color: #334155;
        }
        .article-reader-container li {
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 0.4rem;
        }
        .article-reader-container blockquote,
        .article-reader-container .bg-teal-50 {
          background-color: #F0F9F8 !important;
          border-left: 4px solid #00695C !important;
          padding: 1.15rem 1.35rem !important;
          margin: 1.5rem 0 !important;
          border-radius: 0 0.85rem 0.85rem 0 !important;
          color: #00695C !important;
          font-weight: 500 !important;
        }
        .article-reader-container img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 1rem !important;
          margin: 1.5rem auto !important;
          display: block !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
          border: 1px solid #E2E8F0 !important;
        }
      `}</style>

      {/* Breadcrumbs & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <BackButton
            href={isStaff ? ROUTES.STAFF_MANAJEMEN_EDUKASI : ROUTES.MANAJEMEN_EDUKASI}
            label="Manajemen Edukasi"
          />
        </div>
        {!isStaff && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Edit */}
            <button
              onClick={goToEdit}
              className="flex-1 sm:flex-initial justify-center bg-white border border-[#E2E8F0] text-[#1A202C] px-5 sm:px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#F4F6F8] active:scale-95 transition-all text-sm font-semibold shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
              <span>Edit Artikel</span>
            </button>
            {/* Delete */}
            <button
              onClick={() => setIsDeleteOpen(true)}
              disabled={isDeleting}
              className="flex-1 sm:flex-initial justify-center bg-[#FFF5F5] text-[#C53030] px-5 sm:px-6 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all text-sm font-semibold border border-red-100 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
              <span>Hapus</span>
            </button>
          </div>
        )}
      </div>

      {/* 12-Column Responsive Grid */}
      <div className="grid grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Main Content Area: 9 Columns (~75%) */}
        <div className="col-span-12 lg:col-span-9 space-y-6 sm:space-y-8">
          {/* Article Card Container */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-8 lg:p-10 shadow-sm space-y-6 sm:space-y-8">
            {/* Hero Cover Image */}
            <div className="relative aspect-[16/9] w-full max-h-[420px] rounded-2xl overflow-hidden group border border-[#E2E8F0] bg-slate-100 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.thumbnail || fallbackCover}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Title & Metadata Header */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3.5 py-1 bg-[#E6F4F1] text-[#00695C] text-xs font-bold rounded-full uppercase tracking-wider font-[family-name:var(--font-poppins)] inline-flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">folder_open</span>
                  <span>{article.category}</span>
                </span>
                <span
                  className={[
                    "px-3.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider inline-flex items-center gap-1.5",
                    article.status === "Diterbitkan"
                      ? "bg-[#F0FDF4] text-[#15803D] border border-green-200"
                      : "bg-[#F8FAFC] text-[#64748B] border border-slate-200",
                  ].join(" ")}
                >
                  <span className="material-symbols-outlined text-sm">
                    {article.status === "Diterbitkan" ? "check_circle" : "edit_note"}
                  </span>
                  <span>{article.status === "Diterbitkan" ? "Terbit" : "Draf"}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] leading-tight font-[family-name:var(--font-poppins)] tracking-tight">
                {article.title}
              </h1>

              {/* Metadata Row */}
              <div className="flex items-center flex-wrap gap-4 sm:gap-6 py-4 border-y border-[#E2E8F0]/80 text-[#64748B] text-xs sm:text-sm font-[family-name:var(--font-poppins)] font-medium">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00695C] text-[18px]">account_circle</span>
                  <span>{article.createdBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00695C] text-[18px]">calendar_today</span>
                  <span>{article.createdAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00695C] text-[18px]">schedule</span>
                  <span>{article.duration} Menit Baca</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00695C] text-[18px]">visibility</span>
                  <span>{article.readCount.toLocaleString("id-ID")} Dilihat</span>
                </div>
              </div>
            </div>

            {/* Short Description Summary (If available) */}
            {article.shortDescription && (
              <div className="bg-[#F8FAFC] border-l-4 border-[#00695C] p-4 sm:p-5 rounded-r-xl text-sm sm:text-base text-[#334155] italic leading-relaxed font-[family-name:var(--font-poppins)]">
                {article.shortDescription}
              </div>
            )}

            {/* Article Content Reader Body */}
            <article className="article-reader-container text-[#1E293B] font-[family-name:var(--font-poppins)]">
              <div
                className="text-base text-[#334155] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </article>
          </div>

          {/* Footer Status Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 sm:py-6 border-t border-[#E2E8F0]/60">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-[#64748B] hover:text-[#00695C] transition-all font-semibold text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span>Kembali ke Daftar Manajemen</span>
            </button>
            <div className="flex gap-2.5 items-center text-[#64748B] text-xs font-medium">
              <div className="w-2 h-2 rounded-full bg-[#00695C] animate-pulse"></div>
              <span>
                Terakhir diedit oleh <b className="text-[#0F172A]">{article.createdBy}</b> pada{" "}
                <b className="text-[#00695C]">{article.updatedAt}</b>
              </span>
            </div>
          </div>
        </div>

        {/* Right Sidebar: 3 Columns (~25%) */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Status Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-5 font-[family-name:var(--font-poppins)] flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#00695C]">info</span>
              <span>Status Artikel</span>
            </h4>
            <div className="space-y-3.5 font-[family-name:var(--font-poppins)] text-xs sm:text-sm">
              <div className="flex justify-between items-center py-2 border-b border-[#E2E8F0]/60">
                <span className="text-[#64748B] font-medium">Status</span>
                <span
                  className={[
                    "text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wide",
                    article.status === "Diterbitkan"
                      ? "bg-[#F0FDF4] text-[#15803D] border border-green-200"
                      : "bg-[#F8FAFC] text-[#64748B] border border-slate-200",
                  ].join(" ")}
                >
                  {article.status === "Diterbitkan" ? "Terbit" : "Draf"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#E2E8F0]/60">
                <span className="text-[#64748B] font-medium">Visibilitas</span>
                <span className="text-[#0F172A] font-semibold">Publik (Pasien)</span>
              </div>
              <div className="flex justify-between items-start py-2 border-b border-[#E2E8F0]/60">
                <span className="text-[#64748B] font-medium">Kategori</span>
                <span className="text-[#00695C] font-bold text-right max-w-[140px] truncate bg-[#E6F4F1] px-2.5 py-0.5 rounded-md text-xs">
                  {article.category}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#E2E8F0]/60">
                <span className="text-[#64748B] font-medium">Penulis / Admin</span>
                <span className="text-[#0F172A] font-semibold truncate max-w-[130px]" title={article.createdBy}>
                  {article.createdBy}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#E2E8F0]/60">
                <span className="text-[#64748B] font-medium">Tanggal Dibuat</span>
                <span className="text-[#0F172A] font-medium">{article.createdAt}</span>
              </div>
              <div className="flex justify-between items-start py-2">
                <span className="text-[#64748B] font-medium">Update Terakhir</span>
                <span className="text-[#00695C] font-bold text-right text-xs max-w-[150px] leading-tight">
                  {article.updatedAt}
                </span>
              </div>
            </div>
          </div>

          {/* Related Articles Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-5 font-[family-name:var(--font-poppins)] flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#00695C]">auto_stories</span>
              <span>Artikel Terkait</span>
            </h4>
            <div className="space-y-4 font-[family-name:var(--font-poppins)]">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={isStaff ? `/staff/manajemen-edukasi/${rel.id}` : `${ROUTES.MANAJEMEN_EDUKASI}/${rel.id}`}
                  className="flex gap-3.5 p-2 rounded-xl hover:bg-[#F8FAFC] transition-all group border border-transparent hover:border-[#E2E8F0]"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-[#E2E8F0] bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rel.thumbnail || fallbackCover}
                      alt={rel.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h5 className="text-xs font-bold text-[#0F172A] leading-snug group-hover:text-[#00695C] transition-colors line-clamp-2">
                      {rel.title}
                    </h5>
                    <p className="text-[11px] text-[#64748B] mt-1 font-medium">
                      {rel.duration} Min • {rel.category}
                    </p>
                  </div>
                </Link>
              ))}
              {relatedArticles.length === 0 && (
                <p className="text-xs text-[#64748B] text-center py-4 italic">Belum ada artikel terkait lainnya.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {!isStaff && (
        <ConfirmationModal
          open={isDeleteOpen}
          title="Hapus Materi Edukasi?"
          description="Materi yang dihapus tidak dapat dikembalikan."
          variant="danger"
          confirmText="Ya, Hapus"
          cancelText="Batal"
          loading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteOpen(false)}
        />
      )}
    </section>
  );
}
