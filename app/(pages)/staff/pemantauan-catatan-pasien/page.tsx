import type { Metadata } from "next";
import { RecordMonitoringFeature } from "@/features/record-monitoring/components/RecordMonitoringFeature";

export const metadata: Metadata = {
  title: "Catatan Pasien | DIBA Staff",
  description: "Pantau catatan kesehatan harian pasien.",
};

export default function StaffRecordMonitoringPage() {
  return <RecordMonitoringFeature />;
}
