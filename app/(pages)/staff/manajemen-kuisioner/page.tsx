import type { Metadata } from "next";
import { QuizListFeature } from "@/features/quiz/components/QuizListFeature";

export const metadata: Metadata = {
  title: "Pemantauan Kuesioner | DIBA Staff",
  description: "Pantau kuesioner edukasi pasien.",
};

export default function StaffQuizListPage() {
  return <QuizListFeature />;
}
