"use client";

import { useEffect, useRef } from "react";

interface GlassStatCardProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly parallaxFactor?: number;
}

function GlassStatCard({ children, className = "", parallaxFactor = 1 }: GlassStatCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const moveX = ((e.clientX - window.innerWidth  / 2) / 100) * parallaxFactor;
      const moveY = ((e.clientY - window.innerHeight / 2) / 100) * parallaxFactor;
      ref.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [parallaxFactor]);

  return (
    <div ref={ref} className={`glass-card ${className}`}>
      {children}
    </div>
  );
}

export function AuthHeroPanel() {
  return (
    <section className="hidden md:flex w-1/2 hero-gradient relative overflow-hidden p-12 flex-col justify-center items-center text-center">
      {/* Medical grid overlay */}
      <div className="absolute inset-0 medical-grid opacity-20 pointer-events-none" />

      {/* Floating stat cards */}
      <div className="relative w-full max-w-lg mb-12 flex flex-col items-center">
        {/* Main card */}
        <GlassStatCard className="w-full p-6 rounded-3xl relative z-20" parallaxFactor={0.5}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#00695c]/20 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[#004f45] text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  analytics
                </span>
              </div>
              <span className="text-[#00201b] font-bold text-sm font-[family-name:var(--font-jakarta)]">
                Ringkasan Statistik
              </span>
            </div>
            <span className="text-[#6e7976] text-xs font-[family-name:var(--font-jakarta)]">
              Hari Ini
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-white rounded-xl border border-[#bec9c5]/30">
              <p className="text-xs text-[#6e7976] font-[family-name:var(--font-jakarta)]">
                Glukosa Darah
              </p>
              <h4 className="text-xl font-bold text-[#004f45] font-[family-name:var(--font-jakarta)]">
                112{" "}
                <span className="text-xs font-normal text-[#6e7976]">mg/dL</span>
              </h4>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#bec9c5]/30">
              <p className="text-xs text-[#6e7976] font-[family-name:var(--font-jakarta)]">
                Pasien Baru
              </p>
              <h4 className="text-xl font-bold text-[#286b33] font-[family-name:var(--font-jakarta)]">
                +12
              </h4>
            </div>
          </div>
        </GlassStatCard>

        {/* Education progress card */}
        <GlassStatCard
          className="absolute -top-10 -left-6 w-56 p-4 rounded-3xl z-10 hidden lg:block opacity-90"
          parallaxFactor={1}
        >
          <div className="flex gap-2 items-center mb-2">
            <div className="w-3 h-3 rounded-full bg-[#286b33]" />
            <span className="text-xs text-[#3e4946] font-[family-name:var(--font-jakarta)]">
              Target Edukasi
            </span>
          </div>
          <div className="w-full bg-[#f5f3f3] h-2 rounded-full overflow-hidden">
            <div className="w-4/5 h-full bg-[#286b33] rounded-full" />
          </div>
          <p className="mt-2 text-xs font-bold text-[#1b1c1c] font-[family-name:var(--font-jakarta)]">
            80% Tercapai
          </p>
        </GlassStatCard>
      </div>

      {/* Hero text */}
      <div className="relative z-30 px-6 max-w-xl">
        <h2 className="text-white font-extrabold text-2xl md:text-3xl mb-4 leading-tight font-[family-name:var(--font-jakarta)]">
          Platform DIBA untuk Mendukung Pengelolaan Diabetes Melitus
        </h2>
        <p className="text-[#94e5d5]/80 leading-relaxed text-sm font-[family-name:var(--font-jakarta)]">
          Membantu Admin dan Tenaga Kesehatan Puskesmas memantau data pasien,
          edukasi, monitoring, serta mendukung kepatuhan pengelolaan mandiri berbasis DIBA (Diabetes Behaviour &amp; Adherence Application).
        </p>
      </div>

      {/* Ambient blur blobs */}
      <div className="absolute top-1/4 right-0 w-32 h-32 bg-[#286b33]/10 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-[#00695c]/10 blur-[80px] rounded-full pointer-events-none" />
    </section>
  );
}
