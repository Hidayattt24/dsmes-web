import type { Metadata } from "next";
import { AuthCard }      from "@/components/auth/AuthCard";
import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";
import { VerifyOtpForm } from "@/features/auth/components/VerifyOtpForm";

export const metadata: Metadata = {
  title: "Verifikasi Kode OTP | DIBA",
  description: "Masukkan 6 digit kode verifikasi OTP yang dikirimkan ke email Anda untuk melanjutkan.",
};

export default function VerifikasiOtpPage() {
  return (
    <>
      <AuthCard>
        <VerifyOtpForm />
      </AuthCard>
      <AuthHeroPanel />
    </>
  );
}
