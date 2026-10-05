import { Suspense } from "react";
import { SurveyFormFeature } from "@/features/survey/components/SurveyFormFeature";
import { FormSkeleton } from "@/components/ui/loading/FormSkeleton";

export const metadata = {
  title: "Buat Survey Baru | DIBA Admin",
  description: "Buat instrumen survey penelitian baru",
};

export default function AdminSurveyCreatePage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <SurveyFormFeature />
    </Suspense>
  );
}
