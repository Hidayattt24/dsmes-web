"use client";

import { useState } from "react";

interface EducationBannerProps {
  readonly src?: string | null;
  readonly alt: string;
  readonly variant?: "hero" | "thumbnail";
  readonly showEmptyLabel?: boolean;
}

export function EducationBanner({
  src,
  alt,
  variant = "hero",
  showEmptyLabel = false,
}: EducationBannerProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasImage = Boolean(src?.trim()) && failedSrc !== src;

  if (hasImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src!}
        alt={alt}
        onError={() => setFailedSrc(src ?? null)}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[linear-gradient(135deg,#EEF2FF_0%,#F8FAFC_55%,#E0F2FE_100%)] text-[#3B67FC]">
      <span
        className={`material-symbols-outlined select-none ${variant === "hero" ? "text-6xl" : "text-2xl"}`}
      >
        menu_book
      </span>
      {showEmptyLabel && variant === "hero" && (
        <span className="mt-3 text-xs font-bold uppercase tracking-wider text-[#64748B]">
          Banner belum ditambahkan
        </span>
      )}
    </div>
  );
}
