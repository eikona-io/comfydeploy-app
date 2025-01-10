import { MachineVersionList } from "@/components/machine/machine-deployment";
import {
  CPU_MEMORY_MAP,
  MachineListItemEvents,
  getLastActiveText,
  isMachineDeprecated,
  useHasActiveEvents,
} from "@/components/machines/machine-list-item";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentPlan } from "@/hooks/use-current-plan";
import {
  useMachineEvents,
  useMachineVersion,
  useMachineVersions,
  useMachineVersionsAll,
} from "@/hooks/use-machine";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { differenceInMilliseconds, max } from "date-fns";
import { motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  Box,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  GitBranch,
  LineChart,
  Loader2,
  Save,
  Table as TableIcon,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
// const ResponsiveGridLayout = WidthProvider(Responsive);

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

export function MachineOverview({ machine }: { machine: any }) {
  const defaultLayout = [
    { i: "status", x: 0, y: 0, w: 1, h: 6 },
    { i: "customNodes", x: 0, y: 6, w: 1, h: 6 },
    { i: "workflowDeployment", x: 0, y: 2, w: 1, h: 6 },
    { i: "containerGraph", x: 1, y: 1, w: 1, h: 7 },
    { i: "containerTable", x: 1, y: 2, w: 2, h: 8 },
  ];

  const [layout, setLayout] = useState(() => {
    const savedLayout = getFromLS(machine.id);
    return savedLayout || defaultLayout;
  });
  const [isEditingLayout, setIsEditingLayout] = useState(false);
  const navigate = useNavigate();
  const { data: machineVersionsAll, isLoading: isLoadingVersions } =
    useMachineVersionsAll(machine.id);
  const handleLayoutChange = (newLayout: any) => {
    if (!isEditingLayout) return;
    setLayout(newLayout);
  };
  const sub = useCurrentPlan();

  const isDeprecated = isMachineDeprecated(machine);
  const isDockerCommandStepsNull =
    machine?.docker_command_steps === null &&
    machine.type === "comfy-deploy-serverless";

  const isLatestVersion = useMemo(() => {
    if (isLoadingVersions || !machineVersionsAll) return true;

    return (
      machine?.machine_version_id !== null &&
      machineVersionsAll[0]?.id === machine.machine_version_id
    );
  }, [machine?.machine_version_id, machineVersionsAll, isLoadingVersions]);

  return (
    <div className="w-full">
      <div className="px-4 py-1">
        <MachineAlert
          machine={machine}
          isDeprecated={isDeprecated}
          isLatestVersion={isLatestVersion}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 px-4 py-2">
        <MachineContainerActivity machine={machine} />
        <MachineVersionWrapper machine={machine} />
        <div className="h-[200px] transition-all delay-300 duration-300 ease-in-out hover:h-[400px]">
          <MachineWorkflowDeployment machine={machine} />
        </div>
        <MachineSettings />
      </div>
    </div>
  );
}

function MachineAlert({
  machine,
  isDeprecated,
  isLatestVersion,
}: {
  machine: any;
  isDeprecated: boolean;
  isLatestVersion: boolean;
}) {
  const [showDeprecated, setShowDeprecated] = useState(true);
  const [showImportFailed, setShowImportFailed] = useState(true);
  const [showRollback, setShowRollback] = useState(true);

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
      {!isLatestVersion &&
        machine.machine_version_id &&
        renderAlert(
          showRollback,
          setShowRollback,
          "warning",
          "Rollback Version",
          <div className="mt-2">
            This machine is running a{" "}
            <span className="font-semibold">rollback version</span>. You can
            always switch back to the latest version when ready.
            <br />
            <a
              href="https://comfydeploy.com/docs/v2/machines/rollback"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700"
            >
              Learn more about Machine Rollback
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>,
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

function MachineVersionWrapper({ machine }: { machine: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const { data: machineVersion, isLoading: isLoadingMachineVersion } =
    useMachineVersion(machine.id, machine.machine_version_id);
  const { data: machineVersions, isLoading: isLoadingMachineVersions } =
    useMachineVersions(machine.id);

  if (!machineVersion) return null;

  const versions = machineVersions?.pages[0] || [];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="flex flex-col rounded-[10px]">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between font-semibold text-xl">
            <Link
              to="/machines/$machineId"
              params={{ machineId: machine.id }}
              search={{ view: "deployments" }}
            >
              Version Details
            </Link>
            <div className="flex items-center">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardTitle>
          <CardDescription>
            Current version configuration, custom nodes, dependencies, and more.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-2 overflow-hidden">
          <MachineVersionList
            machineVersion={machineVersion}
            machine={machine}
          />
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isHovered ? "auto" : 0,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ delay: 0.3, duration: 0.15, ease: "easeOut" }}
            className="hidden space-y-2 overflow-hidden md:block"
          >
            {versions
              .filter((version) => version.id !== machineVersion.id)
              .slice(0, 2)
              .map((version) => (
                <MachineVersionList
                  key={version.id}
                  machineVersion={version}
                  machine={machine}
                />
              ))}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
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

function MachineContainerActivity({ machine }: { machine: any }) {
  const [view, setView] = useState<"graph" | "table">("graph");
  const { data: events, isLoading } = useMachineEvents(machine.id);
  const { hasActiveEvents } = useHasActiveEvents(machine.id);

  const content = (
    <Card
      className={cn(
        "group flex flex-col rounded-[10px]",
        "transition-all delay-300 duration-300 ease-in-out",
        "h-[600px] md:h-[190px] md:hover:h-[510px]",
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-semibold text-xl">
            Container Activity
          </CardTitle>

          <div className="flex items-center gap-2">
            <div className="flex rounded-sm bg-muted p-1">
              <button
                type="button"
                onClick={() => setView("graph")}
                className={cn(
                  "inline-flex items-center justify-center rounded-[8px] px-2.5 py-1.5 font-medium text-sm transition-colors",
                  "hover:bg-background/50",
                  view === "graph"
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground",
                )}
              >
                <LineChart className="mr-2 h-4 w-4" />
                Graph
              </button>
              <button
                type="button"
                onClick={() => setView("table")}
                className={cn(
                  "inline-flex items-center justify-center rounded-[8px] px-2.5 py-1.5 font-medium text-sm transition-colors",
                  "hover:bg-background/50",
                  view === "table"
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground",
                )}
              >
                <TableIcon className="mr-2 h-4 w-4" />
                Table
              </button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <div className="grid grid-cols-2 items-center gap-4 pb-4 md:grid-cols-3">
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

          <div className="flex flex-col gap-2">
            <h3 className="flex items-center gap-2 font-base text-gray-600 text-sm">
              Cost (estimated)
              <DollarSign className="h-[14px] w-[14px]" />
            </h3>
            <p className="font-bold text-2xl text-black">
              $0.00
              <span className="font-normal text-2xs text-gray-400">
                {" "}
                / month
              </span>
            </p>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden",
            "transition-all delay-300 duration-300 ease-in-out",
            "group-hover:max-h-[500px] group-hover:opacity-100",
            "max-h-auto opacity-100 md:max-h-0 md:opacity-0",
          )}
        >
          {view === "graph" ? (
            <MachineListItemEvents
              isExpanded={true}
              events={{ data: events, isLoading }}
              machine={machine}
            />
          ) : (
            <ScrollArea className="h-full">
              <div className="pr-4">
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
                      const duration = differenceInMilliseconds(
                        endTime,
                        startTime,
                      );
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
                            <Badge
                              variant={status === "Done" ? "green" : "yellow"}
                            >
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
          )}
        </div>
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

function MachineSettings() {
  return (
    <Card className="flex h-full flex-col rounded-[10px]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between font-semibold text-xl">
          Settings
          <div className="flex items-center">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Configure your machine's GPU settings and environment
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <Tabs defaultValue="environment">
          <TabsList className="grid w-full grid-cols-3 rounded-[8px]">
            <TabsTrigger value="environment" className="rounded-[6px]">
              Environment
            </TabsTrigger>
            <TabsTrigger value="auto-scaling" className="rounded-[6px]">
              Auto Scaling
            </TabsTrigger>
            <TabsTrigger value="advanced" className="rounded-[6px]">
              Advanced
            </TabsTrigger>
          </TabsList>
          <TabsContent value="environment">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="auto-scaling">
            Change your password here.
          </TabsContent>
          <TabsContent value="advanced">Advanced settings.</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
