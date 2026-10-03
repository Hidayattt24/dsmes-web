"use client";

import { usePathname } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { MAIN_NAV_ITEMS, STAFF_NAV_ITEMS } from "@/constants/navigation";
import { useAuth } from "@/hooks/useAuth";

export function HeaderNavbar() {
  const { user } = useAuth();
  const { openMobile } = useSidebarStore();
  const pathname = usePathname();

  const defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuDb1KUY-_QSdBdqr2297B6t9UU7Zv4G2xxqAqHFHa17vEkmU84tkQA0wlpfQjEOa2p6JCwBuaAwtxllXhMQJWX-Fh32sGp53qysZvoCzaaMPnUPcGvKzGbUaPuzVLBWnL5YLJHG11W421EfDPx3HK5L7YeILoMbRTD55WXEvXOaztccIYZksiEMRKx1SVjPk-OWY91z6CxUoFiqTatRWYAFmSI6xVdHGinX2J9fIZ3Go0ORDAsMHfSwZIqijQE5lIeqMxayXT_z-Glm";

  // Match current path to Nav item label for page title
  const getPageTitle = () => {
    const allItems = [...MAIN_NAV_ITEMS, ...STAFF_NAV_ITEMS];
    const matched = allItems.find(
      (item) =>
        pathname === item.href ||
        (item.href !== "/admin" && item.href !== "/staff" && pathname.startsWith(`${item.href}/`))
    );
    return matched ? matched.label : "Admin";
  };

  return (
    <header className="h-20 w-full sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] flex justify-between items-center px-6 md:px-10">
      
      {/* Left side: Mobile only */}
      <div className="flex md:hidden items-center gap-3 mr-auto">
        <button
          onClick={openMobile}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-[#718096] cursor-pointer"
          aria-label="Buka menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <h1 className="text-base font-bold text-[#1A202C] font-[family-name:var(--font-poppins)] tracking-tight truncate max-w-[150px] sm:max-w-none">
          {getPageTitle()}
        </h1>
      </div>

      {/* Center placeholder or search (hidden on mobile) */}
      <div className="hidden md:block flex-1" />

      {/* Right side: Notification + User Profile */}
      <div className="flex items-center gap-4">

        {/* User profile block */}
        <div className="flex items-center gap-3 select-none">
          {/* Desktop User Info */}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#1A202C] font-[family-name:var(--font-poppins)] leading-none">
              {user?.name ?? "Pengguna"}
            </p>
            <p className="text-[11px] text-[#718096] font-medium font-[family-name:var(--font-poppins)] mt-1.5 leading-none">
              {user?.role === "staff" || pathname.startsWith("/staff")
                ? (user?.puskesmas ? (user.puskesmas.toLowerCase().startsWith("puskesmas") ? user.puskesmas : `Puskesmas ${user.puskesmas}`) : "Staff Puskesmas")
                : (user?.positionTitle ?? "Administrator")}
            </p>
          </div>
          
          <Avatar
            src={user?.avatarUrl ?? defaultAvatar}
            name={user?.name ?? "Pengguna"}
            size={40}
            showOnline={true}
          />
        </div>
      </div>
    </header>
  );
}
