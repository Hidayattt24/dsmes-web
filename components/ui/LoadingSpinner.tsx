interface LoadingSpinnerProps {
  readonly size?:      "sm" | "md" | "lg";
  readonly className?: string;
}

const sizeMap = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" } as const;

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Memuat..."
      className={[
        "inline-block animate-spin rounded-full",
        "border-[3px] border-[#E2E8F0] border-t-[#3B67FC]",
        sizeMap[size],
        className,
      ].join(" ")}
    />
  );
}

/** Full-page centered overlay spinner */
export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <LoadingSpinner size="lg" />
    </div>
  );
}
