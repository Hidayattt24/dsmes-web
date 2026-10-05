import type { Metadata } from "next";
import { FoodFormFeature } from "@/features/data-food/components/FoodFormFeature";

export const metadata: Metadata = {
  title: "Edit Data Makanan | DIBA Admin",
  description: "Ubah rincian dan nilai gizi data makanan DIBA",
};

interface EditFoodPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function EditFoodPage({ params }: EditFoodPageProps) {
  const { id } = await params;
  return <FoodFormFeature foodId={id} />;
}
