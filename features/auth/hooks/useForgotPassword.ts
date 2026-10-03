"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { useForgotPasswordStore } from "@/lib/stores/forgotPasswordStore";
import { ROUTES } from "@/constants/routes";
import { useToast } from "@/components/ui/Toast";
import type { ForgotPasswordFormValues } from "@/features/auth/validation/forgotPasswordSchema";

interface UseForgotPasswordReturn {
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly submit: (values: ForgotPasswordFormValues) => Promise<boolean>;
}

export function useForgotPassword(): UseForgotPasswordReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setEmail } = useForgotPasswordStore();
  const { showToast } = useToast();
  const router = useRouter();

  const submit = async (values: ForgotPasswordFormValues): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.checkEmail(values.email);
      setEmail(values.email);
      showToast({
        type: "success",
        title: "Email Terverifikasi",
        description: "Email terdaftar. Silakan masukkan kata sandi baru Anda.",
      });
      router.push(ROUTES.ATUR_ULANG_KATA_SANDI);
      return true;
    } catch (err) {
      const rawMsg = err instanceof Error ? err.message : "Gagal memeriksa email. Coba lagi.";
      const lowerMsg = rawMsg.toLowerCase();

      let toastTitle = "Gagal Memeriksa Email";
      let toastDesc = rawMsg;

      if (
        lowerMsg.includes("tidak terdaftar") ||
        lowerMsg.includes("not found") ||
        lowerMsg.includes("belum terdaftar")
      ) {
        toastTitle = "Email Tidak Ditemukan";
        toastDesc = "Alamat email ini belum terdaftar dalam sistem Digital DSMES.";
      } else if (
        lowerMsg.includes("nonaktif") ||
        lowerMsg.includes("deactivated")
      ) {
        toastTitle = "Akun Dinonaktifkan";
        toastDesc = "Akun Anda berstatus nonaktif. Silakan hubungi administrator.";
      }

      setError(toastDesc);
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

  return { isLoading, error, submit };
}
