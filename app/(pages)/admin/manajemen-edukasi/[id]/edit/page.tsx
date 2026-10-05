import type { Metadata } from "next";
import { EducationFormFeature } from "@/features/education/components/EducationFormFeature";

export const metadata: Metadata = {
  title: "Edit Edukasi | DIBA Admin",
  description: "Edit artikel edukasi pasien.",
};

interface EditEducationPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function EditEducationPage({ params }: EditEducationPageProps) {
  const { id } = await params;
  return <EducationFormFeature articleId={id} />;
}
