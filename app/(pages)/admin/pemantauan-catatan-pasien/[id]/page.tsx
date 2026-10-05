import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { DetailPageLoader } from "@/components/ui/loading";

const RecordDetailFeature = dynamic(
  () => import("@/features/record-monitoring/components/RecordDetailFeature").then((mod) => mod.RecordDetailFeature),
  {
    loading: () => <DetailPageLoader type="record" />,
  }
);

export const metadata: Metadata = {
  title: "Detail Monitoring Record Pasien | DIBA Admin",
  description: "Detail riwayat aktivitas harian dan catatan kesehatan pasien.",
};

interface RecordDetailPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function RecordDetailPage({ params }: RecordDetailPageProps) {
  const { id } = await params;
  return <RecordDetailFeature patientId={id} />;
}
