"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SidebarNavLink } from "@/components/layout/SidebarNavLink";
import { MAIN_NAV_ITEMS, STAFF_NAV_ITEMS } from "@/constants/navigation";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { usePathname }    from "next/navigation";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useAuth } from "@/hooks/useAuth";

export function SidebarNavbar() {
  const { logout } = useAuth();
  const { isMobileOpen, closeMobile } = useSidebarStore();
  const pathname   = usePathname();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const navItems = pathname.startsWith("/staff") ? STAFF_NAV_ITEMS : MAIN_NAV_ITEMS;

  const handleLogout = async (): Promise<void> => {
    setIsLogoutOpen(false);
    await logout();
  };

  // Prevent body scrolling when mobile drawer is opened
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Close mobile drawer on Escape key down
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        closeMobile();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen, closeMobile]);

  const renderSidebarContent = (isMobile = false) => (
    <>
      {/* Official branding logo: full logo image */}
      <div className="px-6 mb-8 flex items-center justify-center relative">
        <Image
          src="/logo.png"
          alt="Logo DSMES Aceh"
          width={240}
          height={80}
          className="h-16 w-auto max-w-[210px] object-contain mx-auto"
          priority
        />
        {isMobile && (
          <button
            onClick={closeMobile}
            className="absolute right-4 md:hidden w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer text-[#718096]"
            aria-label="Tutup menu"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        )}
      </div>

      {/* Main nav items */}
      <nav className="flex-1 px-4 flex flex-col gap-1" aria-label="Menu utama">
        {navItems.map((item) => (
          <SidebarNavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Bottom logout section */}
      <div className="px-4 pt-6 border-t border-[#E2E8F0] flex flex-col gap-1">
        <button
          onClick={() => setIsLogoutOpen(true)}
          className={[
            "flex items-center gap-4 px-4 py-3 rounded-xl w-full cursor-pointer",
            "text-[#C53030] hover:bg-[#FFF5F5] transition-all duration-200",
            "font-[family-name:var(--font-poppins)] text-[15px] font-medium",
          ].join(" ")}
        >
          <span className="material-symbols-outlined text-[22px]">logout</span>
          <span>Keluar</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="w-[280px] h-screen sticky left-0 top-0 bg-white flex flex-col py-8 border-r border-[#E2E8F0] hidden md:flex z-40 shrink-0">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ease-in-out"
        />
      )}

      {/* Mobile Off-canvas Drawer */}
      <aside
        className={[
          "fixed top-0 left-0 h-screen w-[280px] bg-white flex flex-col py-8 border-r border-[#E2E8F0] z-50 md:hidden transition-transform duration-300 ease-in-out shadow-xl",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {renderSidebarContent(true)}
      </aside>

      <ConfirmationModal
        open={isLogoutOpen}
        title="Keluar dari Sistem?"
        description="Apakah Anda yakin ingin keluar dari akun ini?"
        variant="warning"
        confirmText="Keluar"
        cancelText="Batal"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutOpen(false)}
      />
    </>
  );
}
