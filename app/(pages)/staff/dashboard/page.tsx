import type { Metadata } from "next";
import { StaffDashboardFeature } from "@/features/staff-dashboard/components/StaffDashboardFeature";

export const metadata: Metadata = {
  title: "Dashboard Pemantauan | DIBA Staff",
  description: "Dashboard statistik dan pemantauan kesehatan populasi pasien diabetes.",
};

export default function StaffDashboardPage() {
  return <StaffDashboardFeature />;
}
