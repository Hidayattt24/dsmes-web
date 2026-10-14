"use client";

import type { PatientRecord } from "../types/record";

interface RecordPatientProfileCardProps {
  readonly patient: PatientRecord;
}

function formatWhatsApp(num?: string) {
  if (!num || num === "-") return "-";
  const clean = num.trim();
  if (clean.startsWith("+62")) return clean;
  if (clean.startsWith("62")) return `+${clean}`;
  if (clean.startsWith("0")) return `+62${clean.slice(1)}`;
  return `+62${clean}`;
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  const displayValue = value === "" || value === undefined || value === null ? "-" : String(value);
  return (
    <div className="bg-[#F8F9FA] p-4 rounded-lg border border-[#E2E8F0]/30 min-w-0 overflow-hidden">
      <p className="text-[#718096] text-[10px] uppercase font-bold tracking-widest mb-1 flex items-center gap-1.5 font-[family-name:var(--font-poppins)]">
        <span className="material-symbols-outlined text-[14px] shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
      </p>
      <p className="font-medium text-[#1A202C] text-sm font-[family-name:var(--font-poppins)] break-all sm:break-words leading-relaxed" title={displayValue}>
        {displayValue}
      </p>
    </div>
  );
}

export function RecordPatientProfileCard({ patient }: RecordPatientProfileCardProps) {
  const genderIcon = patient.gender === "Laki-laki" ? "male" : "female";

  return (
    <div className="space-y-6">
      {/* Avatar + Sidebar Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 premium-card p-8 flex flex-col items-center text-center justify-center min-h-[350px]">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full border-2 border-[#00695C]/20 p-1.5">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#F4F6F8] shadow-inner flex items-center justify-center">
                {patient.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={patient.avatarUrl}
                    alt={patient.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-bold text-3xl text-[#00695C] select-none">
                    {patient.initials}
                  </span>
                )}
              </div>
            </div>
            {patient.accountStatus === "Terverifikasi" && (
              <div className="absolute -bottom-1 right-2 w-8 h-8 bg-[#00695C] rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
            )}
          </div>

          <h3 className="font-semibold text-2xl text-[#1A202C] mb-1 font-[family-name:var(--font-poppins)]">
            {patient.name}
          </h3>
          <div className="px-4 py-1 bg-[#00695C]/5 rounded-full border border-[#00695C]/10 mb-6">
            <p className="text-[#00695C] font-semibold text-xs tracking-wide font-[family-name:var(--font-poppins)]">
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
                Kepatuhan Hari Ini: {patient.todayComplianceLabel || patient.complianceLabel || (patient.compliance >= 75 ? "Patuh" : "Kurang")} ({patient.todayCompliance ?? patient.compliance}%)
              </span>
            </div>
            {typeof patient.weeklyCompliance === "number" && (
              <p className="text-[10px] font-semibold text-[#718096] text-center">
                Konsistensi 7 Hari: {Math.round(patient.weeklyCompliance)}%
                {patient.weeklyComplianceLabel ? ` (${patient.weeklyComplianceLabel})` : ""}
              </p>
            )}

            {(patient.todayComplianceBreakdown ?? patient.complianceBreakdown) && (
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-semibold text-[#718096] pt-1">
                <div className="bg-[#F8FAFC] px-2 py-1 rounded border border-[#E2E8F0] flex justify-between">
                  <span>Gula Darah:</span>
                  <span className="font-bold text-[#00695C]">{(patient.todayComplianceBreakdown ?? patient.complianceBreakdown)!.bloodSugarScore} pts</span>
                </div>
                <div className="bg-[#F8FAFC] px-2 py-1 rounded border border-[#E2E8F0] flex justify-between">
                  <span>Makanan:</span>
                  <span className="font-bold text-[#B45309]">{(patient.todayComplianceBreakdown ?? patient.complianceBreakdown)!.foodScore} pts</span>
                </div>
                <div className="bg-[#F8FAFC] px-2 py-1 rounded border border-[#E2E8F0] flex justify-between">
                  <span>Aktivitas:</span>
                  <span className="font-bold text-[#166534]">{(patient.todayComplianceBreakdown ?? patient.complianceBreakdown)!.activityScore} pts</span>
                </div>
                <div className="bg-[#F8FAFC] px-2 py-1 rounded border border-[#E2E8F0] flex justify-between">
                  <span>Obat:</span>
                  <span className="font-bold text-[#2B6CB0]">{(patient.todayComplianceBreakdown ?? patient.complianceBreakdown)!.medicationScore} pts</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Personal Identity */}
        <div className="lg:col-span-8 premium-card p-6 sm:p-8 flex flex-col justify-center min-h-[350px]">
          <h4 className="font-semibold text-lg text-[#1A202C] mb-6 sm:mb-8 font-[family-name:var(--font-poppins)]">
            Informasi Personal
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            <InfoRow icon="person" label="Nama" value={patient.name} />
            <InfoRow icon="calendar_today" label="Umur" value={`${patient.age} Tahun`} />
            <InfoRow icon="chat" label="WhatsApp" value={formatWhatsApp(patient.whatsapp)} />
            <InfoRow icon={genderIcon} label="Jenis Kelamin" value={patient.gender} />
            <InfoRow icon="fitness_center" label="Tinggi / BB" value={`${patient.height} cm / ${patient.weight} kg`} />
            <InfoRow icon="bloodtype" label="Gol. Darah" value={patient.bloodType} />
            <InfoRow icon="event" label="Registrasi" value={patient.registeredAt} />
            <InfoRow icon="cake" label="Tanggal Lahir" value={patient.dateOfBirth} />
            <InfoRow icon="email" label="Email" value={patient.email} />
            <InfoRow icon="home" label="Alamat" value={patient.address} />
            <InfoRow icon="local_hospital" label="Puskesmas" value={patient.puskesmas} />
            <InfoRow icon="map" label="Kecamatan" value={patient.district} />
            <InfoRow icon="location_city" label="Kota" value={patient.city} />
            <InfoRow icon="school" label="Pendidikan" value={patient.educationLevel} />
            <InfoRow icon="groups" label="Tinggal Bersama" value={patient.livingArrangement} />
            <InfoRow icon="schedule" label="Durasi Diabetes" value={patient.diabetesDuration} />
            <InfoRow icon="directions_walk" label="Aktivitas Fisik" value={patient.physicalActivityLevel} />
          </div>
        </div>
      </div>

    </div>
  );
}
