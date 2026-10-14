import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthCard }      from "@/components/auth/AuthCard";
import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";
import { LoginForm }     from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Masuk | DIBA (Diabetes Behaviour & Adherence Application)",
  description: "Masuk ke sistem DIBA untuk mengelola data pasien, pemantauan catatan, dan edukasi diabetes.",
};

export default function LoginPage() {
  return (
    <>
      <AuthCard>
        <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Memuat formulir...</div>}>
          <LoginForm />
        </Suspense>
      </AuthCard>
      <AuthHeroPanel />
    </>
  );
}
