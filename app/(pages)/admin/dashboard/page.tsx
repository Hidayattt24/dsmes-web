import type { Metadata } from "next";
import { DashboardStatistics } from "@/features/dashboard/components/DashboardStatistics";
import { DashboardCharts }     from "@/features/dashboard/components/DashboardCharts";
import { DashboardArticleTable } from "@/features/dashboard/components/DashboardArticleTable";

export const metadata: Metadata = {
  title: "Dashboard | DIBA Admin",
  description: "Ringkasan statistik, aktivitas pengguna, dan artikel edukasi terpopuler.",
};

export default function DashboardPage() {
  return (
    <section className="space-y-8 max-w-[1600px] mx-auto w-full">
      <div>
        <h2 className="text-2xl font-bold text-[#1A202C] tracking-tight font-[family-name:var(--font-poppins)]">
          Dashboard Ringkasan
        </h2>
        <p className="text-sm text-[#718096] mt-1 font-[family-name:var(--font-poppins)]">
          Selamat datang kembali — berikut data statistik terkini untuk DIBA.
        </p>
      </div>
      <DashboardStatistics />
      <DashboardCharts />
      <DashboardArticleTable />
    </section>
  );
}
