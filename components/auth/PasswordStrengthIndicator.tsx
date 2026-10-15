/**
 * PasswordStrengthIndicator — shows 4 password strength rules with a
 * live ✓/✗ indicator. Used exclusively in the ResetPasswordForm.
 */

interface Rule {
  readonly label:  string;
  readonly passes: boolean;
}

interface PasswordStrengthIndicatorProps {
  readonly password: string;
}

function buildRules(password: string): Rule[] {
  return [
    { label: "Minimal 8 karakter",  passes: password.length >= 8           },
    { label: "Minimal 1 huruf besar", passes: /[A-Z]/.test(password)       },
    { label: "Minimal 1 angka",     passes: /[0-9]/.test(password)         },
    { label: "Tidak mengandung spasi", passes: !/\s/.test(password) && password.length > 0 },
  ];
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null;
  const rules = buildRules(password);

  return (
    <ul className="mt-2 flex flex-col gap-1" aria-label="Persyaratan kata sandi">
      {rules.map((rule) => (
        <li
          key={rule.label}
          className={[
            "flex items-center gap-2 text-xs font-medium font-[family-name:var(--font-jakarta)]",
            rule.passes ? "text-[#07CADE]" : "text-[#6e7976]",
          ].join(" ")}
        >
          <span className="material-symbols-outlined text-[14px]">
            {rule.passes ? "check_circle" : "radio_button_unchecked"}
          </span>
          {rule.label}
        </li>
      ))}
    </ul>
  );
}
