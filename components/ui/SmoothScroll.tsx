"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

export function SmoothScroll({ children }: { readonly children: React.ReactNode }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const nativeScroll =
    pathname.startsWith("/admin/data-pasien") ||
    pathname.startsWith("/admin/pemantauan-catatan-pasien") ||
    pathname.startsWith("/staff/pemantauan-catatan-pasien");

  useGSAP(
    () => {
      if (nativeScroll || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const smoother = ScrollSmoother.create({
        wrapper: wrapper.current,
        content: content.current,
        smooth: 1.35,
        smoothTouch: 0.2,
        effects: false,
        normalizeScroll: false,
      });

      return () => smoother.kill();
    },
    { dependencies: [nativeScroll] },
  );

  if (nativeScroll) return <>{children}</>;

  return (
    <div ref={wrapper} id="smooth-wrapper">
      <div ref={content} id="smooth-content">
        {children}
      </div>
    </div>
  );
}
