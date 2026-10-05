import type { Metadata } from "next";
import { SettingsFeature } from "@/features/settings/components/SettingsFeature";

export const metadata: Metadata = {
  title: "Pengaturan | DIBA Admin",
  description: "Pengaturan akun dan preferensi sistem DIBA.",
};

export default function PengaturanPage() {
  return <SettingsFeature />;
}
