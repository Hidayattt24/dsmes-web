"use client";

import { useState, useEffect } from "react";
import { settingsService } from "../services/settingsService";
import type { SystemSettings } from "../types/settings";
import { useAuthStore } from "@/lib/stores/authStore";
import { useToast } from "@/components/ui/Toast";

export function useSettingsForm() {
  const { showToast } = useToast();
  const [initialFields, setInitialFields] = useState<SystemSettings | null>(null);
  const [fields, setFields] = useState<SystemSettings>({
    name: "",
    username: "",
    email: "",
    whatsapp: "",
    puskesmas: "",
    jabatan: "",
    bio: "",
    profilePhoto: "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load initial settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        setInitialFields(data);
        setFields(data);
      } catch {
        // Error handling
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (key: keyof SystemSettings, val: string) => {
    setFields((prev) => ({ ...prev, [key]: val }));
  };

  const isFormDirty =
    !initialFields ||
    fields.name !== initialFields.name ||
    fields.username !== initialFields.username ||
    fields.email !== initialFields.email ||
    fields.whatsapp !== initialFields.whatsapp ||
    fields.jabatan !== initialFields.jabatan ||
    fields.bio !== initialFields.bio ||
    fields.profilePhoto !== initialFields.profilePhoto ||
    currentPassword !== "" ||
    newPassword !== "" ||
    confirmNewPassword !== "";

  const handleBatal = () => {
    if (initialFields) {
      setFields({ ...initialFields });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      showToast({
        type: "info",
        title: "Dibatalkan",
        description: "Perubahan dibatalkan, form direset.",
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await settingsService.saveSettings(fields);
      setInitialFields(updated);
      setFields(updated);

      // Sync auth store so header/navbar reflect changes immediately
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          name: updated.name,
          positionTitle: updated.jabatan || undefined,
          avatarUrl: updated.profilePhoto || undefined,
        });
      }

      showToast({
        type: "success",
        title: "Berhasil",
        description: "Pengaturan berhasil diperbarui.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch {
      showToast({
        type: "error",
        title: "Gagal",
        description: "Gagal menyimpan pengaturan.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword) {
      showToast({
        type: "error",
        title: "Validasi Gagal",
        description: "Harap masukkan kata sandi saat ini.",
      });
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      showToast({
        type: "error",
        title: "Validasi Gagal",
        description: "Kata sandi baru minimal 8 karakter.",
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast({
        type: "error",
        title: "Validasi Gagal",
        description: "Konfirmasi kata sandi baru tidak cocok.",
      });
      return;
    }

    setIsSaving(true);
    try {
      await settingsService.changePassword(currentPassword, newPassword);
      showToast({
        type: "success",
        title: "Berhasil",
        description: "Kata sandi berhasil diperbarui.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast({
        type: "error",
        title: "Gagal",
        description: err.response?.data?.message || "Gagal memperbarui kata sandi.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    fields,
    isLoading,
    isSaving,
    isFormDirty,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    handleChange,
    handleBatal,
    handleSave,
    handlePasswordChange,
  };
}
