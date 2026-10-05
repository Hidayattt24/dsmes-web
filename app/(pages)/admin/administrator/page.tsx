import type { Metadata } from "next";
import { AdministratorFeature } from "@/features/staff-management/components/AdministratorFeature";

export const metadata: Metadata = {
  title: "Staff | DIBA Admin",
  description: "Kelola hak akses dan akun monitoring staff.",
};

export default function AdministratorPage() {
  return <AdministratorFeature />;
}
