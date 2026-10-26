"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { educationService } from "../services/educationService";
import { ROUTES } from "@/constants/routes";
import { useToast } from "@/components/ui/Toast";

export interface FormFields {
  readonly title: string;
  readonly category: string;
  readonly createdBy: string;
  readonly shortDescription: string;
  readonly content: string;
  readonly youtubeLink: string;
  readonly duration: number;
  readonly status: "Diterbitkan" | "Draf";
  readonly thumbnail: string;
}

export function useEducationForm(articleId?: string) {
  const router = useRouter();
  const { showToast } = useToast();
  const [fields, setFields] = useState<FormFields>({
    title: "",
    category: "Nutrisi & Makanan",
    createdBy: "Tim Medis DIBA",
    shortDescription: "",
    content: "",
    youtubeLink: "",
    duration: 5,
    status: "Draf",
    thumbnail: "",
  });

  const [isLoading, setIsLoading] = useState(Boolean(articleId));
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadedArticleId, setLoadedArticleId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});

  useEffect(() => {
    if (!articleId) return;

    let cancelled = false;

    const loadArticle = async () => {
      setIsLoading(true);
      setLoadError(null);
      setLoadedArticleId(null);
      try {
        const art = await educationService.getArticleById(articleId);
        if (cancelled) return;
        if (!art) {
          setLoadError("Materi edukasi tidak ditemukan.");
          return;
        }
        setFields({
          title: art.title,
          category: art.category,
          createdBy: art.createdBy || "Tim Medis DIBA",
          shortDescription: art.shortDescription,
          content: art.content,
          youtubeLink: art.youtubeLink ?? "",
          duration: art.duration,
          status: art.status,
          thumbnail: art.thumbnail,
        });
        setLoadedArticleId(articleId);
      } catch (error: unknown) {
        if (cancelled) return;
        const err = error as { response?: { status?: number } };
        setLoadError(
          err.response?.status === 404
            ? "Materi edukasi tidak ditemukan."
            : err.response?.status === 401 || err.response?.status === 403
              ? "Anda tidak memiliki akses ke materi edukasi ini."
              : "Data edukasi gagal dimuat. Silakan coba lagi."
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadArticle();

    return () => {
      cancelled = true;
    };
  }, [articleId]);

  const handleChange = (key: keyof FormFields, val: string | number) => {
    setFields((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (targetFields: FormFields): boolean => {
    const newErrors: Partial<Record<keyof FormFields, string>> = {};
    if (!targetFields.title.trim()) newErrors.title = "Judul edukasi wajib diisi.";
    if (!targetFields.shortDescription.trim())
      newErrors.shortDescription = "Ringkasan singkat wajib diisi.";
    if (!targetFields.content.trim()) newErrors.content = "Konten edukasi wajib diisi.";
    if (targetFields.duration <= 0) newErrors.duration = "Durasi membaca harus lebih dari 0 menit.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      showToast({
        type: "error",
        title: "Validasi Gagal",
        description: firstError || "Harap lengkapi semua kolom yang wajib diisi.",
      });
      return false;
    }
    return true;
  };

  const save = async (
    forcedStatus?: "Diterbitkan" | "Draf",
    overrideFields?: Partial<FormFields>
  ): Promise<boolean> => {
    if (articleId && loadedArticleId !== articleId) {
      showToast({
        type: "error",
        title: "Data Belum Siap",
        description: "Tunggu sampai materi edukasi selesai dimuat.",
      });
      return false;
    }

    const currentFields: FormFields = {
      ...fields,
      ...overrideFields,
      ...(forcedStatus ? { status: forcedStatus } : {}),
    };

    if (!validate(currentFields)) return false;

    setIsSaving(true);
    try {
      await educationService.saveArticle({
        id: articleId,
        ...currentFields,
        shortDescription: currentFields.shortDescription.trim(),
      });
      showToast({
        type: "success",
        title: "Berhasil",
        description: articleId ? "Materi edukasi berhasil diperbarui." : "Materi edukasi berhasil ditambahkan.",
      });
      router.push(ROUTES.MANAJEMEN_EDUKASI);
      router.refresh();
      return true;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const serverMsg = error.response?.data?.message || error.message || "Gagal menyimpan materi edukasi. Coba lagi.";
      showToast({
        type: "error",
        title: "Gagal Menyimpan",
        description: serverMsg,
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    fields,
    isLoading,
    isSaving,
    loadError,
    loadedArticleId,
    errors,
    handleChange,
    save,
    cancel: () => router.push(ROUTES.MANAJEMEN_EDUKASI),
    retryLoad: () => window.location.reload(),
  };
}
