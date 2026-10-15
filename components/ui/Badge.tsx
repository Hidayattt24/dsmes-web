import type { ReactNode } from "react";

type BadgeVariant = "primary" | "warning" | "error" | "muted";

interface BadgeProps {
  readonly children: ReactNode;
  readonly variant?: BadgeVariant;
  readonly className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: "bg-[#EEF2FF] text-[#3B67FC]",
  warning: "bg-[#FFFBEB] text-[#B45309]",
  error:   "bg-[#FFF5F5] text-[#C53030]",
  muted:   "bg-[#F4F6F8] text-[#718096]",
};

export function Badge({
  children,
  variant = "muted",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-3 py-1 rounded-full",
        "text-[10px] font-bold uppercase tracking-widest",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
