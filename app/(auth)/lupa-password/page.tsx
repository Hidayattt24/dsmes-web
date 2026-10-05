import type { Metadata } from "next";
import { AuthCard }          from "@/components/auth/AuthCard";
import { AuthHeroPanel }     from "@/components/auth/AuthHeroPanel";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Lupa Kata Sandi | DIBA",
  description: "Masukkan alamat email yang terdaftar untuk mengatur ulang kata sandi akun DIBA Anda.",
};

export default function LupaPasswordPage() {
  return (
    <>
      <AuthCard>
        <ForgotPasswordForm />
      </AuthCard>
      <AuthHeroPanel />
    </>
  );
}
