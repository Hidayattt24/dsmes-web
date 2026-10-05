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
        <LoginForm />
      </AuthCard>
      <AuthHeroPanel />
    </>
  );
}
