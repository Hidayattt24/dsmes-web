"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthFormHeader } from "@/components/auth/AuthFormHeader";
import { AuthBackLink }   from "@/components/auth/AuthBackLink";
import { InputField }     from "@/components/ui/InputField";
import { Button }         from "@/components/ui/Button";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/validation/forgotPasswordSchema";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";

export function ForgotPasswordForm() {
  const { isLoading, submit } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  return (
    <div className="font-[family-name:var(--font-jakarta)]">
      <AuthFormHeader
        title="Lupa Kata Sandi"
        description="Masukkan alamat email yang terdaftar untuk mengatur ulang kata sandi Anda."
      />

      <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-5 sm:gap-6">
        <InputField
          label="Email"
          type="email"
          id="email"
          placeholder="nama@email.com"
          required
          autoComplete="email"
          error={errors.email?.message}
          leftIcon={<span className="material-symbols-outlined text-[20px] sm:text-[22px]">mail</span>}
          {...register("email")}
        />

        <Button type="submit" size="lg" className="w-full" loading={isLoading}>
          Lanjut
        </Button>
      </form>

      <AuthBackLink />
    </div>
  );
}
