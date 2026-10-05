import type { Metadata } from "next";
import { RecordDetailFeature } from "@/features/record-monitoring/components/RecordDetailFeature";

export const metadata: Metadata = {
  title: "Detail Catatan Pasien | DIBA Staff",
  description: "Detail catatan kesehatan harian pasien.",
};

interface RecordDetailPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function StaffRecordDetailPage({ params }: RecordDetailPageProps) {
  const { id } = await params;
  return <RecordDetailFeature patientId={id} />;
}
