import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UsageGraph } from "@/components/usage/UsageGraph";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/usage")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mt-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-[800px] p-4">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Plan</CardTitle>
              <CardDescription>View you account usage</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm">
          <Suspense fallback={<Skeleton className="h-[28px] w-full" />}>
            <PlanTotal />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-[28px] w-full" />}>
            <Credit />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-[100px] w-full" />}>
            {/* <LegacyUI /> */}
          </Suspense>
        </CardContent>
      </Card>
      <Card className="mt-4 w-full max-w-[800px] p-4">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Machine Usage</CardTitle>
              <CardDescription>
                View GPU compute per machine (last 30 days) - The cost is an
                estimate, we are still refining the usage and billing system.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm flex flex-col gap-4">
          <Suspense fallback={<Skeleton className="w-full h-[100px]" />}>
            {/* <GPUTotalChargeCard /> */}
          </Suspense>
          <Suspense fallback={<Skeleton className="w-full h-[200px]" />}>
            {/* <UsageTable /> */}
          </Suspense>
        </CardContent>
      </Card>
      <Card className="mt-4 p-4 w-full max-w-[800px]">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Breakdown</CardTitle>
              <CardDescription>
                View your usage over the last 180 days
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm flex flex-col gap-4">
          <Suspense fallback={<Skeleton className="w-full h-[200px]" />}>
            <UsageBreakdown />
          </Suspense>
        </CardContent>
      </Card>
      <Card className="mt-4 p-4 w-full max-w-[800px]">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>View your invoices</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm flex flex-col gap-4">
          <Suspense fallback={<Skeleton className="w-full h-[200px]" />}>
            {/* <InvoiceTable /> */}
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

export function UsageBreakdown() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 180);
  const { data: usageInfo } = useSuspenseQuery<any>({
    queryKey: ["platform", "usage-details"],
    meta: {
      params: {
        start_time: thirtyDaysAgo.toISOString(),
        end_time: new Date().toISOString(),
      },
    },
  });
  return <UsageGraph chartData={usageInfo} />;
}

async function Credit() {
  const { data: userSettings, isLoading } = useSuspenseQuery<any>({
    queryKey: ["platform", "user-settings"],
  });

  if (isLoading) return null;

  return (
    <Card className="flex flex-col gap-2 p-4">
      <div className="flex flex-wrap justify-between gap-2">
        <Badge>Usage Credit</Badge>
        <div className="flex gap-2">${userSettings.credit}</div>
      </div>
    </Card>
  );
}

export const pricingPlanNameMapping = {
  ws_basic: "Workspace Basic",
  ws_pro: "Workspace Pro",
  pro: "API Pro (Early Adopter)",
  creator: "API Creator (Early Adopter)",
  business: "API Business",
  basic: "API Basic",
} as const;

async function PlanTotal() {
  const { data: sub } = useSuspenseQuery<any>({
    queryKey: ["platform", "plan"],
  });

  if (!sub || !pricingPlanNameMapping) return null;

  return (
    <>
      {sub ? (
        sub?.plans?.plans.map((x, i) => (
          <Card key={i} className="flex flex-col gap-2 p-4">
            <div className="flex flex-wrap justify-between gap-2">
              <Badge className="w-fit px-3 capitalize hover:underline">
                <Link
                  href={"/api/stripe/dashboard"}
                  className="flex items-center gap-2"
                >
                  {pricingPlanNameMapping[x]} Plan
                  <ExternalLink size={16} />
                </Link>
              </Badge>
              <div className="flex gap-2">
                {sub.charges?.[i] !== undefined &&
                sub.amount?.[i] !== undefined &&
                sub.charges[i] !== sub.amount[i] ? (
                  <>
                    <span className="text-muted-foreground line-through">
                      ${(sub.amount[i] ?? 0) / 100}
                    </span>
                    <span>${(sub.charges[i] ?? 0) / 100}</span>
                  </>
                ) : (
                  `$${(sub.amount?.[i] ?? 0) / 100}`
                )}
                {" / month"}
              </div>
            </div>
          </Card>
        ))
      ) : (
        <Card className="flex flex-col gap-2 p-4">
          <div className="flex flex-wrap justify-between gap-2">
            <Badge className="w-fit px-3 capitalize">Free Plan</Badge>
            <div className="flex gap-2">$0 / month</div>
          </div>
        </Card>
      )}
    </>
  );
}
