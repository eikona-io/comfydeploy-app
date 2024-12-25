import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell } from "@/components/ui/table";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UsageGraph } from "@/components/usage/UsageGraph";
import { getDuration } from "@/lib/get-relative-time";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { type ReactNode, Suspense, memo, useMemo } from "react";

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
            <GPUTotalChargeCard />
          </Suspense>
          {/* <Suspense fallback={<Skeleton className="w-full h-[200px]" />}>
            <UsageTable />
          </Suspense> */}
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
            <UsageBreakdownMemo />
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
            <InvoiceTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

export function UsageBreakdown() {
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 180);
    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  }, []);

  const { data: usageInfo } = useSuspenseQuery<any>({
    queryKey: ["platform", "usage-details"],
    queryKeyHashFn: (queryKey) => [...queryKey, startDate, endDate].toString(),
    meta: {
      params: {
        start_time: startDate,
        end_time: endDate,
      },
    },
  });
  return <UsageGraph chartData={usageInfo} />;
}

const UsageBreakdownMemo = memo(UsageBreakdown);

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

export function DevelopmentOnly(props: { children: ReactNode }) {
  if (process.env.NODE_ENV === "development") return props.children;
  return <></>;
}

async function GPUTotalChargeCard() {
  const { data: usage } = useSuspenseQuery<any>({
    queryKey: ["platform", "usage"],
  });

  return (
    <Card className="flex flex-col p-4 gap-2">
      <div className="text-sm">
        Showing period {new Date(usage.period.start).toLocaleDateString()} -{" "}
        {new Date(usage.period.end).toLocaleDateString()}
      </div>
      <ScrollArea>
        <Table>
          <TableHeader className="bg-background top-0 sticky">
            <TableRow>
              <TableHead>Machine</TableHead>
              <TableHead>GPU</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usage.usage.map((x) => (
              <TableRow key={x.machine_id}>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger>
                      {x.cost_item_title ? (
                        <Badge>{x.cost_item_title}</Badge>
                      ) : (
                        <Link
                          className="hover:underline"
                          href={"/machines/" + x.machine_id}
                        >
                          {x.machine_name}{" "}
                          {x.ws_gpu && <Badge>Workspace</Badge>}
                        </Link>
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <div>{x.machine_id}</div>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>{x.gpu || x.ws_gpu}</TableCell>
                <TableCell>
                  {x.cost_item_title ? <></> : getDuration(x.usage_in_sec)}
                </TableCell>
                <TableCell>$ {x.cost.toFixed(4)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="font-bold">
                Total GPU Compute:
              </TableCell>
              <TableCell className="font-bold">
                $ {usage.total_cost.toFixed(4)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="font-bold">
                Plan Credit:
              </TableCell>
              <TableCell className="font-bold">
                - $ {usage.free_tier_credit / 100}
              </TableCell>
            </TableRow>
            {usage.credit > 0 && !Number.isNaN(usage.credit) && (
              <TableRow>
                <TableCell colSpan={3} className="font-bold">
                  Usage Credit:
                </TableCell>
                <TableCell className="font-bold">- $ {usage.credit}</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell colSpan={3} className="font-bold">
                Final Total:
              </TableCell>
              <TableCell className="font-bold">
                $ {usage.final_cost.toFixed(4)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}

export function UsageTable(props: {
  startTimeOverride?: Date;
  endTimeOverride?: Date;
}) {
  // const sub = await getCurrentPlanWithAuth();

  // const { userId, orgId } = await auth();
  // // if (!sub?.subscription_id) return null;
  // if (!userId) return null;

  // const {
  //   usage: usageDetails,
  //   startTime,
  //   endTime,
  // } = await getCurrentUsageDetails(
  //   props.startTimeOverride,
  //   props.endTimeOverride,
  // );

  // const totalCost = usageDetails.reduce(
  //   (sum, event) => sum + getGPUEventCost(event),
  //   0,
  // );

  const { data: usage } = useSuspenseQuery<any>({
    queryKey: ["platform", "usage"],
    meta: {
      params: {
        start_time: props.startTimeOverride?.toISOString(),
        end_time: props.endTimeOverride?.toISOString(),
      },
    },
  });

  return (
    <Card className="flex flex-col gap-2 p-4">
      <div className="flex flex-col gap-2">
        {/* <DevelopmentOnly>
          <SimulateChargeButton />
        </DevelopmentOnly> */}
        <ScrollArea>
          <Table className="">
            <TableHeader className="bg-background top-0 sticky">
              <TableRow>
                <TableHead>Machine</TableHead>
                <TableHead>GPU</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usage.usage.length > 0 ? (
                <>
                  {usage.usage.map((x) => (
                    <TableRow key={x.machine_id}>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            {x.cost_item_title ? (
                              <Badge>{x.cost_item_title}</Badge>
                            ) : (
                              <Link
                                className="hover:underline"
                                href={"/machines/" + x.machine_id}
                              >
                                {x.machine_name}{" "}
                                {x.ws_gpu && <Badge>Workspace</Badge>}
                              </Link>
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            <div> {x.machine_id}</div>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{x.gpu || x.ws_gpu}</TableCell>
                      <TableCell>
                        {x.cost_item_title ? (
                          <></>
                        ) : (
                          getDuration(x.usage_in_sec)
                        )}
                      </TableCell>
                      <TableCell>$ {x.cost.toFixed(4)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="font-bold text-right">
                      Total Usage:
                    </TableCell>
                    <TableCell className="font-bold">
                      $ {usage.total_cost.toFixed(4)}
                    </TableCell>
                  </TableRow>
                </>
              ) : (
                <div className="p-4">No usage in the last 30 days</div>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
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

function PlanTotal() {
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
                {sub.plans.charges?.[i] !== undefined &&
                sub.plans.amount?.[i] !== undefined &&
                sub.plans.charges[i] !== sub.plans.amount[i] ? (
                  <>
                    <span className="text-muted-foreground line-through">
                      ${(sub.plans.amount[i] ?? 0) / 100}
                    </span>
                    <span>${(sub.plans.charges[i] ?? 0) / 100}</span>
                  </>
                ) : (
                  `$${(sub.plans.amount[i] ?? 0) / 100}`
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

export async function InvoiceTable() {
  const { data: invoices } = useSuspenseQuery<any>({
    queryKey: ["platform", "invoices"],
  });

  return (
    <div className="space-y-4 w-full">
      {invoices.map((invoice) => (
        <InvoiceItem key={invoice.id} invoice={invoice}>
          {/* <div className=""> */}
          <UsageTable
            startTimeOverride={new Date(invoice.period_start)}
            endTimeOverride={new Date(invoice.period_end)}
          />
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Invoice Breakdown:</h3>
            <ul className="list-disc list-inside">
              {invoice.line_items.map((item, index) => (
                <li key={index}>
                  {item.description}: ${item.amount.toFixed(2)}
                  {item.quantity && item.quantity > 1
                    ? ` (x${item.quantity})`
                    : ""}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            {invoice.subtotal > invoice.total && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-${(invoice.subtotal - invoice.total).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold">
              <span>Total Due:</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
          </div>
          {/* <div className="mt-4 text-right">
              <span className="font-semibold">Subscription Plan: </span>
              {planName}
            </div> */}
          {/* </div> */}
        </InvoiceItem>
      ))}
    </div>
  );
}

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function InvoiceItem({
  invoice,
  children,
}: { invoice: any; children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-lg p-4">
      <button
        className="flex justify-between items-center w-full"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>
          {invoice.period_start} - {invoice.period_end}
        </span>
        <span className="transition-transform duration-300 ease-in-out transform">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded
            ? "max-h-[1000px] opacity-100 mt-4"
            : "max-h-0 opacity-0 mt-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
