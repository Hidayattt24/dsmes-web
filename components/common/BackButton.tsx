import Link from "next/link";

interface BackButtonProps {
  readonly href: string;
  readonly label: string;
  readonly onClick?: () => void;
}

export function BackButton({ href, label, onClick }: BackButtonProps) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-2 text-[#718096] hover:text-[#3B67FC] transition-colors font-medium text-sm font-[family-name:var(--font-poppins)] cursor-pointer bg-transparent border-none p-0"
      >
        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-[#718096] hover:text-[#3B67FC] transition-colors font-medium text-sm font-[family-name:var(--font-poppins)]"
    >
      <span className="material-symbols-outlined text-[20px]">arrow_back</span>
      <span>{label}</span>
    </Link>
  );
}
