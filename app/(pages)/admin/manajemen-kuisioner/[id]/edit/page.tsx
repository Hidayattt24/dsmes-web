import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { FormLoader } from "@/components/ui/loading";

const QuizFormFeature = dynamic(
  () => import("@/features/quiz/components/QuizFormFeature").then((mod) => mod.QuizFormFeature),
  {
    loading: () => <FormLoader />,
  }
);

export const metadata: Metadata = {
  title: "Edit Kuesioner | DIBA Admin",
  description: "Ubah rincian pertanyaan dan konfigurasi kuesioner.",
};

interface EditQuizPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function EditQuizPage({ params }: EditQuizPageProps) {
  const { id } = await params;
  return <QuizFormFeature quizId={id} />;
}
