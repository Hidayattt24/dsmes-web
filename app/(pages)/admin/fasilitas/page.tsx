import type { Metadata } from "next";
import { FacilityFeature } from "@/features/facility/components/FacilityFeature";

export const metadata: Metadata = {
  title: "Data Puskesmas | DIBA Admin",
  description: "Kelola daftar puskesmas untuk pengelompokan data pasien dan staff.",
};

export default function FacilityPage() {
  return <FacilityFeature />;
}
