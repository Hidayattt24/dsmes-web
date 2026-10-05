import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { DetailPageLoader } from "@/components/ui/loading";

const EducationProgressFeature = dynamic(
  () => import("@/features/education/components/EducationProgressFeature").then((mod) => mod.EducationProgressFeature),
  {
    loading: () => <DetailPageLoader type="education" />,
  }
);

export const metadata: Metadata = {
  title: "Progress Edukasi | DIBA Staff",
  description: "Pantau perkembangan belajar dan ulasan peserta untuk materi edukasi.",
};

interface StaffEducationProgressPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function StaffEducationProgressPage({ params }: StaffEducationProgressPageProps) {
  const { id } = await params;
  return <EducationProgressFeature articleId={id} />;
}
