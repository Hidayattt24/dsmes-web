import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function GlobalPageLoader() {
  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-[#E2E8F0] flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <span className="text-sm font-bold text-[#3B67FC] font-[family-name:var(--font-poppins)]">
          Memuat halaman...
        </span>
      </div>
    </div>
  );
}
