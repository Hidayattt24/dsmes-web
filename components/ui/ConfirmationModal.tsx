"use client";

import { useEffect, useRef } from "react";
import { Button } from "./Button";
import { Portal } from "./Portal";

type ModalVariant = "danger" | "warning" | "success" | "info";

interface ConfirmationModalProps {
  readonly open: boolean;
  readonly title: string;
  readonly description: string;
  readonly variant?: ModalVariant;
  readonly confirmText?: string;
  readonly cancelText?: string;
  readonly onConfirm: () => void | Promise<void>;
  readonly onCancel: () => void;
  readonly loading?: boolean;
}

const variantConfig = {
  danger: {
    icon: "delete",
    iconClass: "text-[#C53030]",
    iconBg: "bg-[#FFF5F5] border border-[#FEB2B2]/20",
    confirmClass: "bg-[#C53030] hover:bg-[#9B2C2C] text-white shadow-sm hover:scale-[1.01] active:scale-[0.99]",
  },
  warning: {
    icon: "warning",
    iconClass: "text-[#B45309]",
    iconBg: "bg-[#FFFBEB] border border-[#FDE68A]/20",
    confirmClass: "bg-[#B45309] hover:bg-[#92400E] text-white shadow-sm hover:scale-[1.01] active:scale-[0.99]",
  },
  success: {
    icon: "check_circle",
    iconClass: "text-[#3B67FC]",
    iconBg: "bg-[#EEF2FF] border border-[#A8EEFA]/20",
    confirmClass: "bg-[#3B67FC] hover:bg-[#001B6B] text-white shadow-sm hover:scale-[1.01] active:scale-[0.99]",
  },
  info: {
    icon: "info",
    iconClass: "text-[#2B6CB0]",
    iconBg: "bg-[#EBF8FF] border border-[#BEE3F8]/20",
    confirmClass: "bg-[#2B6CB0] hover:bg-[#2B6CB0]/90 text-white shadow-sm hover:scale-[1.01] active:scale-[0.99]",
  },
};

export function ConfirmationModal({
  open,
  title,
  description,
  variant = "info",
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmationModalProps) {
  const config = variantConfig[variant];
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !loading) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel, loading]);

  // Handle body scroll locking
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <Portal>
    <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ease-out"
        onClick={() => {
          if (!loading) onCancel();
        }}
      />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        className={[
          "relative bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-100",
          "transform transition-all duration-300 ease-out scale-100 opacity-100",
          "font-[family-name:var(--font-poppins)] animate-[scaleUp_0.2s_ease-out]",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:flex-row gap-4">
          {/* Icon Circle */}
          <div className={["w-12 h-12 rounded-xl flex items-center justify-center shrink-0", config.iconBg].join(" ")}>
            <span className={["material-symbols-outlined text-2xl select-none", config.iconClass].join(" ")}>
              {config.icon}
            </span>
          </div>

          {/* Content */}
          <div className="space-y-2 flex-1">
            <h3
              id="modal-title"
              className="text-lg font-bold text-slate-800 tracking-tight leading-snug"
            >
              {title}
            </h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto font-bold px-6 border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            {cancelText}
          </Button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={[
              "h-11 px-6 text-sm rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
              config.confirmClass,
              "w-full sm:w-auto",
            ].join(" ")}
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : null}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );
}
