import {
  BuildStepsUI,
  MachineBuildLog,
} from "@/components/machine/machine-build-log";
import {
  formatExactTime,
  formatShortDistanceToNow,
} from "@/components/machine/machine-deployment";
import { CPU_MEMORY_MAP } from "@/components/machines/machine-list-item";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useMachineVersion } from "@/hooks/use-machine";
import { getRelativeTime } from "@/lib/get-relative-time";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { differenceInSeconds } from "date-fns";
import {
  CircleArrowUp,
  Clock,
  ExternalLink,
  FileClock,
  HardDrive,
  Layers,
  Library,
  MemoryStick,
  RefreshCw,
  Thermometer,
  Ticket,
} from "lucide-react";
import { useMemo } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./machine-overview-style.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Button } from "../ui/button";

const ResponsiveGridLayout = WidthProvider(Responsive);

export function MachineVersionDetail({
  machineId,
  machineVersionId,
}: { machineId: string; machineVersionId: string }) {
  const { data: machine, isLoading } = useQuery<any>({
    queryKey: ["machine", machineId],
    refetchInterval: 5000,
  });
  const { data: machineVersion, isLoading: machineVersionLoading } =
    useMachineVersion(machineId, machineVersionId);
  const navigate = useNavigate();

  const defaultLayout = [
    { i: "buildLog", x: 0, y: 0, w: 2, h: 12 },
    { i: "info", x: 0, y: 2, w: 1, h: 4 },
    { i: "customNodes", x: 1, y: 2, w: 1, h: 11 },
    { i: "status", x: 0, y: 3, w: 1, h: 7 },
  ];

  console.log("machine status", machine?.status);

  if (isLoading || machineVersionLoading) return <div>Loading...</div>;

  return (
    <div className="mx-auto w-full max-w-[1500px] md:p-4">
      <h1 className="p-4 font-medium text-2xl">{machine.name}</h1>

      <Breadcrumb className="px-4 py-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() =>
                navigate({
                  to: "/machines/$machineId",
                  params: { machineId: machine.id },
                  search: { view: "deployments" },
                })
              }
              className="cursor-pointer"
            >
              Deployments
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>v{machineVersion.version}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: defaultLayout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 2, md: 2, sm: 1, xs: 1, xxs: 1 }}
        rowHeight={50}
        isResizable={false}
        isDraggable={false}
      >
        <div key="info">
          <MachineInfo machineVersion={machineVersion} />
        </div>
        <div key="status">
          <MachineOverviewStatus machineVersion={machineVersion} />
        </div>
        <div key="customNodes">
          <MachineCustomNodes machineVersion={machineVersion} />
        </div>
        <div key="buildLog">
          <MachineVersionBuildLog
            machine={machine}
            machineVersion={machineVersion}
          />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}

function MachineInfo({ machineVersion }: { machineVersion: any }) {
  return (
    <Card className="flex h-full flex-col rounded-[10px]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between font-semibold text-xl">
          Information
          <div className="flex items-center">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center">
        <div className="w-full space-y-1">
          <div className="flex flex-row items-center justify-between">
            <div className="font-medium text-sm">Version ID</div>
            <div className="max-w-[100px] truncate font-mono text-muted-foreground text-xs md:max-w-none">
              {machineVersion.id}
            </div>
          </div>

          {machineVersion.version && (
            <div className="flex flex-row items-center justify-between">
              <div className="font-medium text-sm">Version</div>
              <div className="font-mono">
                <Badge
                  variant="outline"
                  className="!font-semibold !text-[11px]"
                >
                  v{machineVersion.version}
                </Badge>
              </div>
            </div>
          )}

          <div className="flex flex-row items-center justify-between">
            <div className="font-medium text-sm">Type</div>
            <Badge variant={"outline"} className="!text-2xs !font-semibold">
              comfy-deploy-serverless
            </Badge>
          </div>

          <div className="flex flex-row items-center justify-between">
            <div className="font-medium text-sm">ComfyUI</div>
            <Link
              href={`https://github.com/comfyanonymous/ComfyUI/commit/${machineVersion.comfyui_version}`}
              target="_blank"
              className="flex flex-row items-center gap-1"
            >
              <span className="max-w-[100px] truncate font-mono text-muted-foreground text-xs md:max-w-none">
                {machineVersion.comfyui_version}
              </span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </Link>
          </div>

          <div className="flex flex-row items-center justify-between">
            <div className="font-medium text-sm">Created At</div>
            <div className="text-muted-foreground text-xs">
              {getRelativeTime(machineVersion.created_at)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MachineOverviewStatus({ machineVersion }: { machineVersion: any }) {
  const serverlessSpec = (
    <>
      <Separator className="my-4" />

      <h2 className="font-medium text-sm">Specifications</h2>

      <div className="grid grid-cols-2 py-2">
        <div className="flex flex-row items-center gap-2 p-0.5 font-medium text-sm">
          <HardDrive className="h-4 w-4" />
          {machineVersion.gpu}
        </div>
        <div className="flex flex-row items-center gap-2 p-0.5 font-medium text-sm">
          <MemoryStick className="h-4 w-4" />
          {machineVersion.gpu ? CPU_MEMORY_MAP[machineVersion.gpu] : ""}
        </div>
        <div className="col-span-2 flex flex-row items-center justify-between rounded-[4px] bg-gray-50 p-0.5 font-medium text-sm">
          <div className="flex items-center gap-2 font-medium text-xs">
            <Ticket className="h-4 w-4" /> Queue Per GPU
          </div>
          <div className="font-mono text-muted-foreground text-xs">
            {machineVersion.allow_concurrent_inputs}
          </div>
        </div>
        <div className="col-span-2 flex flex-row items-center justify-between p-0.5 font-medium text-sm">
          <div className="flex items-center gap-2 font-medium text-xs">
            <Layers className="h-4 w-4" /> Max Parallel GPU
          </div>
          <div className="font-mono text-muted-foreground text-xs">
            {machineVersion.concurrency_limit}
          </div>
        </div>
        <div className="col-span-2 flex flex-row items-center justify-between rounded-[4px] bg-gray-50 p-0.5 font-medium text-sm">
          <div className="flex items-center gap-2 font-medium text-xs">
            <Clock className="h-4 w-4" /> Workflow Timeout
          </div>
          <div className="font-mono text-muted-foreground text-xs">
            {machineVersion.run_timeout}s
          </div>
        </div>
        <div className="col-span-2 flex flex-row items-center justify-between p-0.5 font-medium text-sm">
          <div className="flex items-center gap-2 font-medium text-xs">
            <Thermometer className="h-4 w-4" /> Warm Time
          </div>
          <div className="font-mono text-muted-foreground text-xs">
            {machineVersion.idle_timeout}s
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Card className="h-full w-full rounded-[10px]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between font-semibold text-xl">
          Status
          <div className="flex items-center">
            {machineVersion.status === "building" ? (
              <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
            ) : machineVersion.status === "error" ? (
              <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            ) : (
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="py-2 font-medium text-sm">Builds</h2>
        <div className="flex flex-row items-center justify-between py-1">
          {machineVersion.status === "building" ? (
            <Badge variant={"yellow"}>Building</Badge>
          ) : machineVersion.status === "error" ? (
            <Badge variant={"red"}>Error</Badge>
          ) : (
            <Badge variant={"green"}>Ready</Badge>
          )}

          <p className="text-muted-foreground text-sm">
            <span className="text-sm text-gray-500 truncate">
              {machineVersion.status === "building"
                ? formatExactTime(
                    differenceInSeconds(
                      new Date(),
                      new Date(machineVersion.created_at),
                    ),
                  )
                : machineVersion.created_at === machineVersion.updated_at
                  ? "-"
                  : `${formatExactTime(
                      differenceInSeconds(
                        new Date(machineVersion.updated_at),
                        new Date(machineVersion.created_at),
                      ),
                    )} (${formatShortDistanceToNow(
                      new Date(machineVersion.updated_at),
                    )})`}
            </span>
          </p>
        </div>

        {serverlessSpec}
      </CardContent>
    </Card>
  );
}

function MachineCustomNodes({ machineVersion }: { machineVersion: any }) {
  const renderCard = (nodes: any[] = [], hasFailedNodes = false) => {
    const content = (
      <Card className="flex h-full w-full flex-col rounded-[10px]">
        <CardHeader className="flex-none pb-4">
          <CardTitle className="flex items-center justify-between font-semibold text-xl">
            Custom Nodes
            <div className="flex items-center">
              <Library className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          {nodes.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground text-sm">
              No custom nodes installed
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="flex flex-col">
                {nodes.map((node, index) => {
                  return (
                    <div
                      key={node.id}
                      className={cn(
                        "flex w-full flex-row items-center justify-between rounded-[4px] p-1 transition-all hover:bg-gray-100",
                        index % 2 === 1 && "bg-gray-50",
                        node.isFailed && "bg-red-50",
                      )}
                    >
                      <Link
                        className="flex flex-row items-center gap-2 text-sm"
                        onClick={() => {
                          window.open(
                            `${node.data.url}/commit/${node.data.hash}`,
                            "_blank",
                          );
                        }}
                      >
                        <span className="flex-1 truncate">
                          {node.data.name}
                        </span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>

                      <span className="hidden max-w-[100px] truncate font-mono text-2xs text-muted-foreground md:block">
                        {node.data.hash}
                      </span>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    );

    return content;
  };

  // Handle new format (docker_command_steps)
  if (machineVersion.docker_command_steps) {
    const failedNodePaths = useMemo(() => {
      try {
        return new Set(
          JSON.parse(machineVersion.import_failed_logs || "[]").map(
            (log: any) => {
              const match = log.logs.match(/: (.+)$/);
              return match ? match[1] : "";
            },
          ),
        );
      } catch (error) {
        console.error("Error parsing failed logs:", error);
        return new Set();
      }
    }, [machineVersion.import_failed_logs]);

    const customNodes = useMemo(() => {
      return machineVersion.docker_command_steps.steps
        .filter((node: any) => node.type === "custom-node")
        .map((node: any) => ({
          ...node,
          isFailed: failedNodePaths.has(
            `/comfyui/custom_nodes/${node.data?.url.split("/").pop()}`,
          ),
        }));
    }, [machineVersion.docker_command_steps.steps, failedNodePaths]);

    return renderCard(
      customNodes,
      customNodes.some((node: any) => node.isFailed),
    );
  }

  // Handle old format (dependencies)
  try {
    const dependencies =
      typeof machineVersion.dependencies === "string"
        ? JSON.parse(machineVersion.dependencies)
        : machineVersion.dependencies || {};

    const customNodes = Object.entries(dependencies.custom_nodes || {}).map(
      ([_, node]: [string, any]) => ({
        id: node.url,
        data: {
          url: node.url,
          hash: node.hash,
          name: node.name || node.url.split("/").pop(),
        },
      }),
    );

    return renderCard(customNodes);
  } catch (error) {
    console.error("Error parsing dependencies:", error);
    return renderCard();
  }
}

function MachineVersionBuildLog({
  machine,
  machineVersion,
}: { machine: any; machineVersion: any }) {
  const machineEndpoint = `${process.env.NEXT_PUBLIC_CD_API_URL}/api/machine`;

  return (
    <Card className="h-full rounded-[10px]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between font-semibold text-xl">
          Build Log
          <div className="flex items-center">
            <FileClock className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardTitle>
        <CardDescription>Machine build logs</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          {machineVersion.status === "building" ? (
            <MachineBuildLog
              machine={machine}
              instance_id={machine.build_machine_instance_id!}
              machine_id={machine.id}
              endpoint={machineEndpoint}
            />
          ) : machineVersion.build_log ? (
            <BuildStepsUI
              logs={JSON.parse(machineVersion.build_log ?? "")}
              machine={machineVersion}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No logs
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
