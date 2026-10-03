"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthFormHeader }              from "@/components/auth/AuthFormHeader";
import { AuthBackLink }                from "@/components/auth/AuthBackLink";
import { PasswordField }               from "@/components/ui/PasswordField";
import { PasswordStrengthIndicator }   from "@/components/auth/PasswordStrengthIndicator";
import { Button }                      from "@/components/ui/Button";

import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/validation/resetPasswordSchema";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";
import { ROUTES }           from "@/constants/routes";

export function ResetPasswordForm() {
  const { isLoading, submit } = useResetPassword();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const passwordValue = useWatch({ control, name: "password" });

  return (
    <div className="font-[family-name:var(--font-jakarta)]">
      <AuthFormHeader
        title="Buat Kata Sandi Baru"
        description="Masukkan kata sandi baru untuk akun Anda."
      />

      <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-6">
        <div>
          <PasswordField
            label="Kata Sandi Baru"
            id="password"
            placeholder="••••••••"
            required
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordStrengthIndicator password={passwordValue ?? ""} />
        </div>

        <PasswordField
          label="Konfirmasi Kata Sandi"
          id="confirmPassword"
          placeholder="••••••••"
          required
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" size="lg" className="w-full" loading={isLoading}>
          Simpan Kata Sandi
        </Button>
      </form>

      <AuthBackLink href={ROUTES.LUPA_PASSWORD} label="Kembali" />
    </div>
  );
}
