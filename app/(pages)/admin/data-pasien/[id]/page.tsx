import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { DetailPageLoader } from "@/components/ui/loading";

const PatientDetailFeature = dynamic(
  () => import("@/features/patient/components/PatientDetailFeature").then((mod) => mod.PatientDetailFeature),
  {
    loading: () => <DetailPageLoader type="patient" />,
  }
);

export const metadata: Metadata = {
  title: "Detail Pasien | DIBA Admin",
  description: "Detail profil dan data keanggotaan pasien DIBA.",
};

interface PatientDetailPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { id } = await params;
  return <PatientDetailFeature patientId={id} />;
}
