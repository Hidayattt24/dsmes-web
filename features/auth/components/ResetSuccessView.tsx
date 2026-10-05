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
    <div className="flex flex-col items-center text-center font-[family-name:var(--font-jakarta)] px-2 sm:px-0">
      {/* Logo */}
      <div className="mb-6 sm:mb-8">
        <Image
          src="/logo.png"
          alt="DIBA Logo"
          width={240}
          height={80}
          className="h-12 sm:h-16 w-auto max-w-[180px] sm:max-w-[220px] object-contain mx-auto"
          priority
        />
      </div>

      {/* Success icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F0F9F8] flex items-center justify-center mb-5 sm:mb-6 shadow-sm">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#004f45] flex items-center justify-center">
          <span
            className="material-symbols-outlined text-white text-[28px] sm:text-[32px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check
          </span>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-xl sm:text-2xl font-bold text-[#1b1c1c] mb-2 sm:mb-3">
        Kata Sandi Berhasil Diubah
      </h1>
      <p className="text-xs sm:text-sm md:text-base text-[#4A5568] leading-relaxed max-w-sm mb-8 sm:mb-10">
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
