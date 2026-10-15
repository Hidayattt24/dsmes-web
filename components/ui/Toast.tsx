"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { Portal } from "@/components/ui/Portal";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  readonly id: string;
  readonly type: ToastType;
  readonly title: string;
  readonly description?: string;
  readonly duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, "id">) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const variantConfig = {
  success: {
    icon: "check_circle",
    iconClass: "text-[#3B67FC]",
    borderClass: "border-[#A8EEFA]/40",
    bgClass: "bg-[#EEF2FF]",
  },
  error: {
    icon: "cancel",
    iconClass: "text-[#C53030]",
    borderClass: "border-[#FEB2B2]/40",
    bgClass: "bg-[#FFF5F5]",
  },
  warning: {
    icon: "warning",
    iconClass: "text-[#B45309]",
    borderClass: "border-[#FDE68A]/40",
    bgClass: "bg-[#FFFBEB]",
  },
  info: {
    icon: "info",
    iconClass: "text-[#2B6CB0]",
    borderClass: "border-[#BEE3F8]/40",
    bgClass: "bg-[#EBF8FF]",
  },
};

export function ToastProvider({ children }: { readonly children: ReactNode }) {
  const [toasts, setToasts] = useState<readonly ToastItem[]>([]);

  const showToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Portal>
        <div className="fixed bottom-6 right-6 z-[10000] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
          {toasts.map((toast) => (
            <ToastCard key={toast.id} toast={toast} onClose={hideToast} />
          ))}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Single Toast Card Component
function ToastCard({
  toast,
  onClose,
}: {
  readonly toast: ToastItem;
  readonly onClose: (id: string) => void;
}) {
  const { id, type, title, description, duration = 4000 } = toast;
  const config = variantConfig[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div
      role="alert"
      className={[
        "w-full bg-white rounded-xl shadow-lg border p-4 flex gap-3 pointer-events-auto cursor-pointer select-none",
        "transform transition-all duration-300 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]",
        "font-[family-name:var(--font-poppins)] animate-[slideIn_0.25s_ease-out]",
        config.bgClass,
        config.borderClass,
      ].join(" ")}
      onClick={() => onClose(id)}
    >
      {/* Icon */}
      <div className="shrink-0 mt-0.5">
        <span className={["material-symbols-outlined text-[20px] select-none", config.iconClass].join(" ")}>
          {config.icon}
        </span>
      </div>

      {/* Message Info */}
      <div className="flex-1 space-y-1">
        <p className="text-sm font-bold text-slate-800 leading-none">
          {title}
        </p>
        {description && (
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose(id);
        }}
        className="text-slate-400 hover:text-slate-600 transition-colors self-start cursor-pointer"
        aria-label="Tutup"
      >
        <span className="material-symbols-outlined text-base select-none">close</span>
      </button>
    </div>
  );
}
