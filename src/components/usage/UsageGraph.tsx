"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { machineGPUOptions } from "../machine/machine-schema";

const chartConfig = {
  views: {
    label: "GPU Usage",
  },
  ...Object.fromEntries(
    machineGPUOptions.map((gpu) => [
      gpu,
      {
        label: gpu,
        color: `var(--color-gpu-${gpu})`,
      },
    ]),
  ),
} satisfies ChartConfig;

export function UsageGraph({
  chartData,
}: {
  chartData: any[];
}) {
  console.log(chartConfig);
  return (
    // <Card>
    //   <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
    //     <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
    //       <CardTitle>GPU Usage - Daily Breakdown</CardTitle>
    //       <CardDescription>Showing GPU usage costs per day</CardDescription>
    //     </div>
    //   </CardHeader>
    //   <CardContent className="px-2 sm:p-6">
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[250px] w-full"
    >
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-[150px] dolloar"
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        {machineGPUOptions.map((gpu) => (
          <Bar
            key={gpu}
            dataKey={gpu}
            stackId="a"
            fill={`var(--color-${gpu})`}
            radius={[0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ChartContainer>
    //   </CardContent>
    // </Card>
  );
}
