import type { Metadata } from "next";
import { SettingsFeature } from "@/features/settings/components/SettingsFeature";

export const metadata: Metadata = {
  title: "Pengaturan | DIBA Staff",
  description: "Kelola pengaturan akun Anda.",
};

export default function StaffSettingsPage() {
  return <SettingsFeature />;
}
