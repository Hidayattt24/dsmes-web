import { SurveyDetailFeature } from "@/features/survey/components/SurveyDetailFeature";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Detail Survey | DIBA Staff",
  description: "Lihat detail instrumen survei",
};

export default async function StaffSurveyDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <SurveyDetailFeature surveyId={resolvedParams.id} isStaff={true} />;
}
