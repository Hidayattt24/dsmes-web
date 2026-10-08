"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService }            from "@/services/authService";
import { useForgotPasswordStore } from "@/lib/stores/forgotPasswordStore";
import { ROUTES }                 from "@/constants/routes";
import { useToast }               from "@/components/ui/Toast";
import type { ResetPasswordFormValues } from "@/features/auth/validation/resetPasswordSchema";

interface UseResetPasswordReturn {
  readonly isLoading: boolean;
  readonly error:     string | null;
  readonly submit:    (values: ResetPasswordFormValues) => Promise<void>;
}

export function useResetPassword(): UseResetPasswordReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const { email, otpCode, reset } = useForgotPasswordStore();
  const { showToast }             = useToast();
  const router                    = useRouter();

  const submit = async (values: ResetPasswordFormValues): Promise<void> => {
    if (!email || !otpCode) {
      showToast({
        type: "error",
        title: "Sesi Kedaluwarsa",
        description: "Silakan mulai ulang proses lupa kata sandi.",
      });
      router.push(ROUTES.LUPA_PASSWORD);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword(
        email,
        otpCode,
        values.password,
        values.confirmPassword,
        "staff"
      );
      reset(); // clear session state — flow complete
      showToast({
        type: "success",
        title: "Kata Sandi Diubah",
        description: "Kata sandi Anda telah berhasil diubah.",
      });
      router.push(ROUTES.BERHASIL_RESET);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal mengubah kata sandi. Coba lagi.";
      setError(msg);
      showToast({
        type: "error",
        title: "Gagal Mengubah Kata Sandi",
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, submit };
}
