"use client";

import { useRef, type KeyboardEvent, type ClipboardEvent } from "react";

interface VerificationCodeInputProps {
  readonly value:    string;
  readonly onChange: (value: string) => void;
  readonly error?:   string;
}

const DIGIT_COUNT = 6;

/**
 * VerificationCodeInput — 6 individual digit boxes with auto-advance,
 * backspace-to-previous, and paste support.
 * Controlled via a single string value.
 */
export function VerificationCodeInput({
  value,
  onChange,
  error,
}: VerificationCodeInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = Array.from({ length: DIGIT_COUNT }, (_, i) => value[i] || "");

  const focusAt = (index: number): void =>
    inputRefs.current[Math.max(0, Math.min(index, DIGIT_COUNT - 1))]?.focus();

  const handleChange = (index: number, char: string): void => {
    if (!/^\d$/.test(char)) return;
    const nextDigits = [...digits];
    nextDigits[index] = char;
    onChange(nextDigits.join(""));
    if (index < DIGIT_COUNT - 1) focusAt(index + 1);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const nextDigits = [...digits];
        nextDigits[index] = "";
        onChange(nextDigits.join(""));
      } else {
        focusAt(index - 1);
      }
    } else if (e.key === "ArrowLeft") {
      focusAt(index - 1);
    } else if (e.key === "ArrowRight") {
      focusAt(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, DIGIT_COUNT);
    onChange(pasted);
    focusAt(Math.min(pasted.length, DIGIT_COUNT - 1));
  };

  return (
    <div>
      <div className="flex gap-3 justify-between" role="group" aria-label="Kode verifikasi 6 digit">
        {Array.from({ length: DIGIT_COUNT }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]"
            maxLength={1}
            value={digits[i] ?? ""}
            aria-label={`Digit ${i + 1}`}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={[
              "w-12 h-14 rounded-xl border text-center text-xl font-bold",
              "text-[#1b1c1c] bg-[#f5f3f3]",
              "transition-all duration-200 outline-none",
              "focus:bg-white focus:ring-2 focus:ring-[#001B6B]/20 focus:border-[#001B6B]",
              "caret-transparent",
              error
                ? "border-[#C53030] focus:ring-[#C53030]/20 focus:border-[#C53030]"
                : "border-[#bec9c5]",
            ].join(" ")}
          />
        ))}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-xs text-[#C53030] font-medium font-[family-name:var(--font-jakarta)]">
          {error}
        </p>
      )}
    </div>
  );
}
