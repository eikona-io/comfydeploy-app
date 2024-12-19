import { differenceInMilliseconds, max } from "date-fns";
import {
  Activity,
  AlertCircle,
  Box,
  CheckCircle2,
  Edit,
  ExternalLink,
  FileClock,
  GitBranch,
  HardDrive,
  Info,
  Library,
  LineChart,
  ListRestart,
  Loader2,
  MemoryStick,
  Pause,
  Pencil,
  RefreshCw,
  Save,
  Table as TableIcon,
  Workflow,
  Zap,
  X,
  Ticket,
  Clock,
  Thermometer,
  Layers,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import {
  CPU_MEMORY_MAP,
  getLastActiveText,
  isMachineDeprecated,
  MachineListItemEvents,
  useHasActiveEvents,
} from "@/components/machines/machine-list-item";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { getRelativeTime } from "@/lib/get-relative-time";
import { useMachineEvents } from "@/hooks/use-machine";
import { Separator } from "@/components/ui/separator";
import { MachineStatus } from "@/components/machines/machine-status";
import { ShineBorder } from "@/components/magicui/shine-border";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./machine-overview-style.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

// -----------------------hooks-----------------------

const calculateTotalUpEventTime = (events: any[] | undefined): string => {
  if (!events || events.length === 0) return "Never";

  const eventTimes = events.map((event) => ({
    start: event.start_time ? new Date(event.start_time) : null,
    end: event.end_time ? new Date(event.end_time) : new Date(),
  }));

  eventTimes.sort(
    (a, b) => (a.start?.getTime() || 0) - (b.start?.getTime() || 0)
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
  setView: (view: "settings" | "overview" | "logs") => void;
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
  // const { showDevMode } = use(FeatureFlagsContext);

  const [layout, setLayout] = useState(() => {
    const savedLayout = getFromLS(machine.id);
    return savedLayout || defaultLayout;
  });
  const [isEditingLayout, setIsEditingLayout] = useState(false);

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
      <div className="flex flex-row justify-between items-center px-4 py-2">
        <div
          className={cn("flex flex-row gap-2", isEditingLayout && "invisible")}
        >
          <Button
            variant="outline"
            disabled={isDockerCommandStepsNull}
            onClick={() => setView("settings")}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            disabled={
              machine.type !== "comfy-deploy-serverless" ||
              isDockerCommandStepsNull
            }
            onClick={async () => {}}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Rebuild
          </Button>
          {/* {(process.env.NODE_ENV === "development" || showDevMode) &&
            machine.type == "comfy-deploy-serverless" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    window.open(
                      "https://modal.com/comfy-deploy/main/logs/" +
                        machine.modal_app_id,
                      "_blank"
                    );
                  }}
                >
                  <Info size={14} className="mr-2" />
                  Open Logs
                </Button>
              </>
            )} */}
        </div>

        {/* {(process.env.NODE_ENV === "development" || showDevMode) && (
          <div className="hidden lg:flex flex-row gap-2">
            {isEditingLayout && (
              <Button
                variant="destructive"
                onClick={() => {
                  setIsEditingLayout(false);
                  setLayout(defaultLayout);
                  deleteFromLS(machine.id);
                }}
              >
                <ListRestart className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}
            <Button
              variant={isEditingLayout ? "default" : "outline"}
              onClick={() => {
                if (isEditingLayout) {
                  // Save the layout to local storage when saving
                  saveToLS(machine.id, layout);
                }
                setIsEditingLayout(!isEditingLayout);
              }}
            >
              {isEditingLayout ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4 mr-2" />
                  Layout
                </>
              )}
            </Button>
          </div>
        )} */}
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
    bgColor: string
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
          <ul className="list-disc pl-4 space-y-1 font-mono">
            {failedLogs.map(
              (log: { logs: string; timestamp: number }, index: number) => (
                <li key={index} className="text-sm">
                  {log.logs}
                </li>
              )
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
          "bg-yellow-50"
        )}
      {hasImportFailedLogs &&
        importFailedDescription &&
        renderAlert(
          showImportFailed,
          setShowImportFailed,
          "destructive",
          "Custom Node Import Failed",
          importFailedDescription,
          "bg-red-50"
        )}
    </div>
  );
}

// -----------------------cards-----------------------

function MachineInfo({ machine }: { machine: any }) {
  return (
    <Card className="rounded-[10px] h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center justify-between">
          Information
          <div className="flex items-center">
            <HardDrive className="w-4 h-4 text-muted-foreground" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center">
        <div className="space-y-1 w-full">
          <div className="flex flex-row justify-between items-center">
            <div className="text-sm font-medium">Machine ID</div>
            <div className="text-xs font-mono text-muted-foreground max-w-[100px] md:max-w-none truncate">
              {machine.id}
            </div>
          </div>

          {machine.machine_version && (
            <div className="flex flex-row justify-between items-center">
              <div className="text-sm font-medium">Version</div>
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

          <div className="flex flex-row justify-between items-center">
            <div className="text-sm font-medium">Type</div>
            <Badge variant={"outline"} className="!text-2xs !font-semibold">
              {machine.type}
            </Badge>
          </div>

          <div className="flex flex-row justify-between items-center">
            <div className="text-sm font-medium">ComfyUI</div>
            <Link
              href={`https://github.com/comfyanonymous/ComfyUI/commit/${machine.comfyui_version}`}
              target="_blank"
              className="flex flex-row items-center gap-1"
            >
              <span className="text-xs font-mono text-muted-foreground max-w-[100px] md:max-w-none truncate">
                {machine.comfyui_version}
              </span>
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </Link>
          </div>

          <div className="flex flex-row justify-between items-center">
            <div className="text-sm font-medium">Created At</div>
            <div className="text-xs text-muted-foreground">
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

      <h2 className="text-sm font-medium">Specifications</h2>

      <div className="grid grid-cols-2 py-2">
        <div className="flex flex-row gap-2 items-center text-sm font-medium p-0.5">
          <HardDrive className="w-4 h-4" />
          {machine.gpu}
        </div>
        <div className="flex flex-row gap-2 items-center text-sm font-medium p-0.5">
          <MemoryStick className="w-4 h-4" />
          {machine.gpu ? CPU_MEMORY_MAP[machine.gpu] : ""}
        </div>
        <div className="col-span-2 flex flex-row items-center justify-between text-sm font-medium bg-gray-50 rounded-[4px] p-0.5">
          <div className="text-xs font-medium flex items-center gap-2">
            <Ticket className="w-4 h-4" /> Queue Per GPU
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {machine.allow_concurrent_inputs}
          </div>
        </div>
        <div className="col-span-2 flex flex-row items-center justify-between text-sm font-medium p-0.5">
          <div className="text-xs font-medium flex items-center gap-2">
            <Layers className="w-4 h-4" /> Max Parallel GPU
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {machine.concurrency_limit}
          </div>
        </div>
        <div className="col-span-2 flex flex-row items-center justify-between text-sm font-medium bg-gray-50 rounded-[4px] p-0.5">
          <div className="text-xs font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" /> Workflow Timeout
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {machine.run_timeout}s
          </div>
        </div>
        <div className="col-span-2 flex flex-row items-center justify-between text-sm font-medium p-0.5">
          <div className="text-xs font-medium flex items-center gap-2">
            <Thermometer className="w-4 h-4" /> Warm Time
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {machine.idle_timeout}s
          </div>
        </div>
      </div>
    </>
  );

  const content = (
    <Card className="rounded-[10px] w-full h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center justify-between">
          Status
          <div className="flex items-center">
            {hasActiveEvents ? (
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            ) : (
              <Pause className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-sm font-medium">Current Status</h2>
          <Badge
            variant={hasActiveEvents ? "green" : "secondary"}
            className="!font-semibold flex items-center gap-1"
          >
            {hasActiveEvents ? (
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            ) : (
              <Pause className="w-3 h-3 text-muted-foreground" />
            )}
            {hasActiveEvents ? "Running" : "Idle"}
          </Badge>
        </div>

        <div className="py-4 grid grid-cols-2 gap-4 items-center">
          <div className="flex flex-col gap-2">
            <h3
              className={cn(
                "text-sm font-base text-gray-600 flex items-center gap-2",
                hasActiveEvents ? "text-yellow-500" : ""
              )}
            >
              Last Activity <Zap className="w-[14px] h-[14px]" />
            </h3>
            <p
              className={cn(
                "text-2xl font-bold",
                hasActiveEvents ? "text-yellow-500" : "text-black"
              )}
            >
              {getLastActiveText(events)}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-base text-gray-600 flex items-center gap-2">
              Runtime <Activity className="w-[14px] h-[14px]" />
            </h3>
            <p className="text-2xl font-bold text-black">
              {calculateTotalUpEventTime(events)}
            </p>
          </div>
        </div>

        <Separator className="my-2" />

        <h2 className="text-sm font-medium py-2">Builds</h2>
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
          <p className="text-sm text-muted-foreground">
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
      className="p-0 w-full h-full"
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
          icon: <Loader2 className="w-3 h-3 animate-spin mr-1" />,
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
      <Card className="rounded-[10px] h-full w-full flex flex-col">
        <CardHeader className="pb-4 flex-none">
          <CardTitle className="text-xl font-semibold flex items-center justify-between">
            Custom Nodes
            <div className="flex items-center">
              <Library className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          {nodes.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No custom nodes installed
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="flex flex-col">
                {nodes.map((node, index) => {
                  const badgeProps = getNodeBadgeProps(
                    machine.status,
                    node.isFailed
                  );
                  return (
                    <div
                      key={node.id}
                      className={cn(
                        "flex flex-row items-center w-full justify-between rounded-[4px] p-1 transition-all hover:bg-gray-100",
                        index % 2 === 1 && "bg-gray-50",
                        node.isFailed && "bg-red-50"
                      )}
                    >
                      <Link
                        href={`${node.data.url}/commit/${node.data.hash}`}
                        target="_blank"
                        className="text-sm flex items-center flex-row gap-2"
                      >
                        <span className="truncate flex-1">
                          {node.data.name}
                        </span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      <div className="flex flex-row items-center gap-2">
                        <span className="text-2xs font-mono text-muted-foreground max-w-[100px] hidden md:block truncate">
                          {node.data.hash}
                        </span>
                        <Badge
                          variant={badgeProps.variant}
                          className={cn(
                            "!text-2xs !font-semibold !leading-tight px-3",
                            badgeProps.className
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
        className="p-0 w-full h-full"
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
          })
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
            `/comfyui/custom_nodes/${node.data?.url.split("/").pop()}`
          ),
        }));
    }, [machine.docker_command_steps.steps, failedNodePaths]);

    return renderCard(
      customNodes,
      customNodes.some((node: any) => node.isFailed)
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
      })
    );

    return renderCard(customNodes);
  } catch (error) {
    console.error("Error parsing dependencies:", error);
    return renderCard();
  }
}

function MachineWorkflowDeployment({ machine }: { machine: any }) {
  const [activeTab, setActiveTab] = useState<"workflows" | "deployments">(
    "workflows"
  );
  const { data: workflows, isLoading: isWorkflowsLoading } = useQuery({
    queryKey: ["workflows", "all"],
  });
  const { data: deployments, isLoading: isDeploymentsLoading } = useQuery({
    queryKey: ["deployments"],
  });

  return (
    <Card className="rounded-[10px] h-full flex flex-col">
      <CardHeader className="pb-4 flex-none">
        <CardTitle className="text-xl font-semibold flex items-center justify-between">
          Workflows & Deployments
          <div className="flex items-center">
            <Workflow className="w-4 h-4 text-muted-foreground" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        <div className="flex rounded-[8px] bg-muted p-1 mb-4 flex-none">
          <button
            className={cn(
              "flex-1 px-3 py-1 text-sm font-medium rounded-[8px] transition-all",
              activeTab === "workflows"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTab("workflows")}
          >
            Workflows
          </button>
          <button
            className={cn(
              "flex-1 px-3 py-1 text-sm font-medium rounded-[8px] transition-all",
              activeTab === "deployments"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
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
                    href={`/workflows/${workflow.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex flex-row items-center gap-2 text-xs rounded-[4px] p-1 hover:bg-gray-100 transition-all",
                      index % 2 === 1 && "bg-gray-50"
                    )}
                  >
                    <Box className="w-4 h-4" />
                    {workflow.name}
                    <ExternalLink className="w-3 h-3" />
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
                      "flex flex-row items-center justify-between rounded-[4px] p-1 hover:bg-gray-100 transition-all",
                      index % 2 === 1 && "bg-gray-50"
                    )}
                  >
                    <Link
                      href={`/workflows/${deployment.workflow_id}?view=deployment`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-row items-center gap-2 text-xs rounded-[4px]"
                    >
                      <GitBranch className="w-4 h-4" />
                      {deployment.workflow.name}
                      <ExternalLink className="w-3 h-3" />
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
    <Card className="rounded-[10px] h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center justify-between">
          Container Activity
          <div className="flex items-center">
            <LineChart className="w-4 h-4 text-muted-foreground" />
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
    <Card className="rounded-[10px] h-full flex flex-col">
      <CardHeader className="pb-4 flex-none">
        <CardTitle className="text-xl font-semibold flex items-center justify-between">
          Container History
          <div className="flex items-center">
            <TableIcon className="w-4 h-4 text-muted-foreground" />
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
                          <Skeleton className="w-16 h-4 rounded-[4px]" />
                        )}
                      </TableCell>
                      <TableCell>{durationText.trim() || "0s"}</TableCell>
                      <TableCell>
                        <Badge variant={status === "Done" ? "green" : "yellow"}>
                          {status === "Done" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Loader2 className="w-3 h-3 animate-spin" />
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
    <Card className="rounded-[10px] h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center justify-between">
          Build Log
          <div className="flex items-center">
            <FileClock className="w-4 h-4 text-muted-foreground" />
          </div>
        </CardTitle>
        <CardDescription>Machine build logs</CardDescription>
      </CardHeader>
      <CardContent>
        {/* {machine.build_log && (
          <MemoizedStepsUI
            logs={JSON.parse(machine.build_log ?? "")}
            machine={machine}
          />
        )} */}
      </CardContent>
    </Card>
  );
}
