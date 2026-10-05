import type { Metadata } from "next";
import { RecordMonitoringFeature } from "@/features/record-monitoring/components/RecordMonitoringFeature";

export const metadata: Metadata = {
  title: "Monitoring Record Pasien | DIBA Admin",
  description: "Pantau aktivitas harian dan catatan kesehatan seluruh pasien.",
};

export default function PemantauanCatatanPasienPage() {
  return <RecordMonitoringFeature />;
}
