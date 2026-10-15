"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize    = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?:   ButtonVariant;
  readonly size?:      ButtonSize;
  readonly loading?:   boolean;
  readonly leftIcon?:  ReactNode;
  readonly rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   "bg-[#3B67FC] text-white hover:bg-[#001B6B] shadow-sm disabled:bg-[#3B67FC]/50",
  secondary: "border border-[#E2E8F0] bg-white text-[#1A202C] hover:bg-[#F4F6F8] disabled:opacity-50",
  ghost:     "text-[#3B67FC] hover:bg-[#EEF2FF] disabled:opacity-50",
  danger:    "bg-[#C53030] text-white hover:bg-[#9B2C2C] shadow-sm disabled:opacity-50",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm:  "h-9  px-4  text-sm  rounded-xl",
  md:  "h-11 px-5  text-sm  rounded-xl",
  lg:  "h-14 px-6  text-base rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size    = "md",
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      className = "",
      ...rest
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 font-semibold",
        "transition-all duration-200 active:scale-[0.98]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B67FC]/40",
        "disabled:cursor-not-allowed select-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  )
);

Button.displayName = "Button";
