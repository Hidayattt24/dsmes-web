"use client";

import { useRef } from "react";
import { useToast } from "@/components/ui/Toast";

interface ProfilePhotoCardProps {
  readonly profilePhoto: string;
  readonly name: string;
  readonly onChangePhoto: (photo: string) => void;
  readonly onDeletePhoto: () => void;
}

export function ProfilePhotoCard({
  profilePhoto,
  name,
  onChangePhoto,
  onDeletePhoto,
}: ProfilePhotoCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast({
        type: "error",
        title: "Gagal Unggah",
        description: "Hanya file gambar (JPG, JPEG, PNG, WEBP) yang diperbolehkan.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        onChangePhoto(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "AD";

  return (
    <div className="premium-card p-8 bg-white font-[family-name:var(--font-poppins)]">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/jpg, image/png, image/webp"
        className="hidden"
      />
      <div className="flex flex-col sm:flex-row items-center gap-10">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-[#F4F6F8] border-4 border-white shadow-md overflow-hidden shrink-0 flex items-center justify-center">
            {profilePhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="Profile Photo" className="w-full h-full object-cover" src={profilePhoto} />
            ) : (
              <span className="text-3xl font-bold text-[#3B67FC] select-none">{initials}</span>
            )}
          </div>
          <button
            onClick={handleEditClick}
            className="absolute bottom-0 right-0 w-10 h-10 bg-[#3B67FC] text-white rounded-full flex items-center justify-center border-4 border-white shadow-md hover:scale-110 transition-transform cursor-pointer"
            type="button"
            title="Ubah Foto"
          >
            <span className="material-symbols-outlined text-lg select-none">edit</span>
          </button>
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold text-[#1A202C] mb-1">Foto Profil</h3>
          <p className="text-sm text-[#718096] mb-6">Unggah foto baru untuk mengubah identitas visual Anda.</p>
          <div className="flex justify-center sm:justify-start gap-3">
            <button
              onClick={handleEditClick}
              className="px-6 py-2 border border-[#E2E8F0] text-[#1A202C] rounded-xl text-sm font-semibold hover:bg-[#F4F6F8] transition-colors cursor-pointer font-[family-name:var(--font-poppins)]"
              type="button"
            >
              Ganti Foto
            </button>
            <button
              onClick={onDeletePhoto}
              className="px-6 py-2 text-[#C53030] hover:bg-[#FFF5F5] rounded-xl text-sm font-semibold transition-colors cursor-pointer font-[family-name:var(--font-poppins)]"
              type="button"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
