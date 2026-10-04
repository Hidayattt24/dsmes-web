import type { ReactNode } from "react";
import Link from "next/link";

interface AuthCardProps {
  readonly children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <section className="w-full md:w-1/2 flex flex-col justify-between p-6 md:p-12 z-10 bg-white">
      {/* Top spacer */}
      <div />

      {/* Slot content */}
      <div className="max-w-md mx-auto w-full py-6 md:py-12">{children}</div>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6">
        <p className="text-sm text-[#6e7976] font-[family-name:var(--font-jakarta)]">
          © 2026 Digital DSMES
        </p>
        <div className="flex gap-6">
          <Link
            href="#"
            className="text-sm text-[#3e4946] hover:text-[#004f45] transition-colors font-[family-name:var(--font-jakarta)]"
          >
            Kebijakan Privasi
          </Link>
          <Link
            href="#"
            className="text-sm text-[#3e4946] hover:text-[#004f45] transition-colors font-[family-name:var(--font-jakarta)]"
          >
            Syarat &amp; Ketentuan
          </Link>
        </div>
      </footer>
    </section>
  );
}
