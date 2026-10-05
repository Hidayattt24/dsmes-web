import type { Metadata } from "next";
import { AuthCard }          from "@/components/auth/AuthCard";
import { AuthHeroPanel }     from "@/components/auth/AuthHeroPanel";
import { ResetSuccessView }  from "@/features/auth/components/ResetSuccessView";

export const metadata: Metadata = {
  title: "Kata Sandi Berhasil Diubah | DIBA",
  description: "Kata sandi Anda telah berhasil diperbarui. Silakan masuk kembali ke sistem DIBA.",
};

export default function BerhasilResetPage() {
  return (
    <>
      <AuthCard>
        <ResetSuccessView />
      </AuthCard>
      <AuthHeroPanel />
    </>
  );
}
