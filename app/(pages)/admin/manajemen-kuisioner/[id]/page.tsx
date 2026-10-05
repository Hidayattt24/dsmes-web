import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { DetailPageLoader } from "@/components/ui/loading";

const QuizDetailFeature = dynamic(
  () => import("@/features/quiz/components/QuizDetailFeature").then((mod) => mod.QuizDetailFeature),
  {
    loading: () => <DetailPageLoader type="patient" />, // Matches general details skeleton layout
  }
);

export const metadata: Metadata = {
  title: "Detail Kuesioner | DIBA Admin",
  description: "Lihat rincian pertanyaan dan konfigurasi kuesioner.",
};

interface QuizDetailPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
  const { id } = await params;
  return <QuizDetailFeature quizId={id} />;
}
