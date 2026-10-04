import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/Button";

/**
 * ResetSuccessView — rendered after a successful password reset.
 * One responsibility: display the success state and a return-to-login CTA.
 */
export function ResetSuccessView() {
  return (
    <div className="flex flex-col items-center text-center font-[family-name:var(--font-jakarta)]">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/logo.png"
          alt="Digital DSMES Logo"
          width={240}
          height={80}
          className="h-16 w-auto max-w-[220px] object-contain mx-auto"
          priority
        />
      </div>

      {/* Success icon */}
      <div className="w-20 h-20 rounded-full bg-[#F0F9F8] flex items-center justify-center mb-6 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-[#004f45] flex items-center justify-center">
          <span
            className="material-symbols-outlined text-white text-[32px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check
          </span>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-[#1b1c1c] mb-3">
        Kata Sandi Berhasil Diubah
      </h1>
      <p className="text-base text-[#3e4946] leading-relaxed max-w-sm mb-10">
        Kata sandi Anda telah berhasil diperbarui. Silakan masuk menggunakan kata sandi baru.
      </p>

      {/* CTA */}
      <Link href={ROUTES.LOGIN} className="w-full max-w-sm">
        <Button size="lg" className="w-full">
          Kembali ke Login
        </Button>
      </Link>
    </div>
  );
}
