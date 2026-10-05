import type { Metadata } from "next";
import { PatientListFeature } from "@/features/patient/components/PatientListFeature";

export const metadata: Metadata = {
  title: "Data Pasien | DIBA Admin",
  description: "Kelola data pasien terdaftar di seluruh Puskesmas Aceh.",
};

export default function DataPasienPage() {
  return <PatientListFeature />;
}
