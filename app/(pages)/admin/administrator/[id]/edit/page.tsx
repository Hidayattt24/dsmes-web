import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { FormLoader } from "@/components/ui/loading";

const AdministratorFormFeature = dynamic(
  () => import("@/features/staff-management/components/AdministratorFormFeature").then((mod) => mod.AdministratorFormFeature),
  {
    loading: () => <FormLoader />,
  }
);

export const metadata: Metadata = {
  title: "Edit Staff Monitoring | DIBA Admin",
  description: "Edit data akun staff monitoring.",
};

interface EditAdministratorPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function EditAdministratorPage({ params }: EditAdministratorPageProps) {
  const { id } = await params;
  return <AdministratorFormFeature adminId={id} />;
}
