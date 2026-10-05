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
  title: "Tambah Kuesioner Baru | DIBA Admin",
  description: "Tambah kuesioner baru untuk materi edukasi.",
};

export default function TambahKuisionerPage() {
  return <QuizFormFeature />;
}
