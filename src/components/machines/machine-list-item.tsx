import { useMachineEvents } from "@/hooks/use-machine";
import { cn } from "@/lib/utils";
import {
  addHours,
  differenceInHours,
  format,
  formatDistanceToNowStrict,
  isAfter,
  subHours,
} from "date-fns";
import { useMemo } from "react";
import { LoadingIcon } from "@/components/ui/custom/loading-icon";
import {
  AlertCircleIcon,
  ChevronDown,
  Clock,
  ExternalLink,
  FileClock,
  HardDrive,
  LineChart,
  MemoryStick,
  Pause,
  Settings,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getRelativeTime } from "@/lib/get-relative-time";
import { ShineBorder } from "@/components/magicui/shine-border";
import { Separator } from "@/components/ui/separator";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { MachineStatus } from "@/components/machines/machine-status";
import { CustomNodeList } from "@/components/machines/custom-node-list";

// -------------------------constants-------------------------

export const CPU_MEMORY_MAP: Record<string, string> = {
  T4: "16GB",
  A10G: "24GB",
  L4: "24GB",
  A100: "40GB",
  "A100-80GB": "80GB",
  H100: "80GB",
};

// -------------------------hooks-------------------------

function isEventActive(event: any) {
  // Check if event exists and has valid start_time
  if (!event || !event.start_time) return false;

  // If end_time is null/undefined or is in the future, the event is active
  if (!event.end_time) return true;

  // Additional safety: check if end_time is valid date
  try {
    const endTime = new Date(event.end_time);
    const now = new Date();
    return endTime > now;
  } catch (e) {
    console.error("Invalid date format for event:", event);
    return false;
  }
}

export function useHasActiveEvents(machineId: string) {
  const { data: events, isLoading } = useMachineEvents(machineId);
  return {
    hasActiveEvents: events?.some(isEventActive),
    isLoading,
  };
}

export const getLastActiveText = (events: any[] | undefined) => {
  if (!events?.length) return "Never";

  const mostRecentEvent = events.reduce(
    (latest, event) => {
      if (!event.start_time?.toLocaleString()) return latest;

      const eventStart = new Date(event.start_time?.toLocaleString() || "");
      if (
        !latest ||
        eventStart > new Date(latest.start_time?.toLocaleString() || "")
      ) {
        return event;
      }
      return latest;
    },
    null as (typeof events)[0] | null
  );

  if (!mostRecentEvent?.start_time) return "Never";

  if (!mostRecentEvent.end_time) {
    return "Now";
  }

  try {
    return `${formatDistanceToNowStrict(new Date(mostRecentEvent.end_time), {
      addSuffix: true,
    })}`;
  } catch (e) {
    console.error("Invalid date format:", e);
    return "Unknown";
  }
};

export const isMachineDeprecated = (machine: any) =>
  (machine?.type === "comfy-deploy-serverless" &&
    machine?.machine_builder_version &&
    Number(machine.machine_builder_version) < 3) ||
  false;

// -------------------------components-------------------------

export function MachineListItem({
  machine,
  isExpanded,
  setIsExpanded,
  machineActionItemList,
  modalBuilderEndpoint,
}: {
  machine: any;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
  machineActionItemList: React.ReactNode;
  modalBuilderEndpoint?: string;
}) {
  const { data: events, isLoading } = useMachineEvents(machine.id);
  const { hasActiveEvents } = useHasActiveEvents(machine.id);

  const isStale = useMemo(() => {
    if (machine.status === "building") {
      const buildDuration = differenceInHours(
        new Date(),
        new Date(machine.updated_at)
      );
      return buildDuration >= 1;
    }
    return false;
  }, [machine.status, machine.updated_at]);

  const isDeprecated = isMachineDeprecated(machine);
  const isDockerCommandStepsNull =
    machine?.docker_command_steps === null &&
    machine?.type === "comfy-deploy-serverless";

  const content = (
    <div
      className={cn(
        "border rounded-sm p-4 shadow-sm w-full min-h-[80px] bg-white flex items-center flex-col group relative overflow-hidden",
        isStale && "bg-gray-50 contrast-75",
        machine.status === "error" && "bg-red-100",
        machine.import_failed_logs &&
          JSON.parse(machine.import_failed_logs).length > 0 &&
          "bg-yellow-50",
        isDeprecated && !isStale && "bg-yellow-50",
        hasActiveEvents && "bg-green-50/80"
      )}
    >
      {/* <BuildProgressWrapper
        machine={machine}
        modalBuilderEndpoint={modalBuilderEndpoint}
        isStale={isStale}
      /> */}

      <div className="flex flex-row justify-between w-full z-[2]">
        <div className="flex flex-row gap-4 items-center">
          <div className="flex justify-center flex-col">
            <div className="flex flex-row gap-2 items-center">
              {(() => {
                switch (true) {
                  case machine.status === "building" && !isStale:
                    return <LoadingIcon className="w-4 h-4" />;
                  case machine.status === "error":
                    return (
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    );
                  case isStale:
                    return <Clock className="w-3 h-3" />;
                  case (machine.import_failed_logs &&
                    JSON.parse(machine.import_failed_logs).length > 0) ||
                    isDeprecated:
                    return (
                      <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    );
                  case machine.status === "ready":
                    return (
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    );
                  default:
                    return null;
                }
              })()}
              <a href={`/machines/${machine.id}`}>
                <h2 className="text-base font-medium whitespace-nowrap">
                  {machine.name}
                </h2>
              </a>
            </div>

            {!isExpanded && machine.gpu && (
              <div className="flex flex-row gap-1 items-center text-2xs font-medium">
                <HardDrive className="w-[14px] h-[14px]" />
                {machine.gpu}
              </div>
            )}
          </div>

          {!isExpanded && (
            <>
              <div className="hidden xl:block">
                <MachineListItemDeployments
                  machine={machine}
                  isExpanded={false}
                />
              </div>

              <div className="hidden xl:flex items-center space-x-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <MachineListActionBar
                  machine={machine}
                  isExpanded={false}
                  isDockerCommandStepsNull={isDockerCommandStepsNull}
                />
              </div>
            </>
          )}
        </div>
        <div className="flex flex-row gap-2 items-center w-full justify-end">
          {isExpanded && (
            <div className="hidden xl:flex items-center space-x-2">
              <MachineListActionBar
                machine={machine}
                isExpanded={true}
                isDockerCommandStepsNull={isDockerCommandStepsNull}
              />
            </div>
          )}
          {!isExpanded && (
            <>
              <div className="hidden xl:block xl:max-w-[250px] xl:w-full">
                <MachineListItemEvents
                  isExpanded={false}
                  events={{ data: events, isLoading }}
                  machine={machine}
                />
              </div>
              {machine.machine_version && (
                <Badge
                  variant={"outline"}
                  className="!text-[11px] !font-semibold !font-mono"
                >
                  v{machine.machine_version}
                </Badge>
              )}
              {machine.type && (
                <Badge
                  variant={"outline"}
                  className="!text-2xs !font-semibold hidden xl:block"
                >
                  {machine.type === "comfy-deploy-serverless"
                    ? "serverless"
                    : machine.type}
                </Badge>
              )}
            </>
          )}
          <Badge
            variant={hasActiveEvents ? "green" : "secondary"}
            className="!text-2xs !font-semibold flex items-center gap-1"
          >
            {hasActiveEvents ? (
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            ) : (
              <Pause className="w-3 h-3 text-muted-foreground" />
            )}
            {hasActiveEvents ? "Running" : "Idle"}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>
      </div>

      <div
        className={`grid transition-all duration-300 w-full z-[2] ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div
          className={cn(
            "overflow-hidden transition-opacity duration-200 delay-150",
            isExpanded ? "opacity-100" : "opacity-0"
          )}
        >
          {isExpanded && (
            <>
              {/* details */}
              <div className="space-y-3 py-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <div className="flex flex-row gap-2 items-center mb-2">
                      <Zap
                        className={`w-4 h-4 ${
                          hasActiveEvents
                            ? "text-yellow-500"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          hasActiveEvents
                            ? "text-yellow-500 font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        Last active: {getLastActiveText(events)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col justify-center">
                        <h3 className="text-xs font-medium">Machine ID</h3>
                        <span className="text-2xs text-muted-foreground font-mono block w-full truncate">
                          {machine.id}
                        </span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="text-xs font-medium">Status</h3>
                        <MachineStatus machine={machine} />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-medium">Specifications</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-row gap-2 items-center text-xs">
                          <HardDrive className="w-4 h-4" />
                          {machine.gpu}
                        </div>
                        <div className="flex flex-row gap-2 items-center text-xs">
                          <MemoryStick className="w-4 h-4" />
                          {machine.gpu ? CPU_MEMORY_MAP[machine.gpu] : ""}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-medium">Custom Nodes</h3>
                      <CustomNodeList machine={machine} />
                    </div>

                    <div>
                      <h3 className="text-xs font-medium">Workflows</h3>
                      <MachineListItemWorkflows machine={machine} />
                    </div>

                    <div>
                      <h3 className="text-xs font-medium">Deployments</h3>
                      <MachineListItemDeployments machine={machine} />
                    </div>

                    {isDeprecated && (
                      <div>
                        <Alert
                          variant="warning"
                          className="py-2 px-3 rounded-sm max-w-[500px] mt-2"
                        >
                          <div className="flex flex-row gap-2 items-center">
                            <div className="flex items-center justify-center">
                              <AlertCircleIcon className="h-3 w-3" />
                            </div>
                            <AlertTitle className="text-xs mb-0">
                              Deprecated Machine
                            </AlertTitle>
                          </div>
                          <AlertDescription className="text-2xs ml-5">
                            This machine is running an{" "}
                            <span className="font-semibold">
                              outdated version
                            </span>{" "}
                            and{" "}
                            <span className="font-semibold">
                              no longer supported
                            </span>
                            .
                            <br /> Please upgrade to the latest version to
                            ensure compatibility and access new features.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </div>

                  <div>
                    <MachineListItemEvents
                      isExpanded={true}
                      events={{ data: events, isLoading }}
                      machine={machine}
                    />
                  </div>
                </div>
              </div>
              {/* footer */}
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center">
                  {machine.machine_version && (
                    <Badge
                      variant={"outline"}
                      className="!text-[11px] !font-semibold !font-mono"
                    >
                      v{machine.machine_version}
                    </Badge>
                  )}
                  {machine.type && (
                    <Badge
                      variant={"outline"}
                      className="!text-2xs !font-semibold"
                    >
                      {machine.type}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {getRelativeTime(machine.updated_at)}
                  </span>
                </div>

                {machineActionItemList}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Conditionally wrap with ShineBorder
  return hasActiveEvents ? (
    <ShineBorder
      color="green"
      className="p-0 w-full"
      borderRadius={10}
      borderWidth={2}
    >
      {content}
    </ShineBorder>
  ) : (
    content
  );
}

const MachineListActionBar = ({
  machine,
  isExpanded,
  isDockerCommandStepsNull,
}: {
  machine: any;
  isExpanded: boolean;
  isDockerCommandStepsNull: boolean;
}) => {
  return (
    <>
      <a href={`/machines/${machine.id}`}>
        <Button variant="ghost" size={isExpanded ? "sm" : "icon"}>
          {isExpanded && (
            <span className="text-muted-foreground mr-2 font-normal text-xs">
              Dashboard
            </span>
          )}
          <LineChart className="w-4 h-4 text-muted-foreground" />
        </Button>
      </a>
      <Separator orientation="vertical" className="h-4" />
      {!isDockerCommandStepsNull && (
        <>
          <a href={`/machines/${machine.id}?view=settings`}>
            <Button variant="ghost" size={isExpanded ? "sm" : "icon"}>
              {isExpanded && (
                <span className="text-muted-foreground mr-2 font-normal text-xs">
                  Edit
                </span>
              )}
              <Settings className="w-4 h-4 text-muted-foreground" />
            </Button>
          </a>
          <Separator orientation="vertical" className="h-4" />
        </>
      )}
      <a href={`/machines/${machine.id}?view=logs`}>
        <Button variant="ghost" size={isExpanded ? "sm" : "icon"}>
          {isExpanded && (
            <span className="text-muted-foreground mr-2 font-normal text-xs">
              Logs
            </span>
          )}
          <FileClock className="w-4 h-4 text-muted-foreground" />
        </Button>
      </a>
    </>
  );
};

export function MachineListItemEvents({
  isExpanded,
  events,
  machine,
}: {
  isExpanded: boolean;
  events: {
    data: Awaited<ReturnType<typeof useMachineEvents>>["data"];
    isLoading: boolean;
  };
  machine: any;
}) {
  // Generate chart data for last 24 hours
  const generateChartData = () => {
    if (!events.data) return [];

    const now = new Date();

    // Create hourly slots for the last 24 hours
    const hourlySlots = Array.from({ length: 24 }, (_, i) => {
      const hour = subHours(now, 23 - i);
      return {
        dateTime: format(hour, "MM/dd HH:mm"),
        time: format(hour, "HH:mm"),
        containers: 0,
      };
    });

    // Count active containers for each hour
    hourlySlots.forEach((slot, index) => {
      const slotStart = subHours(now, 23 - index);
      const slotEnd = index === 23 ? now : subHours(now, 22 - index);

      let activeContainers = 0;
      events.data?.forEach((event) => {
        const startTime = new Date(event.start_time?.toLocaleString() || "");
        const endTime = event.end_time
          ? new Date(event.end_time.toLocaleString() || "")
          : addHours(now, 1);

        if (
          isAfter(startTime, slotEnd) === false &&
          isAfter(endTime, slotStart) === true
        ) {
          activeContainers++;
        }
      });

      slot.containers = activeContainers;
    });
    return hourlySlots;
  };

  const chartData = generateChartData();

  const chartConfig = {
    containers: {
      label: "Containers",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  if (machine.type !== "comfy-deploy-serverless") {
    return null;
  }

  return (
    <div>
      {isExpanded && (
        <h3 className="text-xs font-medium mb-2">24hrs Activity</h3>
      )}
      <ChartContainer
        config={chartConfig}
        className={cn("w-full", isExpanded ? "max-h-[250px]" : "max-h-[40px]")}
      >
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <defs>
            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.8}
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          {isExpanded && (
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
          )}
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          {isExpanded && (
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, "auto"]}
              allowDecimals={false}
            />
          )}
          <Area
            dataKey="containers"
            type="step"
            fill="url(#fillDesktop)"
            fillOpacity={0.4}
            stroke="hsl(var(--primary))"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
      {isExpanded && (
        <span className="text-2xs text-muted-foreground">
          Note: Number of containers running in the past 24 hours.
        </span>
      )}
    </div>
  );
}

function MachineListItemWorkflows({ machine }: { machine: any }) {
  const { data: workflows, isLoading: isWorkflowsLoading } = useQuery({
    queryKey: ["workflows", "all"],
  });

  return (
    <>
      {isWorkflowsLoading ? (
        <div className="flex items-center text-xs text-muted-foreground">
          <Skeleton className="w-20 h-4" />
        </div>
      ) : (
        <div className="flex flex-row flex-wrap gap-2">
          {(
            workflows as Array<{
              id: string;
              selected_machine_id: string;
              name: string;
            }>
          )
            ?.filter((w) => w.selected_machine_id === machine.id)
            .map((workflow) => (
              <a
                key={workflow.id}
                href={`/workflows/${workflow.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-2xs bg-gray-50 py-0.5 px-2 rounded-sm w-fit"
              >
                <span className="truncate">{workflow.name}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
        </div>
      )}
    </>
  );
}

function MachineListItemDeployments({
  machine,
  isExpanded = true,
}: {
  machine: any;
  isExpanded?: boolean;
}) {
  const { data: deployments, isLoading: isDeploymentsLoading } = useQuery({
    queryKey: ["deployments"],
  });

  return (
    <>
      {isDeploymentsLoading ? (
        isExpanded ? (
          <div className="flex items-center text-xs text-muted-foreground">
            <Skeleton className="w-20 h-4" />
          </div>
        ) : (
          <></>
        )
      ) : (
        <div className="flex flex-row flex-wrap gap-2">
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
            .slice(0, isExpanded ? undefined : 1)
            .map((deployment) => (
              <div
                key={deployment.id}
                className="flex items-center justify-between gap-2 text-2xs bg-gray-50 py-0.5 px-2 rounded-sm w-fit"
              >
                <a
                  href={`/workflows/${deployment.workflow_id}?view=deployment`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <span className="truncate">{deployment.workflow.name}</span>
                  <Badge
                    variant={
                      deployment.environment === "production"
                        ? "blue"
                        : "yellow"
                    }
                    className="!text-[10px] !leading-tight"
                  >
                    {deployment.environment}
                  </Badge>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
