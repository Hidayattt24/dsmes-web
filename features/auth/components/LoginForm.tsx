"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";

import { AuthFormHeader } from "@/components/auth/AuthFormHeader";
import { InputField }     from "@/components/ui/InputField";
import { PasswordField }  from "@/components/ui/PasswordField";
import { Button }         from "@/components/ui/Button";

import { loginSchema, type LoginFormValues } from "@/features/auth/validation/loginSchema";
import { useLogin }                          from "@/features/auth/hooks/useLogin";
import { ROUTES }                            from "@/constants/routes";

export function LoginForm() {
  const { isLoading, fieldError, submit } = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = handleSubmit(async (values) => {
    const success = await submit(values);
    if (!success && fieldError) {
      if (fieldError.field === "email") {
        setError("email", { message: fieldError.message });
      } else if (fieldError.field === "password") {
        setError("password", { message: fieldError.message });
      }
    }
  });

  return (
    <div className="font-[family-name:var(--font-jakarta)]">
      {/* Mobile-only hero header (desktop unchanged) */}
      <div className="md:hidden mb-7">
        <div className="hero-gradient relative overflow-hidden rounded-3xl px-5 pt-5 pb-6 shadow-lg shadow-[#004f45]/20">
          <div className="absolute inset-0 medical-grid opacity-20 pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 blur-2xl rounded-full pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center bg-white rounded-2xl px-3 py-2 shadow-sm mb-5">
              <Image
                src="/logo.png"
                alt="DIBA Logo"
                width={240}
                height={80}
                className="h-9 w-auto max-w-[150px] object-contain"
                priority
              />
            </div>
            <h1 className="text-white text-2xl font-extrabold tracking-tight mb-1.5">
              Selamat Datang 👋
            </h1>
            <p className="text-[#94e5d5]/90 text-[13px] leading-relaxed">
              Masuk untuk mengakses sistem DIBA (Diabetes Behaviour &amp; Adherence Application).
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { icon: "monitor_heart", label: "Monitoring" },
                { icon: "school",        label: "Edukasi" },
                { icon: "groups",        label: "Data Pasien" },
              ].map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-white"
                >
                  <span className="material-symbols-outlined text-[14px]">{chip.icon}</span>
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop heading */}
      <div className="hidden md:block">
        <AuthFormHeader
          title="Selamat Datang"
          description="Silakan masuk untuk mengakses sistem DIBA (Diabetes Behaviour & Adherence Application)."
        />
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 sm:gap-6">
        <InputField
          label="Email"
          type="email"
          id="email"
          placeholder="nama@email.com"
          required
          autoComplete="email"
          error={errors.email?.message}
          leftIcon={
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">mail</span>
          }
          {...register("email")}
        />

        <PasswordField
          label="Kata Sandi"
          id="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Remember me + Forgot password */}
        <div className="flex flex-row items-center justify-between gap-2">
          <label className="flex items-center gap-2 cursor-pointer group select-none">
            <input
              type="checkbox"
              className="w-4 h-4 sm:w-5 sm:h-5 rounded border-[#bec9c5] text-[#004f45] focus:ring-[#004f45]"
              {...register("rememberMe")}
            />
            <span className="text-xs sm:text-sm text-[#4A5568] group-hover:text-[#1b1c1c] transition-colors">
              Ingat saya
            </span>
          </label>
          <Link
            href={ROUTES.LUPA_PASSWORD}
            className="text-xs sm:text-sm font-bold text-[#004f45] hover:underline decoration-2 underline-offset-4 transition-all self-start sm:self-auto"
          >
            Lupa Kata Sandi?
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={isLoading}
          id="login-submit"
        >
          Masuk
        </Button>
      </form>
    </div>
  );
}
