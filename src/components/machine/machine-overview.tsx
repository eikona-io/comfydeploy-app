import {
  CPU_MEMORY_MAP,
  MachineListItemEvents,
  getLastActiveText,
  isMachineDeprecated,
  useHasActiveEvents,
} from "@/components/machines/machine-list-item";
import { MachineStatus } from "@/components/machines/machine-status";
import { ShineBorder } from "@/components/magicui/shine-border";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMachineEvents } from "@/hooks/use-machine";
import { getRelativeTime } from "@/lib/get-relative-time";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { differenceInMilliseconds, max } from "date-fns";
import {
  Activity,
  AlertCircle,
  Box,
  CheckCircle2,
  CircleArrowUp,
  Clock,
  Edit,
  ExternalLink,
  FileClock,
  GitBranch,
  HardDrive,
  Layers,
  Library,
  LineChart,
  Loader2,
  MemoryStick,
  Pause,
  RefreshCw,
  Table as TableIcon,
  Thermometer,
  Ticket,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./machine-overview-style.css";
import { api } from "@/lib/api";
import { callServerPromise } from "@/lib/call-server-promise";
import { toast } from "sonner";
import { BuildStepsUI } from "./machine-build-log";

const ResponsiveGridLayout = WidthProvider(Responsive);

// -----------------------hooks-----------------------

const calculateTotalUpEventTime = (events: any[] | undefined): string => {
  if (!events || events.length === 0) return "Never";

  const eventTimes = events.map((event) => ({
    start: event.start_time ? new Date(event.start_time) : null,
    end: event.end_time ? new Date(event.end_time) : new Date(),
  }));

  eventTimes.sort(
    (a, b) => (a.start?.getTime() || 0) - (b.start?.getTime() || 0),
  );

  let totalDuration = 0;
  let currentStart: Date | null = null;
  let currentEnd: Date | null = null;

  for (const { start, end } of eventTimes) {
    if (!start) continue;

    if (!currentStart || (currentEnd && start > currentEnd)) {
      if (currentStart && currentEnd) {
        totalDuration += differenceInMilliseconds(currentEnd, currentStart);
      }
      currentStart = start;
      currentEnd = end;
    } else if (currentEnd) {
      currentEnd = max([currentEnd, end]);
    }
  }

  if (currentStart && currentEnd) {
    totalDuration += differenceInMilliseconds(currentEnd, currentStart);
  }

  const totalSeconds = Math.floor(totalDuration / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.join(" ") || "0s";
};

function getFromLS(key: string) {
  if (typeof window !== "undefined") {
    const ls = JSON.parse(localStorage.getItem("machine-layouts") || "{}");
    return ls[key];
  }
  return null;
}

function saveToLS(key: string, value: any) {
  if (typeof window !== "undefined") {
    const ls = JSON.parse(localStorage.getItem("machine-layouts") || "{}");
    ls[key] = value;
    localStorage.setItem("machine-layouts", JSON.stringify(ls));
  }
}

function deleteFromLS(key: string) {
  if (typeof window !== "undefined") {
    const ls = JSON.parse(localStorage.getItem("machine-layouts") || "{}");
    delete ls[key];
    localStorage.setItem("machine-layouts", JSON.stringify(ls));
  }
}

// -----------------------components-----------------------

export function MachineOverview({
  machine,
  setView,
}: {
  machine: any;
  setView: (view: "settings" | "deployments" | undefined) => void;
}) {
  const defaultLayout = [
    { i: "info", x: 0, y: 0, w: 1, h: 4, maxH: 4, minH: 4 },
    { i: "status", x: 1, y: 0, w: 1, h: 9, maxH: 9, minH: 9 },
    { i: "customNodes", x: 0, y: 1, w: 1, h: 6, maxH: 12, minH: 4 },
    { i: "workflowDeployment", x: 0, y: 2, w: 1, h: 6, maxH: 12, minH: 6 },
    { i: "containerGraph", x: 1, y: 1, w: 1, h: 7, maxH: 8, minH: 7 },
    { i: "containerTable", x: 1, y: 2, w: 2, h: 8, maxH: 16, minH: 8 },
    { i: "buildLog", x: 0, y: 3, w: 2, h: 12, maxH: 12, minH: 12 },
  ];

  const [layout, setLayout] = useState(() => {
    const savedLayout = getFromLS(machine.id);
    return savedLayout || defaultLayout;
  });
  const [isEditingLayout, setIsEditingLayout] = useState(false);
  const navigate = useNavigate();

  const handleLayoutChange = (newLayout: any) => {
    if (!isEditingLayout) return;
    setLayout(newLayout);
  };

  const isDeprecated = isMachineDeprecated(machine);
  const isDockerCommandStepsNull =
    machine?.docker_command_steps === null &&
    machine.type === "comfy-deploy-serverless";

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between px-4 py-2">
        <div
          className={cn("flex flex-row gap-2", isEditingLayout && "invisible")}
        >
          <Button
            variant="outline"
            disabled={isDockerCommandStepsNull}
            onClick={() => setView("settings")}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            disabled={
              machine.type !== "comfy-deploy-serverless" ||
              isDockerCommandStepsNull
            }
            onClick={async () => {
              try {
                await callServerPromise(
                  api({
                    url: `machine/serverless/${machine.id}`,
                    init: {
                      method: "PATCH",
                      body: JSON.stringify({
                        is_trigger_rebuild: true,
                      }),
                    },
                  }),
                  {
                    loadingText: "Rebuilding machine",
                  },
                );
                toast.success("Rebuild machine successfully");
                toast.info("Redirecting to machine page...");
                await new Promise((resolve) => setTimeout(resolve, 1000));
                navigate({
                  to: "/machines/$machineId",
                  params: { machineId: machine.id },
                  search: { view: "deployments" },
                });
              } catch {
                toast.error("Failed to rebuild machine");
              }
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Rebuild
          </Button>
        </div>
        {machine.machine_version_id && (
          <div className="flex flex-row items-center gap-2 rounded-sm bg-green-500 px-3 py-2 text-green-50 text-xs">
            <CircleArrowUp className="h-4 w-4" />
            Current Version
          </div>
        )}
      </div>

      <div className="px-3 py-1">
        <MachineAlert machine={machine} isDeprecated={isDeprecated} />
      </div>

      <ResponsiveGridLayout
        className={cn("layout", isEditingLayout && "select-none")}
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 2, md: 2, sm: 1, xs: 1, xxs: 1 }}
        rowHeight={50}
        isResizable={isEditingLayout}
        isDraggable={isEditingLayout}
        onLayoutChange={handleLayoutChange}
      >
        <div key="info" className={cn(isEditingLayout && "shake-animation")}>
          <MachineInfo machine={machine} />
        </div>
        <div key="status" className={cn(isEditingLayout && "shake-animation")}>
          <MachineOverviewStatus machine={machine} />
        </div>
        <div
          key="customNodes"
          className={cn(isEditingLayout && "shake-animation")}
        >
          <MachineCustomNodes machine={machine} />
        </div>
        <div
          key="workflowDeployment"
          className={cn(isEditingLayout && "shake-animation")}
        >
          <MachineWorkflowDeployment machine={machine} />
        </div>
        <div
          key="containerGraph"
          className={cn(isEditingLayout && "shake-animation")}
        >
          <MachineContainerGraph machine={machine} />
        </div>
        <div
          key="containerTable"
          className={cn(isEditingLayout && "shake-animation")}
        >
          <MachineContainerTable machine={machine} />
        </div>
        <div
          key="buildLog"
          className={cn(isEditingLayout && "shake-animation")}
        >
          <MachineBuildLog machine={machine} />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}

function MachineAlert({
  machine,
  isDeprecated,
}: {
  machine: any;
  isDeprecated: boolean;
}) {
  const [showDeprecated, setShowDeprecated] = useState(true);
  const [showImportFailed, setShowImportFailed] = useState(true);

  const hasImportFailedLogs = useMemo(() => {
    try {
      const failedLogs = JSON.parse(machine.import_failed_logs || "[]");
      return failedLogs.length > 0;
    } catch (error) {
      console.error("Error parsing import failed logs:", error);
      return false;
    }
  }, [machine.import_failed_logs]);

  const renderAlert = (
    show: boolean,
    setShow: (show: boolean) => void,
    variant: "warning" | "destructive",
    title: string,
    description: React.ReactNode,
    bgColor: string,
  ) =>
    show && (
      <Alert variant={variant} className={`rounded-[10px] ${bgColor} relative`}>
        <Button
          onClick={() => setShow(false)}
          className={`absolute top-1 right-1 p-1 hover:bg-${
            variant === "warning" ? "yellow" : "red"
          }-100`}
          variant="ghost"
          size="icon"
        >
          <X className="h-4 w-4" />
        </Button>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    );

  const importFailedDescription = useMemo(() => {
    try {
      const failedLogs = JSON.parse(machine.import_failed_logs || "[]");
      return (
        <div className="space-y-2">
          <p>The following custom nodes failed to import:</p>
          <ul className="list-disc space-y-1 pl-4 font-mono">
            {failedLogs.map(
              (log: { logs: string; timestamp: number }, index: number) => (
                <li key={index} className="text-sm">
                  {log.logs}
                </li>
              ),
            )}
          </ul>
        </div>
      );
    } catch (error) {
      return null;
    }
  }, [machine.import_failed_logs]);

  return (
    <div className="flex flex-col gap-2">
      {isDeprecated &&
        renderAlert(
          showDeprecated,
          setShowDeprecated,
          "warning",
          "Deprecated Machine",
          <>
            This machine is running an{" "}
            <span className="font-semibold">outdated version</span> and{" "}
            <span className="font-semibold">no longer supported</span>.
            <br /> Please upgrade to the latest version to ensure compatibility
            and access new features.
          </>,
          "bg-yellow-50",
        )}
      {hasImportFailedLogs &&
        importFailedDescription &&
        renderAlert(
          showImportFailed,
          setShowImportFailed,
          "destructive",
          "Custom Node Import Failed",
          importFailedDescription,
          "bg-red-50",
        )}
    </div>
  );
}

// -----------------------cards-----------------------

function MachineInfo({ machine }: { machine: any }) {
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
            <div className="font-medium text-sm">Machine ID</div>
            <div className="max-w-[100px] truncate font-mono text-muted-foreground text-xs md:max-w-none">
              {machine.id}
            </div>
          </div>

          {machine.machine_version && (
            <div className="flex flex-row items-center justify-between">
              <div className="font-medium text-sm">Version</div>
              <div className="font-mono">
                <Badge
                  variant="outline"
                  className="!font-semibold !text-[11px]"
                >
                  v{machine.machine_version}
                </Badge>
              </div>
            </div>
          )}

          <div className="flex flex-row items-center justify-between">
            <div className="font-medium text-sm">Type</div>
            <Badge variant={"outline"} className="!text-2xs !font-semibold">
              {machine.type}
            </Badge>
          </div>

          <div className="flex flex-row items-center justify-between">
            <div className="font-medium text-sm">ComfyUI</div>
            <Link
              href={`https://github.com/comfyanonymous/ComfyUI/commit/${machine.comfyui_version}`}
              target="_blank"
              className="flex flex-row items-center gap-1"
            >
              <span className="max-w-[100px] truncate font-mono text-muted-foreground text-xs md:max-w-none">
                {machine.comfyui_version}
              </span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </Link>
          </div>

          <div className="flex flex-row items-center justify-between">
            <div className="font-medium text-sm">Created At</div>
            <div className="text-muted-foreground text-xs">
              {getRelativeTime(machine.created_at)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MachineOverviewStatus({ machine }: { machine: any }) {
  const { data: events, isLoading } = useMachineEvents(machine.id);
  const { hasActiveEvents } = useHasActiveEvents(machine.id);

  const serverlessSpec = (
    <>
      <Separator className="my-4" />

      <h2 className="font-medium text-sm">Specifications</h2>

      <div className="grid grid-cols-2 py-2">
        <div className="flex flex-row items-center gap-2 p-0.5 font-medium text-sm">
          <HardDrive className="h-4 w-4" />
          {machine.gpu}
        </div>
        <div className="flex flex-row items-center gap-2 p-0.5 font-medium text-sm">
          <MemoryStick className="h-4 w-4" />
          {machine.gpu ? CPU_MEMORY_MAP[machine.gpu] : ""}
        </div>
        <div className="col-span-2 flex flex-row items-center justify-between rounded-[4px] bg-gray-50 p-0.5 font-medium text-sm">
          <div className="flex items-center gap-2 font-medium text-xs">
            <Ticket className="h-4 w-4" /> Queue Per GPU
          </div>
          <div className="font-mono text-muted-foreground text-xs">
            {machine.allow_concurrent_inputs}
          </div>
        </div>
        <div className="col-span-2 flex flex-row items-center justify-between p-0.5 font-medium text-sm">
          <div className="flex items-center gap-2 font-medium text-xs">
            <Layers className="h-4 w-4" /> Max Parallel GPU
          </div>
          <div className="font-mono text-muted-foreground text-xs">
            {machine.concurrency_limit}
          </div>
        </div>
        <div className="col-span-2 flex flex-row items-center justify-between rounded-[4px] bg-gray-50 p-0.5 font-medium text-sm">
          <div className="flex items-center gap-2 font-medium text-xs">
            <Clock className="h-4 w-4" /> Workflow Timeout
          </div>
          <div className="font-mono text-muted-foreground text-xs">
            {machine.run_timeout}s
          </div>
        </div>
        <div className="col-span-2 flex flex-row items-center justify-between p-0.5 font-medium text-sm">
          <div className="flex items-center gap-2 font-medium text-xs">
            <Thermometer className="h-4 w-4" /> Warm Time
          </div>
          <div className="font-mono text-muted-foreground text-xs">
            {machine.idle_timeout}s
          </div>
        </div>
      </div>
    </>
  );

  const content = (
    <Card className="h-full w-full rounded-[10px]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between font-semibold text-xl">
          Status
          <div className="flex items-center">
            {hasActiveEvents ? (
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            ) : (
              <Pause className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center justify-between">
          <h2 className="font-medium text-sm">Current Status</h2>
          <Badge
            variant={hasActiveEvents ? "green" : "secondary"}
            className="!font-semibold flex items-center gap-1"
          >
            {hasActiveEvents ? (
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            ) : (
              <Pause className="h-3 w-3 text-muted-foreground" />
            )}
            {hasActiveEvents ? "Running" : "Idle"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 items-center gap-4 py-4">
          <div className="flex flex-col gap-2">
            <h3
              className={cn(
                "flex items-center gap-2 font-base text-gray-600 text-sm",
                hasActiveEvents ? "text-yellow-500" : "",
              )}
            >
              Last Activity <Zap className="h-[14px] w-[14px]" />
            </h3>
            <p
              className={cn(
                "font-bold text-2xl",
                hasActiveEvents ? "text-yellow-500" : "text-black",
              )}
            >
              {getLastActiveText(events)}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="flex items-center gap-2 font-base text-gray-600 text-sm">
              Runtime <Activity className="h-[14px] w-[14px]" />
            </h3>
            <p className="font-bold text-2xl text-black">
              {calculateTotalUpEventTime(events)}
            </p>
          </div>
        </div>

        <Separator className="my-2" />

        <h2 className="py-2 font-medium text-sm">Builds</h2>
        <div className="flex flex-row items-center justify-between py-1">
          <div className="flex flex-row items-center gap-2">
            <MachineStatus machine={machine} />
            <div className="font-mono">
              {machine.machine_version && (
                <Badge
                  variant="outline"
                  className="!font-semibold !text-[11px]"
                >
                  v{machine.machine_version}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            {getRelativeTime(machine.updated_at)}
          </p>
        </div>

        {machine.type === "comfy-deploy-serverless" && serverlessSpec}
      </CardContent>
    </Card>
  );

  return hasActiveEvents ? (
    <ShineBorder
      color="green"
      className="h-full w-full p-0"
      borderRadius={10}
      borderWidth={2}
    >
      {content}
    </ShineBorder>
  ) : (
    content
  );
}

function MachineCustomNodes({ machine }: { machine: any }) {
  const getNodeBadgeProps = (machineStatus: string, nodeIsFailed: boolean) => {
    switch (machineStatus) {
      case "building":
        return {
          variant: "secondary" as const,
          label: "Installing",
          icon: <Loader2 className="mr-1 h-3 w-3 animate-spin" />,
          className: "animate-pulse",
        };
      case "error":
        return {
          variant: "destructive" as const,
          label: "Failed",
          className: "",
        };
      case "ready":
        return nodeIsFailed
          ? {
              variant: "destructive" as const,
              label: "Failed",
              className: "",
            }
          : {
              variant: "outline" as const,
              label: "Imported",
              className: "",
            };
      default:
        return {
          variant: "outline" as const,
          label: "Unknown",
          className: "",
        };
    }
  };

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
                  const badgeProps = getNodeBadgeProps(
                    machine.status,
                    node.isFailed,
                  );
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
                        onClick={() => {
                          window.open(
                            `${node.data.url}/commit/${node.data.hash}`,
                            "_blank",
                          );
                        }}
                        className="flex flex-row items-center gap-2 text-sm"
                      >
                        <span className="flex-1 truncate">
                          {node.data.name}
                        </span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      <div className="flex flex-row items-center gap-2">
                        <span className="hidden max-w-[100px] truncate font-mono text-2xs text-muted-foreground md:block">
                          {node.data.hash}
                        </span>
                        <Badge
                          variant={badgeProps.variant}
                          className={cn(
                            "!text-2xs !font-semibold !leading-tight px-3",
                            badgeProps.className,
                          )}
                        >
                          {badgeProps.icon}
                          {badgeProps.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    );

    return hasFailedNodes ? (
      <ShineBorder
        color="red"
        className="h-full w-full p-0"
        borderRadius={10}
        borderWidth={2}
      >
        {content}
      </ShineBorder>
    ) : (
      content
    );
  };

  // Handle new format (docker_command_steps)
  if (machine.docker_command_steps) {
    const failedNodePaths = useMemo(() => {
      try {
        return new Set(
          JSON.parse(machine.import_failed_logs || "[]").map((log: any) => {
            const match = log.logs.match(/: (.+)$/);
            return match ? match[1] : "";
          }),
        );
      } catch (error) {
        console.error("Error parsing failed logs:", error);
        return new Set();
      }
    }, [machine.import_failed_logs]);

    const customNodes = useMemo(() => {
      return machine.docker_command_steps.steps
        .filter((node: any) => node.type === "custom-node")
        .map((node: any) => ({
          ...node,
          isFailed: failedNodePaths.has(
            `/comfyui/custom_nodes/${node.data?.url.split("/").pop()}`,
          ),
        }));
    }, [machine.docker_command_steps.steps, failedNodePaths]);

    return renderCard(
      customNodes,
      customNodes.some((node: any) => node.isFailed),
    );
  }

  // Handle old format (dependencies)
  try {
    const dependencies =
      typeof machine.dependencies === "string"
        ? JSON.parse(machine.dependencies)
        : machine.dependencies || {};

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

function MachineWorkflowDeployment({ machine }: { machine: any }) {
  const [activeTab, setActiveTab] = useState<"workflows" | "deployments">(
    "workflows",
  );
  const { data: workflows, isLoading: isWorkflowsLoading } = useQuery({
    queryKey: ["workflows", "all"],
  });
  const { data: deployments, isLoading: isDeploymentsLoading } = useQuery({
    queryKey: ["deployments"],
  });

  return (
    <Card className="flex h-full flex-col rounded-[10px]">
      <CardHeader className="flex-none pb-4">
        <CardTitle className="flex items-center justify-between font-semibold text-xl">
          Workflows & Deployments
          <div className="flex items-center">
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col overflow-hidden">
        <div className="mb-4 flex flex-none rounded-[8px] bg-muted p-1">
          <button
            className={cn(
              "flex-1 rounded-[8px] px-3 py-1 font-medium text-sm transition-all",
              activeTab === "workflows"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setActiveTab("workflows")}
          >
            Workflows
          </button>
          <button
            className={cn(
              "flex-1 rounded-[8px] px-3 py-1 font-medium text-sm transition-all",
              activeTab === "deployments"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setActiveTab("deployments")}
          >
            Deployments
          </button>
        </div>

        <ScrollArea className="flex-1">
          {activeTab === "workflows" ? (
            <div>
              {(
                workflows as Array<{
                  id: string;
                  selected_machine_id: string;
                  name: string;
                }>
              )
                ?.filter((w) => w.selected_machine_id === machine.id)
                .map((workflow, index) => (
                  <Link
                    key={workflow.id}
                    to="/workflows/$workflowId/$view"
                    params={{
                      workflowId: workflow.id,
                      view: "workspace",
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex flex-row items-center gap-2 rounded-[4px] p-1 text-xs transition-all hover:bg-gray-100",
                      index % 2 === 1 && "bg-gray-50",
                    )}
                  >
                    <Box className="h-4 w-4" />
                    {workflow.name}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                ))}
            </div>
          ) : (
            <div>
              {(
                deployments as Array<{
                  id: string;
                  machine_id: string;
                  workflow_id: string;
                  environment: string;
                  workflow: {
                    name: string;
                  };
                }>
              )
                ?.filter((d) => d.machine_id === machine.id)
                .map((deployment, index) => (
                  <div
                    key={deployment.id}
                    className={cn(
                      "flex flex-row items-center justify-between rounded-[4px] p-1 transition-all hover:bg-gray-100",
                      index % 2 === 1 && "bg-gray-50",
                    )}
                  >
                    <Link
                      to="/workflows/$workflowId/$view"
                      params={{
                        workflowId: deployment.workflow_id,
                        view: "deployment",
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-row items-center gap-2 rounded-[4px] text-xs"
                    >
                      <GitBranch className="h-4 w-4" />
                      {deployment.workflow.name}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Badge
                      variant={
                        deployment.environment === "production"
                          ? "blue"
                          : "yellow"
                      }
                      className="!text-2xs !leading-tight"
                    >
                      {deployment.environment}
                    </Badge>
                  </div>
                ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function MachineContainerGraph({ machine }: { machine: any }) {
  const { data: events, isLoading } = useMachineEvents(machine.id);

  return (
    <Card className="h-full rounded-[10px]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between font-semibold text-xl">
          Container Activity
          <div className="flex items-center">
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MachineListItemEvents
          isExpanded={true}
          events={{ data: events, isLoading }}
          machine={machine}
        />
      </CardContent>
    </Card>
  );
}

function MachineContainerTable({ machine }: { machine: any }) {
  const { data: events, isLoading } = useMachineEvents(machine.id);

  return (
    <Card className="flex h-full flex-col rounded-[10px]">
      <CardHeader className="flex-none pb-4">
        <CardTitle className="flex items-center justify-between font-semibold text-xl">
          Container History
          <div className="flex items-center">
            <TableIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardTitle>
        <CardDescription>
          Container history for the last 24 hours
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="p-6 pt-0">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>GPU</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events?.map((event) => {
                  const startTime = new Date(event.start_time ?? "");
                  const endTime = event.end_time
                    ? new Date(event.end_time)
                    : new Date();
                  const duration = differenceInMilliseconds(endTime, startTime);
                  const status = event.end_time ? "Done" : "Running";

                  // Format duration to be more readable
                  const durationSeconds = Math.floor(duration / 1000);
                  const durationMinutes = Math.floor(durationSeconds / 60);
                  const durationHours = Math.floor(durationMinutes / 60);

                  let durationText = "";
                  if (durationHours > 0) {
                    durationText += `${durationHours}h `;
                  }
                  if (durationMinutes % 60 > 0) {
                    durationText += `${durationMinutes % 60}m `;
                  }
                  if (durationSeconds % 60 > 0) {
                    durationText += `${durationSeconds % 60}s`;
                  }

                  return (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        {startTime.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {event.end_time ? (
                          endTime.toLocaleString()
                        ) : (
                          <Skeleton className="h-4 w-16 rounded-[4px]" />
                        )}
                      </TableCell>
                      <TableCell>{durationText.trim() || "0s"}</TableCell>
                      <TableCell>
                        <Badge variant={status === "Done" ? "green" : "yellow"}>
                          {status === "Done" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          )}
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>{event.gpu}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function MachineBuildLog({ machine }: { machine: any }) {
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
      <CardContent className="max-h-[600px] overflow-y-auto">
        {machine.build_log ? (
          <BuildStepsUI
            logs={JSON.parse(machine.build_log ?? "")}
            machine={machine}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            No logs
          </div>
        )}
      </CardContent>
    </Card>
  );
}
