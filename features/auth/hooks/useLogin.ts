"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import type { LoginCredentials } from "@/types/auth";

export type AuthFieldError = {
  field: "email" | "password" | "general";
  message: string;
};

interface UseLoginReturn {
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly fieldError: AuthFieldError | null;
  readonly submit: (credentials: LoginCredentials) => Promise<boolean>;
}

export function useLogin(): UseLoginReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<AuthFieldError | null>(null);
  const { login } = useAuth();
  const { showToast } = useToast();

  const submit = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setFieldError(null);
    try {
      await login(credentials);
      showToast({
        type: "success",
        title: "Login Berhasil",
        description: "Selamat datang kembali di Digital DSMES Aceh.",
      });
      return true;
    } catch (err) {
      const rawMsg = err instanceof Error ? err.message : "Login gagal. Coba lagi.";
      const lowerMsg = rawMsg.toLowerCase();

      let toastTitle = "Login Gagal";
      let toastDesc = rawMsg;
      let identifiedField: "email" | "password" | "general" = "general";

      if (
        lowerMsg.includes("email tidak terdaftar") ||
        lowerMsg.includes("email belum terdaftar") ||
        lowerMsg.includes("email not found")
      ) {
        toastTitle = "Email Tidak Terdaftar";
        toastDesc = "Alamat email tidak ditemukan. Pastikan email Anda sudah benar.";
        identifiedField = "email";
      } else if (
        lowerMsg.includes("kata sandi yang anda masukkan salah") ||
        lowerMsg.includes("kata sandi salah") ||
        lowerMsg.includes("password") ||
        lowerMsg.includes("sandi")
      ) {
        toastTitle = "Kata Sandi Salah";
        toastDesc = "Kata sandi tidak sesuai. Periksa kembali huruf besar/kecil atau gunakan Lupa Kata Sandi.";
        identifiedField = "password";
      } else if (
        lowerMsg.includes("nonaktif") ||
        lowerMsg.includes("deactivated")
      ) {
        toastTitle = "Akun Dinonaktifkan";
        toastDesc = "Akun Anda berstatus nonaktif. Silakan hubungi administrator.";
      } else if (
        lowerMsg.includes("role") ||
        lowerMsg.includes("peran") ||
        lowerMsg.includes("mobile")
      ) {
        toastTitle = "Akses Ditolak";
        toastDesc = rawMsg;
      }

      setError(rawMsg);
      setFieldError({ field: identifiedField, message: toastDesc });

      showToast({
        type: "error",
        title: toastTitle,
        description: toastDesc,
        duration: 5000,
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, fieldError, submit };
}
