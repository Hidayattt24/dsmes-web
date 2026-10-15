"use client";

import { useState } from "react";

interface AccountSecurityFormProps {
  readonly isSaving: boolean;
  readonly currentPassword: string;
  readonly setCurrentPassword: (val: string) => void;
  readonly newPassword: string;
  readonly setNewPassword: (val: string) => void;
  readonly confirmNewPassword: string;
  readonly setConfirmNewPassword: (val: string) => void;
  readonly onSubmitPassword: () => void;
}

export function AccountSecurityForm({
  isSaving,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  onSubmitPassword,
}: AccountSecurityFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  return (
    <div className="premium-card p-8 bg-white font-[family-name:var(--font-poppins)]">
      <h2 className="text-lg font-bold text-[#1A202C] mb-8 flex items-center gap-2 select-none">
        <span className="material-symbols-outlined text-[#3B67FC]">security</span>
        <span>Keamanan Akun</span>
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Current Password */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-[11px] font-bold text-[#718096] uppercase tracking-widest px-1 select-none">
              Kata Sandi Saat Ini
            </label>
            <div className="relative w-full md:w-1/2">
              <input
                className="w-full bg-[#F4F6F8] border border-transparent focus:border-[#3B67FC] focus:bg-white focus:ring-1 focus:ring-[#3B67FC] rounded-xl px-5 py-3.5 pr-12 text-sm font-semibold text-[#1A202C] outline-none transition-all"
                placeholder="Masukkan kata sandi saat ini"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#3B67FC] transition-colors cursor-pointer"
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <span className="material-symbols-outlined text-[20px] select-none">
                  {showCurrentPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-[#718096] uppercase tracking-widest px-1 select-none font-poppins">
              Kata Sandi Baru
            </label>
            <div className="relative w-full">
              <input
                className="w-full bg-[#F4F6F8] border border-transparent focus:border-[#3B67FC] focus:bg-white focus:ring-1 focus:ring-[#3B67FC] rounded-xl px-5 py-3.5 pr-12 text-sm font-semibold text-[#1A202C] outline-none transition-all"
                placeholder="Masukkan kata sandi baru"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#3B67FC] transition-colors cursor-pointer"
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <span className="material-symbols-outlined text-[20px] select-none">
                  {showNewPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-[#718096] uppercase tracking-widest px-1 select-none font-poppins">
              Konfirmasi Kata Sandi Baru
            </label>
            <div className="relative w-full">
              <input
                className="w-full bg-[#F4F6F8] border border-transparent focus:border-[#3B67FC] focus:bg-white focus:ring-1 focus:ring-[#3B67FC] rounded-xl px-5 py-3.5 pr-12 text-sm font-semibold text-[#1A202C] outline-none transition-all"
                placeholder="Ulangi kata sandi baru"
                type={showConfirmNewPassword ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#3B67FC] transition-colors cursor-pointer"
                type="button"
                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
              >
                <span className="material-symbols-outlined text-[20px] select-none">
                  {showConfirmNewPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 py-3 px-5 bg-[#EEF2FF] border border-[#A8EEFA]/40 text-[#3B67FC] rounded-xl select-none">
          <span className="material-symbols-outlined text-lg">info</span>
          <p className="text-xs font-semibold leading-relaxed">
            Gunakan minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, angka, dan simbol.
          </p>
        </div>

        <div className="flex justify-start">
          <button
            onClick={onSubmitPassword}
            disabled={isSaving}
            className="px-8 py-3 border-2 border-[#3B67FC] text-[#3B67FC] hover:bg-[#3B67FC] hover:text-white rounded-xl text-sm font-bold transition-all cursor-pointer disabled:opacity-50 font-[family-name:var(--font-poppins)]"
            type="button"
          >
            Ubah Kata Sandi
          </button>
        </div>
      </div>
    </div>
  );
}
