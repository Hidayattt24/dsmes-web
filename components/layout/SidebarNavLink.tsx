"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/constants/navigation";
import { useSidebarStore } from "@/lib/stores/sidebarStore";

interface SidebarNavLinkProps {
  readonly item: NavItem;
}

export function SidebarNavLink({ item }: SidebarNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const { closeMobile } = useSidebarStore();

  return (
    <Link
      href={item.href}
      onClick={closeMobile}
      aria-current={isActive ? "page" : undefined}
      className={[
        "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200",
        "font-[family-name:var(--font-poppins)] text-[15px]",
        isActive
          ? "text-[#3B67FC] font-semibold bg-[#EEF2FF]"
          : "text-[#718096] hover:text-[#3B67FC] hover:bg-[#F4F6F8]",
      ].join(" ")}
    >
      <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  );
}
