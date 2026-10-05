import type { Metadata } from "next";
import { EducationListFeature } from "@/features/education/components/EducationListFeature";

export const metadata: Metadata = {
  title: "Manajemen Edukasi | DIBA Staff",
  description: "Pantau artikel, modul, materi edukasi, dan progres belajar pasien.",
};

export default function StaffEducationListPage() {
  return <EducationListFeature />;
}
