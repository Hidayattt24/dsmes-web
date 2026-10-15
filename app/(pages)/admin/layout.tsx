import type { ReactNode } from "react";
import { SidebarNavbar } from "@/components/layout/SidebarNavbar";
import { HeaderNavbar } from "@/components/layout/HeaderNavbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#1A202C] md:pl-[280px]">
      <SidebarNavbar />
      <main className="flex min-h-screen flex-col min-w-0">
        <HeaderNavbar />
        <div className="flex-1 p-8 pt-28">{children}</div>
      </main>
    </div>
  );
}
