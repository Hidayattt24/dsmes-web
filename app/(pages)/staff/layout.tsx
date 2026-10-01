import type { ReactNode } from "react";
import { SidebarNavbar } from "@/components/layout/SidebarNavbar";
import { HeaderNavbar } from "@/components/layout/HeaderNavbar";

interface StaffLayoutProps {
  readonly children: ReactNode;
}

export default function StaffLayout({ children }: StaffLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#F4F6F8] text-[#1A202C]">
      <SidebarNavbar />
      <main className="flex-1 flex flex-col min-w-0">
        <HeaderNavbar />
        <div className="flex-1 p-4 sm:p-6 xl:p-8 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
