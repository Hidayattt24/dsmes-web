import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { DetailPageLoader } from "@/components/ui/loading";

const EducationDetailFeature = dynamic(
  () => import("@/features/education/components/EducationDetailFeature").then((mod) => mod.EducationDetailFeature),
  {
    loading: () => <DetailPageLoader type="education" />,
  }
);

export const metadata: Metadata = {
  title: "Detail Edukasi | DIBA Staff",
  description: "Detail konten materi edukasi dan statistik pembaca.",
};

interface StaffEducationDetailPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function StaffEducationDetailPage({ params }: StaffEducationDetailPageProps) {
  const { id } = await params;
  return <EducationDetailFeature articleId={id} />;
}
