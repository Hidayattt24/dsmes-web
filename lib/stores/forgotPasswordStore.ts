"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Persists the email across the 2-step forgot-password flow.
 * Cleared on completion or when the user returns to login.
 */

interface ForgotPasswordState {
  readonly email: string;
  readonly otpCode: string;
}

interface ForgotPasswordActions {
  setEmail:   (email: string) => void;
  setOtpCode: (otpCode: string) => void;
  reset:      () => void;
}

type ForgotPasswordStore = ForgotPasswordState & ForgotPasswordActions;

export const useForgotPasswordStore = create<ForgotPasswordStore>()(
  persist(
    (set) => ({
      email: "",
      otpCode: "",
      setEmail:   (email) => set({ email }),
      setOtpCode: (otpCode) => set({ otpCode }),
      reset:      () => set({ email: "", otpCode: "" }),
    }),
    {
      name:    "dsmes-forgot-password",
      storage: createJSONStorage(() => sessionStorage), // session only — not localStorage
    }
  )
);
