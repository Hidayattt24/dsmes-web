import type { Metadata } from "next";
import { QuizDetailFeature } from "@/features/quiz/components/QuizDetailFeature";

export const metadata: Metadata = {
  title: "Detail Kuesioner | DIBA Staff",
  description: "Pantau rincian hasil kuesioner pasien.",
};

interface QuizDetailPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function StaffQuizDetailPage({ params }: QuizDetailPageProps) {
  const { id } = await params;
  return <QuizDetailFeature quizId={id} />;
}
