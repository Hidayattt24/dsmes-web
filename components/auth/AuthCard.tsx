import type { ReactNode } from "react";
import Link from "next/link";

interface AuthCardProps {
  readonly children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <section className="w-full md:w-1/2 flex flex-col justify-between p-6 sm:p-8 md:p-12 lg:p-16 z-10 bg-white min-h-[100dvh] sm:min-h-0">
      {/* Top spacer on desktop */}
      <div className="hidden sm:block" />

      {/* Slot content */}
      <div className="max-w-md mx-auto w-full py-4 sm:py-6 md:py-8 flex-1 flex flex-col justify-center">
        {children}
      </div>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[#E2E8F0]/60 sm:border-t-0 mt-auto sm:mt-0 text-center sm:text-left">
        <p className="text-xs sm:text-sm text-[#718096] font-[family-name:var(--font-jakarta)]">
          © 2026 DIBA (Diabetes Behaviour &amp; Adherence Application)
        </p>
        <div className="flex gap-4 sm:gap-6 items-center">
          <Link
            href="#"
            className="text-xs sm:text-sm text-[#4A5568] hover:text-[#004f45] transition-colors font-[family-name:var(--font-jakarta)] py-1"
          >
            Kebijakan Privasi
          </Link>
          <Link
            href="#"
            className="text-xs sm:text-sm text-[#4A5568] hover:text-[#004f45] transition-colors font-[family-name:var(--font-jakarta)] py-1"
          >
            Syarat &amp; Ketentuan
          </Link>
        </div>
      </footer>
    </section>
  );
}
