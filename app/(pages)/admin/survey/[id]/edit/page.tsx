import { Suspense } from "react";
import { SurveyFormFeature } from "@/features/survey/components/SurveyFormFeature";
import { FormSkeleton } from "@/components/ui/loading/FormSkeleton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Survey | DSMES Admin",
  description: "Edit detail dan pertanyaan survei",
};

export default async function AdminSurveyEditPage({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<FormSkeleton />}>
      <SurveyFormFeature surveyId={resolvedParams.id} />
    </Suspense>
  );
}
