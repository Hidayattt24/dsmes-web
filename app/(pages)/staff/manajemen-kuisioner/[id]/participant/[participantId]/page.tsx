import type { Metadata } from "next";
import { ParticipantQuizDetailFeature } from "@/features/quiz/components/ParticipantQuizDetailFeature";

export const metadata: Metadata = {
  title: "Hasil Kuesioner Pasien | DIBA Staff",
  description: "Pantau rincian hasil jawaban kuesioner pasien.",
};

interface StaffParticipantQuizDetailPageProps {
  readonly params: Promise<{
    readonly id: string;
    readonly participantId: string;
  }>;
}

export default async function StaffParticipantQuizDetailPage({
  params,
}: StaffParticipantQuizDetailPageProps) {
  const { id, participantId } = await params;
  return <ParticipantQuizDetailFeature quizId={id} participantId={participantId} />;
}
