import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface AuthBackLinkProps {
  readonly href?:  string;
  readonly label?: string;
}

/**
 * AuthBackLink — "← Kembali ke Login" link used on every step of the
 * forgot-password flow. Accepts an optional override href/label.
 */
export function AuthBackLink({
  href  = ROUTES.LOGIN,
  label = "Kembali ke Login",
}: AuthBackLinkProps) {
  return (
    <div className="mt-6 text-center font-[family-name:var(--font-jakarta)]">
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3e4946] hover:text-[#001B6B] transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        {label}
      </Link>
    </div>
  );
}
