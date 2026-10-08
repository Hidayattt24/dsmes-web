"use client";

import { useState } from "react";
import { AuthFormHeader }          from "@/components/auth/AuthFormHeader";
import { AuthBackLink }            from "@/components/auth/AuthBackLink";
import { VerificationCodeInput }   from "@/components/ui/VerificationCodeInput";
import { Button }                  from "@/components/ui/Button";
import { useCountdown }            from "@/hooks/useCountdown";
import { useVerifyOtp }            from "@/features/auth/hooks/useVerifyOtp";
import { ROUTES }                  from "@/constants/routes";

export function VerifyOtpForm() {
  const [code, setCode] = useState("");
  const { email, isLoading, isResending, error, submit, resend } = useVerifyOtp();
  const { seconds, isFinished, restart } = useCountdown(60);

  const handleResend = async (): Promise<void> => {
    if (!isFinished || isResending) return;
    const ok = await resend();
    if (ok) {
      setCode("");
      restart();
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    submit(code);
  };

  return (
    <div className="font-[family-name:var(--font-jakarta)]">
      <AuthFormHeader
        title="Verifikasi Kode OTP"
        description={
          email
            ? `Masukkan 6 digit kode OTP yang kami kirimkan ke ${email}`
            : "Masukkan 6 digit kode OTP yang kami kirimkan ke email Anda."
        }
      />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 sm:gap-6">
        <div>
          <VerificationCodeInput
            value={code}
            onChange={setCode}
            error={error ?? undefined}
          />

          <div className="mt-4 flex items-center justify-between text-xs text-[#595959]">
            <span>Tidak menerima kode?</span>
            {isFinished ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="font-semibold text-[#004f45] hover:underline disabled:opacity-50"
              >
                {isResending ? "Mengirim..." : "Kirim Ulang"}
              </button>
            ) : (
              <span className="font-medium text-[#718096]">
                Kirim ulang dalam <span className="font-semibold text-[#004f45]">{seconds}s</span>
              </span>
            )}
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={isLoading}
          disabled={code.length !== 6 || isLoading}
        >
          Verifikasi Kode
        </Button>
      </form>

      <AuthBackLink href={ROUTES.LUPA_PASSWORD} label="Ubah Alamat Email" />
    </div>
  );
}
