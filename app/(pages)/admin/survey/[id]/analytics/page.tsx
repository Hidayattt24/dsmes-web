import { Suspense } from "react";
import { SurveyAnalyticsFeature } from "@/features/survey/components/SurveyAnalyticsFeature";
import { DetailPageLoader } from "@/components/ui/loading/DetailPageLoader";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Analitik & Respons Survey | DSMES Admin",
  description: "Laporan analitik dan pengunduhan respons survei",
};

export default async function AdminSurveyAnalyticsPage({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<DetailPageLoader type="record" />}>
      <SurveyAnalyticsFeature surveyId={resolvedParams.id} isStaff={false} />
    </Suspense>
  );
}
