"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";

export interface SelectOption {
  readonly value: string;
  readonly label: string;
  readonly icon?: string;
  readonly badge?: string;
}

interface SelectProps {
  readonly label?: string;
  readonly placeholder?: string;
  readonly value: string;
  readonly options: readonly SelectOption[];
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly error?: boolean;
  readonly helperText?: string;
  readonly required?: boolean;
  readonly icon?: string; // Leading icon for the select input
  readonly onChange: (value: string) => void;
  readonly className?: string;
}

export function Select({
  label,
  placeholder = "Pilih opsi...",
  value,
  options,
  disabled = false,
  loading = false,
  error = false,
  helperText,
  required = false,
  icon,
  onChange,
  className = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionsRefs = useRef<(HTMLDivElement | null)[]>([]);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync active index with selected value
  useEffect(() => {
    if (isOpen) {
      const selectedIndex = options.findIndex((opt) => opt.value === value);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [isOpen, value, options]);

  // Focus active option to keep viewport in scroll view
  useEffect(() => {
    if (isOpen && activeIndex >= 0 && optionsRefs.current[activeIndex]) {
      optionsRefs.current[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex, isOpen]);

  const handleToggle = () => {
    if (!disabled && !loading) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (disabled || loading) return;

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < options.length) {
          handleSelect(options[activeIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      case "Tab":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`flex flex-col w-full text-left font-[family-name:var(--font-poppins)] ${className}`} ref={containerRef}>
      {/* Label */}
      {label && (
        <label className="text-xs font-bold text-[#4A5568] mb-1.5 flex items-center gap-0.5 select-none">
          <span>{label}</span>
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}

      {/* Dropdown Input Trigger Container */}
      <div className="relative w-full">
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled || loading}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={[
            "w-full flex items-center justify-between h-12 px-4 rounded-xl border bg-white outline-none transition-all text-sm font-semibold select-none",
            disabled ? "bg-slate-50 border-[#E2E8F0] text-slate-400 cursor-not-allowed" : "",
            loading ? "bg-white border-[#E2E8F0] text-slate-400 cursor-wait" : "",
            error ? "border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500" : "border-[#E2E8F0] focus:ring-1 focus:ring-[#3B67FC] focus:border-[#3B67FC]",
            !disabled && !loading ? "cursor-pointer hover:bg-slate-50/50" : "",
            selectedOption ? "text-[#1A202C]" : "text-[#718096]",
          ].join(" ")}
        >
          <div className="flex items-center gap-2.5 truncate">
            {/* Input Leading Icon */}
            {icon && (
              <span className="material-symbols-outlined text-[20px] text-[#718096] select-none shrink-0">
                {icon}
              </span>
            )}
            
            {/* Selected Option Icon */}
            {!icon && selectedOption?.icon && (
              <span className="material-symbols-outlined text-[18px] text-[#3B67FC] select-none shrink-0">
                {selectedOption.icon}
              </span>
            )}

            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {/* Loading Indicator */}
            {loading && (
              <div className="w-4 h-4 border-2 border-[#3B67FC] border-t-transparent rounded-full animate-spin mr-1" />
            )}
            
            {/* Chevron icon */}
            <span
              className={[
                "material-symbols-outlined text-[22px] text-[#718096] transition-transform duration-200 select-none",
                isOpen ? "rotate-180" : "",
              ].join(" ")}
            >
              expand_more
            </span>
          </div>
        </button>

        {/* Dropdown Options Menu */}
        {isOpen && (
          <div
            role="listbox"
            tabIndex={-1}
            className={[
              "absolute z-[100] w-full mt-2 bg-white border border-[#E2E8F0] rounded-xl shadow-xl overflow-hidden focus:outline-none",
              "animate-in fade-in slide-in-from-top-1 duration-150 ease-out",
            ].join(" ")}
          >
            <div className="max-h-60 overflow-y-auto py-1.5 scrollbar-thin">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-xs font-semibold text-[#718096] text-center">
                  Tidak ada opsi tersedia.
                </div>
              ) : (
                options.map((opt, index) => {
                  const isSelected = opt.value === value;
                  const isActive = index === activeIndex;

                  return (
                    <div
                      key={opt.value}
                      ref={(el) => {
                        optionsRefs.current[index] = el;
                      }}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(opt.value)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={[
                        "flex items-center justify-between px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors select-none",
                        isSelected
                          ? "bg-[#3B67FC]/10 text-[#3B67FC] font-bold"
                          : "text-[#4A5568]",
                        isActive && !isSelected ? "bg-slate-50" : "",
                        isActive && isSelected ? "bg-[#3B67FC]/15" : "",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {opt.icon && (
                          <span
                            className={[
                              "material-symbols-outlined text-[18px] select-none shrink-0",
                              isSelected ? "text-[#3B67FC]" : "text-[#718096]",
                            ].join(" ")}
                          >
                            {opt.icon}
                          </span>
                        )}
                        <span className="truncate">{opt.label}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        {opt.badge && (
                          <span
                            className={[
                              "text-[10px] font-extrabold px-2 py-0.5 rounded-full",
                              isSelected
                                ? "bg-[#3B67FC] text-white"
                                : "bg-slate-100 text-[#718096]",
                            ].join(" ")}
                          >
                            {opt.badge}
                          </span>
                        )}

                        {isSelected && (
                          <span className="material-symbols-outlined text-[18px] text-[#3B67FC] select-none font-bold">
                            check
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Helper text or Error msg */}
      {helperText && (
        <span
          className={[
            "text-[11px] mt-1.5 font-medium",
            error ? "text-red-500 font-bold" : "text-[#718096]",
          ].join(" ")}
        >
          {helperText}
        </span>
      )}
    </div>
  );
}
