import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#F8FAFB] p-0 sm:p-4 md:p-6 lg:p-8">
      <main
        className="w-full max-w-[1440px] min-h-[100dvh] sm:min-h-[640px] md:min-h-[85vh] bg-white sm:rounded-2xl md:rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-sm sm:shadow-xl md:shadow-2xl border-0 sm:border border-[#E2E8F0]/80"
        style={{ boxShadow: "0 8px 32px -4px rgba(0, 79, 69, 0.08)" }}
      >
        {children}
      </main>
    </div>
  );
}
