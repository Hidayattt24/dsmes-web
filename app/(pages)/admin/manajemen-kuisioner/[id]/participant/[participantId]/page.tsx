import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { DetailPageLoader } from "@/components/ui/loading";

const ParticipantQuizDetailFeature = dynamic(
  () =>
    import("@/features/quiz/components/ParticipantQuizDetailFeature").then(
      (mod) => mod.ParticipantQuizDetailFeature
    ),
  {
    loading: () => <DetailPageLoader type="patient" />,
  }
);

export const metadata: Metadata = {
  title: "Detail Hasil Kuesioner Pasien | DIBA Admin",
  description: "Rincian jawaban kuesioner dan analisis evaluasi belajar pasien.",
};

interface ParticipantQuizDetailPageProps {
  readonly params: Promise<{
    readonly id: string;
    readonly participantId: string;
  }>;
}

export default async function ParticipantQuizDetailPage({
  params,
}: ParticipantQuizDetailPageProps) {
  const { id, participantId } = await params;
  return <ParticipantQuizDetailFeature quizId={id} participantId={participantId} />;
}
