import { SurveyListFeature } from "@/features/survey/components/SurveyListFeature";

export const metadata = {
  title: "Survey Penelitian | DIBA Staff",
  description: "Lihat data survei dan respons peserta penelitian",
};

export default function StaffSurveyPage() {
  return <SurveyListFeature isStaff={true} />;
}
