"use client";

import { useAdministratorForm } from "../hooks/useAdministratorForm";
import type { FormFields } from "../hooks/useAdministratorForm";
import { useState, useEffect } from "react";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { BackButton } from "@/components/common/BackButton";
import { Select, type SelectOption } from "@/components/ui/Select";
import { facilityService } from "@/services/facilityService";
import Link from "next/link";

import { FormLoader } from "@/components/ui/loading";

interface AdministratorFormFeatureProps {
  readonly adminId?: string;
}

export function AdministratorFormFeature({ adminId }: AdministratorFormFeatureProps) {
  const {
    fields,
    isLoading,
    isSaving,
    errors,
    handleChange: baseHandleChange,
    save,
    cancel,
  } = useAdministratorForm(adminId);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isDirty, setIsDirty] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const [facilityOptions, setFacilityOptions] = useState<SelectOption[]>([]);
  const [isFacilityLoading, setIsFacilityLoading] = useState(true);

  useEffect(() => {
    const loadFacilities = async () => {
      setIsFacilityLoading(true);
      try {
        const facilities = await facilityService.listAll();
        setFacilityOptions(
          facilities.map((f) => ({ value: f.id, label: f.name, icon: "local_hospital" }))
        );
      } catch {
        setFacilityOptions([]);
      } finally {
        setIsFacilityLoading(false);
      }
    };
    loadFacilities();
  }, []);

  const handleChange = (key: keyof FormFields, val: string) => {
    baseHandleChange(key, val);
    setIsDirty(true);
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setIsCancelOpen(true);
    } else {
      cancel();
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  if (isLoading) {
    return <FormLoader />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)] relative">
      {/* Back button */}
      <div className="mb-4">
        <BackButton href="/admin/administrator" label="Manajemen Staff" />
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B] tracking-tight font-[family-name:var(--font-poppins)]">
            {adminId ? "Edit Staff Monitoring" : "Tambah Staff Monitoring Baru"}
          </h2>
          <p className="text-[#64748B] text-sm mt-1 font-[family-name:var(--font-poppins)]">
            {adminId ? "Ubah informasi akun staff monitoring." : "Lengkapi formulir di bawah ini untuk menambahkan akun staff monitoring."}
          </p>
        </div>
        <div className="flex w-full sm:w-auto justify-end gap-3 flex-wrap">
          <button
            onClick={handleCancelClick}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full border border-[#E2E8F0] text-[#1E293B] text-sm font-semibold hover:bg-[#F1F5F9] transition-all cursor-pointer text-center"
          >
            Batal
          </button>
          <button
            onClick={save}
            disabled={isSaving}
            className="flex-1 sm:flex-initial px-8 py-2.5 rounded-full bg-[#00695C] text-white text-sm font-semibold shadow-lg shadow-[#00695C]/20 hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 text-center"
          >
            {isSaving ? "Menyimpan..." : "Simpan Staff"}
          </button>
        </div>
      </div>

      {/* Form Cards Stack */}
      <div className="space-y-6 sm:space-y-8 w-full">
        {/* Card 1: Informasi Akun */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-[#E2E8F0]/60 pb-3">
            <h3 className="text-base font-bold text-[#1E293B]">Informasi Akun</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Lengkap */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fields.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Masukkan nama lengkap"
                className={[
                  "w-full px-5 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C] outline-none transition-all text-sm placeholder:text-[#64748B]/50 font-medium font-[family-name:var(--font-poppins)] text-[#1E293B]",
                  errors.fullName ? "border-red-500" : "",
                ].join(" ")}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs font-semibold">{errors.fullName}</p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fields.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="Username unik"
                className={[
                  "w-full px-5 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C] outline-none transition-all text-sm placeholder:text-[#64748B]/50 font-medium font-[family-name:var(--font-poppins)] text-[#1E293B]",
                  errors.username ? "border-red-500" : "",
                ].join(" ")}
              />
              {errors.username && (
                <p className="text-red-500 text-xs font-semibold">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={fields.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@contoh.com"
                className={[
                  "w-full px-5 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C] outline-none transition-all text-sm placeholder:text-[#64748B]/50 font-medium font-[family-name:var(--font-poppins)] text-[#1E293B]",
                  errors.email ? "border-red-500" : "",
                ].join(" ")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs font-semibold">{errors.email}</p>
              )}
            </div>

            {/* WhatsApp */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                Nomor WhatsApp
              </label>
              <input
                type="tel"
                value={fields.whatsappNumber}
                onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full px-5 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C] outline-none transition-all text-sm placeholder:text-[#64748B]/50 font-medium font-[family-name:var(--font-poppins)] text-[#1E293B]"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Keamanan */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-[#E2E8F0]/60 pb-3">
            <h3 className="text-base font-bold text-[#1E293B]">Keamanan</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                Password {!adminId && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={fields.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className={[
                    "w-full pl-5 pr-12 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C] outline-none transition-all text-sm placeholder:text-[#64748B]/50 font-medium font-[family-name:var(--font-poppins)] text-[#1E293B]",
                    errors.password ? "border-red-500" : "",
                  ].join(" ")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#00695C] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs font-semibold">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                Konfirmasi Password {!adminId && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={fields.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="Ulangi password"
                  className={[
                    "w-full pl-5 pr-12 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C] outline-none transition-all text-sm placeholder:text-[#64748B]/50 font-medium font-[family-name:var(--font-poppins)] text-[#1E293B]",
                    errors.confirmPassword ? "border-red-500" : "",
                  ].join(" ")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#00695C] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showConfirmPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs font-semibold">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Status & Peran */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-[#E2E8F0]/60 pb-3">
            <h3 className="text-base font-bold text-[#1E293B]">Status & Informasi Tambahan</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Peran Sistem */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                Peran Sistem <span className="text-red-500">*</span>
              </label>
              {adminId ? (
              <input
                type="text"
                value="Staff"
                readOnly
                disabled
                className="w-full px-5 py-3.5 rounded-xl border border-[#E2E8F0] outline-none text-sm font-semibold text-[#64748B] bg-[#F8FAFC] cursor-not-allowed"
              />
              ) : (
                <div className="flex gap-6 pt-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={fields.role === "admin"}
                      onChange={() => handleChange("role", "admin")}
                      className="text-[#00695C] border-[#E2E8F0] focus:ring-[#00695C] w-5 h-5 cursor-pointer accent-[#00695C]"
                    />
                    <span className="text-sm font-semibold text-[#1A202C] group-hover:text-[#00695C] transition-colors">
                      Admin
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="role"
                      value="staff"
                      checked={fields.role === "staff"}
                      onChange={() => handleChange("role", "staff")}
                      className="text-[#00695C] border-[#E2E8F0] focus:ring-[#00695C] w-5 h-5 cursor-pointer accent-[#00695C]"
                    />
                    <span className="text-sm font-semibold text-[#718096] group-hover:text-[#00695C] transition-colors">
                      Staff
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Jabatan / Posisi */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                Jabatan / Posisi
              </label>
              <input
                type="text"
                value={fields.positionTitle}
                onChange={(e) => handleChange("positionTitle", e.target.value)}
                placeholder="Contoh: Kepala Puskesmas"
                className="w-full px-5 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C] outline-none transition-all text-sm placeholder:text-[#64748B]/50 font-medium font-[family-name:var(--font-poppins)] text-[#1E293B]"
              />
            </div>

            {/* Puskesmas / Health Facility */}
            {fields.role === "staff" && (
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                    Puskesmas <span className="text-red-500">*</span>
                  </label>
                  <Link
                    href="/admin/fasilitas"
                    className="text-xs font-semibold text-[#00695C] hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    Kelola Puskesmas
                  </Link>
                </div>
                <Select
                  value={fields.healthFacilityId}
                  onChange={(val) => handleChange("healthFacilityId", val)}
                  options={facilityOptions}
                  placeholder="Pilih puskesmas"
                  icon="local_hospital"
                  loading={isFacilityLoading}
                />
                <p className="text-[11px] font-medium text-[#718096]">
                  Staff hanya dapat melihat data pasien di puskesmas yang dipilih.
                </p>
              </div>
            )}

            {/* Bio Singkat */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                Bio Singkat
              </label>
              <input
                type="text"
                value={fields.shortBio}
                onChange={(e) => handleChange("shortBio", e.target.value)}
                placeholder="Deskripsi singkat"
                className="w-full px-5 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C] outline-none transition-all text-sm placeholder:text-[#64748B]/50 font-medium font-[family-name:var(--font-poppins)] text-[#1E293B]"
              />
            </div>
          </div>
        </div>

        {/* Info Banner Accent */}
        <div className="flex items-start gap-3 bg-[#F0F9F8] p-5 rounded-xl border border-[#B2DFDB]/40 mt-4 select-none">
          <span className="material-symbols-outlined text-[#00695C] text-[20px] mt-0.5 select-none">info</span>
          <p className="text-xs text-[#00695C] font-semibold leading-relaxed">
            Staff Monitoring memiliki hak akses untuk memantau data perkembangan klinis pasien diabetes secara langsung (realtime) melalui dashboard.
          </p>
        </div>

        {/* Action Buttons Footer */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 py-8 border-t border-[#E2E8F0]/40">
          <button
            onClick={handleCancelClick}
            className="w-full sm:w-auto px-8 py-3 rounded-xl border border-[#E2E8F0] text-[#1E293B] text-sm font-bold hover:bg-[#F4F6F8] transition-all shadow-sm cursor-pointer text-center"
          >
            Batal
          </button>
          <button
            onClick={save}
            disabled={isSaving}
            className="w-full sm:w-auto px-10 py-3 rounded-xl bg-[#00695C] text-white text-sm font-bold shadow-xl shadow-[#00695C]/25 hover:opacity-90 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 text-center"
          >
            <span className="material-symbols-outlined text-lg select-none">save</span>
            <span>{isSaving ? "Menyimpan..." : "Simpan Staff Monitoring"}</span>
          </button>
        </div>
      </div>

      <ConfirmationModal
        open={isCancelOpen}
        title="Batalkan Perubahan?"
        description="Perubahan yang belum disimpan akan hilang."
        variant="warning"
        confirmText="Ya, Batalkan"
        cancelText="Lanjut Mengedit"
        onConfirm={() => {
          setIsCancelOpen(false);
          setIsDirty(false);
          cancel();
        }}
        onCancel={() => setIsCancelOpen(false)}
      />
    </div>
  );
}
