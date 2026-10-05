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

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});

  useEffect(() => {
    if (!articleId) return;

    const loadArticle = async () => {
      setIsLoading(true);
      try {
        const art = await educationService.getArticleById(articleId);
        if (art) {
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
        }
      } catch {
        // Handle error if needed
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);

  const handleChange = (key: keyof FormFields, val: string | number) => {
    setFields((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (targetFields: FormFields): boolean => {
    const newErrors: Partial<Record<keyof FormFields, string>> = {};
    if (!targetFields.title.trim()) newErrors.title = "Judul edukasi wajib diisi.";
    if (!targetFields.content.trim()) newErrors.content = "Konten edukasi wajib diisi.";
    if (targetFields.duration <= 0) newErrors.duration = "Durasi membaca harus lebih dari 0 menit.";
    if (!targetFields.thumbnail.trim()) newErrors.thumbnail = "Gambar sampul/banner wajib diunggah.";

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

  const save = async (forcedStatus?: "Diterbitkan" | "Draf", overrideFields?: Partial<FormFields>) => {
    const currentFields: FormFields = {
      ...fields,
      ...overrideFields,
      ...(forcedStatus ? { status: forcedStatus } : {}),
    };

    if (!validate(currentFields)) return;

    setIsSaving(true);
    try {
      const autoSummary = currentFields.shortDescription.trim() ||
        currentFields.content.replace(/<[^>]*>/g, "").slice(0, 160).trim();

      await educationService.saveArticle({
        id: articleId,
        ...currentFields,
        shortDescription: autoSummary,
      });
      showToast({
        type: "success",
        title: "Berhasil",
        description: articleId ? "Materi edukasi berhasil diperbarui." : "Materi edukasi berhasil ditambahkan.",
      });
      router.push(ROUTES.MANAJEMEN_EDUKASI);
      router.refresh();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const serverMsg = error.response?.data?.message || error.message || "Gagal menyimpan materi edukasi. Coba lagi.";
      showToast({
        type: "error",
        title: "Gagal Menyimpan",
        description: serverMsg,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    fields,
    isLoading,
    isSaving,
    errors,
    handleChange,
    save,
    cancel: () => router.push(ROUTES.MANAJEMEN_EDUKASI),
  };
}
