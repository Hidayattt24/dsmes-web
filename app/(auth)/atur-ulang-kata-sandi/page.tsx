import type { Metadata } from "next";
import { AuthCard }         from "@/components/auth/AuthCard";
import { AuthHeroPanel }    from "@/components/auth/AuthHeroPanel";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Atur Ulang Kata Sandi | DIBA",
  description: "Buat kata sandi baru yang aman untuk akun DIBA Anda.",
};

export default function AturUlangKataSandiPage() {
  return (
    <>
      <AuthCard>
        <ResetPasswordForm />
      </AuthCard>
      <AuthHeroPanel />
    </>
  );
}
