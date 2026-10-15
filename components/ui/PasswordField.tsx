"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { InputField } from "./InputField";

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  readonly label:       string;
  readonly error?:      string;
  readonly helperText?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, helperText, ...rest }, ref) => {
    const [visible, setVisible] = useState(false);

    const toggleVisibility = (): void => setVisible((v) => !v);

    const toggleButton = (
      <button
        type="button"
        onClick={toggleVisibility}
        aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
        className="text-[#6e7976] hover:text-[#001B6B] transition-colors"
      >
        <span className="material-symbols-outlined text-[22px]">
          {visible ? "visibility_off" : "visibility"}
        </span>
      </button>
    );

    return (
      <InputField
        ref={ref}
        type={visible ? "text" : "password"}
        label={label}
        error={error}
        helperText={helperText}
        leftIcon={
          <span className="material-symbols-outlined text-[22px]">lock</span>
        }
        rightSlot={toggleButton}
        {...rest}
      />
    );
  }
);

PasswordField.displayName = "PasswordField";
