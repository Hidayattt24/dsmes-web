"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label:       string;
  readonly error?:      string;
  readonly helperText?: string;
  readonly leftIcon?:   ReactNode;
  readonly rightSlot?:  ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightSlot,
      id,
      required,
      disabled,
      className = "",
      ...rest
    },
    ref
  ) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* Label */}
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-[#3e4946]"
        >
          {label}
          {required && <span className="text-[#C53030] ml-0.5">*</span>}
        </label>

        {/* Input wrapper */}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e7976] pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={[
              "w-full h-14 rounded-xl border text-sm font-medium",
              "bg-[#f5f3f3] text-[#1b1c1c] placeholder:text-[#6e7976]",
              "transition-all duration-200 outline-none",
              "focus:bg-white focus:ring-2 focus:ring-[#001B6B]/20",
              leftIcon  ? "pl-12" : "pl-4",
              rightSlot ? "pr-12" : "pr-4",
              error
                ? "border-[#C53030] focus:border-[#C53030] focus:ring-[#C53030]/20"
                : "border-[#bec9c5] focus:border-[#001B6B]",
              disabled ? "opacity-50 cursor-not-allowed" : "",
              className,
            ].join(" ")}
            {...rest}
          />
          {rightSlot && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2">
              {rightSlot}
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-[#C53030] font-medium">
            {error}
          </p>
        )}

        {/* Helper text */}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-[#6e7976]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
