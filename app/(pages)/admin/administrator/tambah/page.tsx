import type { Metadata } from "next";
import { AdministratorFormFeature } from "@/features/staff-management/components/AdministratorFormFeature";

export const metadata: Metadata = {
  title: "Tambah Staff Monitoring | DIBA Admin",
  description: "Tambah akun staff monitoring baru.",
};

export default function CreateAdministratorPage() {
  return <AdministratorFormFeature />;
}
