"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useSettingsForm } from "../hooks/useSettingsForm";
import { ProfilePhotoCard } from "./ProfilePhotoCard";
import { AccountInfoForm } from "./AccountInfoForm";
import { AccountSecurityForm } from "./AccountSecurityForm";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useToast } from "@/components/ui/Toast";
import { SettingsSkeleton } from "@/components/staff/settings/SettingsSkeleton";

export function SettingsFeature() {
  const {
    fields,
    isLoading,
    isSaving,
    isFormDirty,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    handleChange,
    handleBatal,
    handleSave,
    handlePasswordChange,
  } = useSettingsForm();

  const { showToast } = useToast();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleBatalClick = () => {
    if (isFormDirty) {
      setIsCancelModalOpen(true);
    } else {
      showToast({
        type: "info",
        title: "Informasi",
        description: "Tidak ada perubahan untuk dibatalkan.",
      });
    }
  };

  const handleConfirmCancel = () => {
    handleBatal();
    setIsCancelModalOpen(false);
  };

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)]">
      {/* Header / Action Toolbar Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#E2E8F0] gap-4 font-[family-name:var(--font-poppins)]">
        <div>
          <h1 className="text-3xl font-bold text-[#1A202C] tracking-tight">Pengaturan Sistem</h1>
          <p className="text-[#718096] mt-1 text-sm">Kelola profil, keamanan, dan preferensi akun Anda.</p>
        </div>
        <div className="flex w-full sm:w-auto justify-end gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleBatalClick}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-semibold text-[#718096] hover:text-[#1A202C] transition-colors border border-[#E2E8F0] sm:border-transparent cursor-pointer text-center"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#3B67FC] text-white px-8 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95 shadow-md shadow-[#3B67FC]/10 cursor-pointer disabled:opacity-50 text-center"
          >
            {isSaving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <span className="material-symbols-outlined text-xl select-none">save</span>
            )}
            <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>
        </div>
      </div>

      {/* Main Settings Form Blocks */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-8"
      >
        {/* Profile Photo Card */}
        <ProfilePhotoCard
          profilePhoto={fields.profilePhoto}
          name={fields.name}
          onChangePhoto={(photo) => handleChange("profilePhoto", photo)}
          onDeletePhoto={() => handleChange("profilePhoto", "")}
        />

        {/* Account Info Form Card */}
        <AccountInfoForm fields={fields} onChange={handleChange} />

        {/* Account Security Form Card */}
        <AccountSecurityForm
          isSaving={isSaving}
          currentPassword={currentPassword}
          setCurrentPassword={setCurrentPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmNewPassword={confirmNewPassword}
          setConfirmNewPassword={setConfirmNewPassword}
          onSubmitPassword={handlePasswordChange}
        />
      </form>

      {/* Legal & Medical Guidelines Section */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] text-[#3B67FC] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">policy</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1A202C]">Kebijakan, Legal & Kredit Sistem</h2>
            <p className="text-xs text-[#718096]">Dokumen resmi privasi data penelitian, ketentuan layanan, dan referensi standar medis.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Link
            href={ROUTES.KEBIJAKAN_PRIVASI}
            className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#3B67FC] hover:bg-[#F0FDF4] transition-all group flex items-start justify-between"
          >
            <div>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F0FF] text-[#3B67FC] mb-1">
                05-Okt-2026
              </span>
              <h3 className="font-bold text-sm text-[#1A202C] group-hover:text-[#3B67FC] transition-colors">
                Kebijakan Privasi DIBA
              </h3>
              <p className="text-xs text-[#718096] mt-1">
                Tata kelola data kesehatan pasien, etika penelitian akademik, dan batasan penggunaan AI/ML.
              </p>
            </div>
            <span className="material-symbols-outlined text-[#718096] group-hover:text-[#3B67FC] text-lg">
              arrow_forward
            </span>
          </Link>

          <Link
            href={ROUTES.SYARAT_KETENTUAN}
            className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#3B67FC] hover:bg-[#F0FDF4] transition-all group flex items-start justify-between"
          >
            <div>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 mb-1">
                Ketentuan Layanan
              </span>
              <h3 className="font-bold text-sm text-[#1A202C] group-hover:text-[#3B67FC] transition-colors">
                Syarat & Ketentuan DIBA
              </h3>
              <p className="text-xs text-[#718096] mt-1">
                Batasan tanggung jawab medis, hak kekayaan intelektual (HAKI), dan aturan penggunaan sistem.
              </p>
            </div>
            <span className="material-symbols-outlined text-[#718096] group-hover:text-[#3B67FC] text-lg">
              arrow_forward
            </span>
          </Link>
        </div>

        <div className="mt-6 pt-5 border-t border-[#E2E8F0] text-xs text-[#718096] space-y-2">
          <p className="font-semibold text-[#1A202C]">Sumber Data & Standar Klinis:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Dataset Nutrisi:</strong>{" "}
              <a
                href="https://www.kaggle.com/datasets/fritze/informasi-nilai-gizi-indonesia"
                target="_blank"
                rel="noreferrer"
                className="text-[#3B67FC] hover:underline"
              >
                Informasi Nilai Gizi Indonesia (Kaggle) ↗
              </a>
            </li>
            <li>
              <strong>Standar Nasional:</strong> PB PERKENI —{" "}
              <a
                href="https://pbperkeni.or.id/wp-content/uploads/2021/11/22-10-21-Website-Pedoman-Pemantauan-Glukosa-Darah-Mandiri-Ebook.pdf"
                target="_blank"
                rel="noreferrer"
                className="text-[#3B67FC] hover:underline"
              >
                Pedoman Pemantauan Glukosa Darah Mandiri (PGDM 2021) ↗
              </a>
            </li>
            <li>
              <strong>Standar Internasional:</strong> ADA —{" "}
              <a
                href="https://diabetes.org/about-diabetes/diagnosis"
                target="_blank"
                rel="noreferrer"
                className="text-[#3B67FC] hover:underline"
              >
                Standards of Care in Diabetes: Kriteria Diagnosis ↗
              </a>
            </li>
            <li>
              <strong>Tipografi:</strong> Font Poppins & Plus Jakarta Sans (Google Fonts Open Font License).
            </li>
          </ul>
        </div>
      </section>

      {/* Cancel Warning Confirmation Dialog */}
      <ConfirmationModal
        open={isCancelModalOpen}
        title="Batalkan Perubahan?"
        description="Perubahan yang belum disimpan akan hilang."
        variant="warning"
        confirmText="Ya, Batalkan"
        cancelText="Lanjut Mengedit"
        onConfirm={handleConfirmCancel}
        onCancel={() => setIsCancelModalOpen(false)}
      />
    </div>
  );
}
