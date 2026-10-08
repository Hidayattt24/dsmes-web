"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { useForgotPasswordStore } from "@/lib/stores/forgotPasswordStore";
import { ROUTES } from "@/constants/routes";
import { useToast } from "@/components/ui/Toast";

interface UseVerifyOtpReturn {
  readonly email: string;
  readonly isLoading: boolean;
  readonly isResending: boolean;
  readonly error: string | null;
  readonly submit: (code: string) => Promise<boolean>;
  readonly resend: () => Promise<boolean>;
}

export function useVerifyOtp(): UseVerifyOtpReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { email, setOtpCode } = useForgotPasswordStore();
  const { showToast } = useToast();
  const router = useRouter();

  const submit = async (code: string): Promise<boolean> => {
    if (!email) {
      router.push(ROUTES.LUPA_PASSWORD);
      return false;
    }

    if (code.length !== 6) {
      setError("Masukkan 6 digit kode verifikasi.");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.verifyOtp(email, code, "staff");
      setOtpCode(code);
      showToast({
        type: "success",
        title: "Verifikasi Berhasil",
        description: "Kode OTP sesuai. Silakan atur kata sandi baru Anda.",
      });
      router.push(ROUTES.ATUR_ULANG_KATA_SANDI);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Kode OTP tidak valid atau telah kedaluwarsa.";
      setError(msg);
      showToast({
        type: "error",
        title: "Verifikasi Gagal",
        description: msg,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resend = async (): Promise<boolean> => {
    if (!email) {
      router.push(ROUTES.LUPA_PASSWORD);
      return false;
    }

    setIsResending(true);
    setError(null);

    try {
      await authService.forgotPassword(email, "staff");
      showToast({
        type: "success",
        title: "Kode Baru Dikirim",
        description: "Kode verifikasi baru telah dikirim ke email Anda.",
      });
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal mengirim ulang kode. Silakan coba lagi.";
      showToast({
        type: "error",
        title: "Gagal Mengirim Ulang",
        description: msg,
      });
      return false;
    } finally {
      setIsResending(false);
    }
  };

  return {
    email,
    isLoading,
    isResending,
    error,
    submit,
    resend,
  };
}
