import type { Metadata } from "next";
import { EducationFormFeature } from "@/features/education/components/EducationFormFeature";

export const metadata: Metadata = {
  title: "Tambah Edukasi | DIBA Admin",
  description: "Buat artikel edukasi pasien baru.",
};

export default function CreateEducationPage() {
  return <EducationFormFeature />;
}
