"use client";

import type { Patient } from "@/types/patient";

interface PatientProfileCardProps {
  readonly patient: Patient;
}

export function PatientProfileCard({ patient }: PatientProfileCardProps) {
  return (
    <div className="premium-card p-8 flex flex-col items-center text-center justify-center min-h-[350px]">
      <div className="relative mb-6">
        <div className="w-32 h-32 rounded-full border-2 border-[#3B67FC]/20 p-1.5">
          <div className="w-full h-full rounded-full overflow-hidden bg-[#F4F6F8] shadow-inner flex items-center justify-center">
            {patient.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={patient.avatarUrl}
                alt={patient.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-bold text-3xl text-[#3B67FC] select-none">
                {patient.initials}
              </span>
            )}
          </div>
        </div>
        {patient.accountStatus === "Terverifikasi" && (
          <div className="absolute -bottom-1 right-2 w-8 h-8 bg-[#3B67FC] rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
        )}
      </div>

      <h3 className="font-semibold text-2xl text-[#1A202C] mb-1 font-[family-name:var(--font-poppins)]">
        {patient.name}
      </h3>
      <div className="px-4 py-1 bg-[#3B67FC]/5 rounded-full border border-[#3B67FC]/10 mb-6">
        <p className="text-[#3B67FC] font-semibold text-xs tracking-wide font-[family-name:var(--font-poppins)]">
          # {patient.patientCode && patient.patientCode !== "-" ? patient.patientCode : patient.id.slice(0, 5)}
        </p>
      </div>

      <div className="space-y-3 w-full">
        <div className={`px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 border ${
          patient.compliance >= 75
            ? "bg-green-50 text-green-700 border-green-100"
            : patient.compliance >= 60
            ? "bg-blue-50 text-blue-700 border-blue-100"
            : patient.compliance >= 40
            ? "bg-amber-50 text-amber-700 border-amber-100"
            : "bg-red-50 text-red-700 border-red-100"
        }`}>
          <span className="material-symbols-outlined text-[16px]">task_alt</span>
          <span className="text-[11px] font-bold uppercase tracking-widest font-[family-name:var(--font-poppins)]">
            Kepatuhan: {patient.compliance >= 75 ? "Patuh" : patient.compliance >= 60 ? "Cukup" : patient.compliance >= 40 ? "Kurang" : "Tidak Patuh"} ({patient.compliance}%)
          </span>
        </div>
      </div>
    </div>
  );
}
