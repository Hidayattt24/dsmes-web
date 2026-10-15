import type { ReactNode } from "react";
import { SidebarNavbar } from "@/components/layout/SidebarNavbar";
import { HeaderNavbar } from "@/components/layout/HeaderNavbar";

interface StaffLayoutProps {
  readonly children: ReactNode;
}

export default function StaffLayout({ children }: StaffLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#1A202C] md:pl-[280px]">
      <SidebarNavbar />
      <main className="flex min-h-screen flex-col min-w-0">
        <HeaderNavbar />
        <div className="flex-1 p-4 pt-28 sm:p-6 sm:pt-28 xl:p-8 xl:pt-28">{children}</div>
      </main>
    </div>
  );
}
