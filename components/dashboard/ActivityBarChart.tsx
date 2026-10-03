"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Rectangle } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ActivityDataPoint } from "@/types/dashboard";

interface ActivityBarChartProps {
  readonly data: ActivityDataPoint[];
  readonly totalLabel: string;
}

const chartConfig = {
  value: {
    label: "Pengguna Aktif",
    color: "#00695C",
  },
} satisfies ChartConfig;

const BarWithBorderTop = (props: any) => {
  const { width, height } = props;
  if (!width || !height) return null;
  const radius = Math.min(14, width / 2);
  return (
    <Rectangle
      {...props}
      fill="#00695C"
      radius={[radius, radius, 0, 0]}
    />
  );
};

export function ActivityBarChart({
  data,
  totalLabel,
}: ActivityBarChartProps) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col h-full font-[family-name:var(--font-poppins)]">
      {/* Chart header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#1A202C]">Aktivitas Pengguna</h3>
          <p className="text-xs text-[#718096] mt-1 font-semibold uppercase tracking-wider">
            7 Hari Terakhir
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#00695C]">{totalLabel}</p>
          <span className="text-[11px] text-[#718096] font-medium">Total Interaksi</span>
        </div>
      </div>

      {/* Chart Main Area */}
      <div className="flex-1 w-full min-h-[260px] relative">
        <ChartContainer config={chartConfig} className="h-68 w-full">
          <BarChart
            accessibilityLayer
            data={data}
            barSize={28}
            margin={{ top: 12, right: 12, left: -20, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "#718096", fontSize: 12, fontWeight: 600 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
              domain={[0, (dataMax: number) => (dataMax <= 5 ? 5 : Math.ceil(dataMax * 1.25))]}
              tick={{ fill: "#718096", fontSize: 11, fontWeight: 600 }}
              tickFormatter={(val: number) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toString())}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="value"
              fill="#00695C"
              radius={[14, 14, 0, 0]}
              shape={<BarWithBorderTop />}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
