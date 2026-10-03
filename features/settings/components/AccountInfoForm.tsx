"use client";

import type { SystemSettings } from "../types/settings";

interface AccountInfoFormProps {
  readonly fields: SystemSettings;
  readonly onChange: (key: keyof SystemSettings, val: string) => void;
}

export function AccountInfoForm({ fields, onChange }: AccountInfoFormProps) {
  return (
    <div className="premium-card p-8 bg-white font-[family-name:var(--font-poppins)]">
      <h2 className="text-lg font-bold text-[#1A202C] mb-8 flex items-center gap-2 select-none">
        <span className="material-symbols-outlined text-[#00695C]">person</span>
        <span>Informasi Akun</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-[#718096] uppercase tracking-widest px-1 select-none">
            Nama Lengkap
          </label>
          <input
            className="w-full bg-[#F4F6F8] border border-transparent focus:border-[#00695C] focus:bg-white focus:ring-1 focus:ring-[#00695C] rounded-xl px-5 py-3.5 text-sm font-semibold text-[#1A202C] outline-none transition-all"
            type="text"
            value={fields.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-[#718096] uppercase tracking-widest px-1 select-none">
            Username
          </label>
          <input
            className="w-full bg-[#F4F6F8] border border-transparent focus:border-[#00695C] focus:bg-white focus:ring-1 focus:ring-[#00695C] rounded-xl px-5 py-3.5 text-sm font-semibold text-[#1A202C] outline-none transition-all"
            type="text"
            value={fields.username}
            onChange={(e) => onChange("username", e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-[#718096] uppercase tracking-widest px-1 select-none">
            Email
          </label>
          <input
            className="w-full bg-[#F4F6F8] border border-transparent focus:border-[#00695C] focus:bg-white focus:ring-1 focus:ring-[#00695C] rounded-xl px-5 py-3.5 text-sm font-semibold text-[#1A202C] outline-none transition-all"
            type="email"
            value={fields.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </div>

        {/* WhatsApp */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-[#718096] uppercase tracking-widest px-1 select-none">
            Nomor WhatsApp
          </label>
          <input
            className="w-full bg-[#F4F6F8] border border-transparent focus:border-[#00695C] focus:bg-white focus:ring-1 focus:ring-[#00695C] rounded-xl px-5 py-3.5 text-sm font-semibold text-[#1A202C] outline-none transition-all"
            type="text"
            value={fields.whatsapp}
            onChange={(e) => onChange("whatsapp", e.target.value)}
          />
        </div>

        {/* Position / Jabatan */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-[#718096] uppercase tracking-widest px-1 select-none">
            Jabatan
          </label>
          <input
            className="w-full bg-[#F4F6F8] border border-transparent focus:border-[#00695C] focus:bg-white focus:ring-1 focus:ring-[#00695C] rounded-xl px-5 py-3.5 text-sm font-semibold text-[#1A202C] outline-none transition-all"
            type="text"
            value={fields.jabatan}
            onChange={(e) => onChange("jabatan", e.target.value)}
          />
        </div>

        {/* Puskesmas */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <label className="block text-[11px] font-bold text-[#718096] uppercase tracking-widest select-none">
              Fasilitas Kesehatan / Puskesmas
            </label>
            <span className="text-[10px] font-medium text-[#718096] italic">Ditetapkan Admin</span>
          </div>
          <input
            className="w-full bg-[#EDF2F7] border border-transparent rounded-xl px-5 py-3.5 text-sm font-semibold text-[#4A5568] outline-none cursor-not-allowed select-none"
            type="text"
            value={fields.puskesmas || "Puskesmas"}
            readOnly
            disabled
          />
        </div>

        {/* Short Bio */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="block text-[11px] font-bold text-[#718096] uppercase tracking-widest px-1 select-none">
            Bio Singkat
          </label>
          <textarea
            className="w-full bg-[#F4F6F8] border border-transparent focus:border-[#00695C] focus:bg-white focus:ring-1 focus:ring-[#00695C] rounded-xl px-5 py-3.5 text-sm font-semibold text-[#1A202C] outline-none transition-all min-h-[100px] resize-none"
            rows={3}
            value={fields.bio}
            onChange={(e) => onChange("bio", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
