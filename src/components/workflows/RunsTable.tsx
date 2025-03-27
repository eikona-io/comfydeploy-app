import { LoadingWrapper } from "@/components/loading-wrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { RunInputs } from "@/components/workflows/RunInputs";
import { RunOutputs } from "@/components/workflows/RunOutputs";
import { getRelativeTime } from "@/lib/get-relative-time";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, Settings2Icon, Trash, X } from "lucide-react";
import { useQueryState } from "nuqs";
import React, { useEffect, useState } from "react";
import { create } from "zustand";
import { ErrorBoundary } from "@/components/error-boundary";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LiveStatus } from "@/components/workflows/LiveStatus";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { FileURLRender, getTotalUrlCountAndUrls } from "./OutputRender";
import {
  getEnvColor,
  useWorkflowDeployments,
} from "../workspace/ContainersTable";
import type { Deployment } from "../deployment/deployment-page";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface RunsTableState {
  selectedRun: any | null;
  selectedCell: any | null;
  setSelectedRun: (id: any | null) => void;
  setSelectedCell: (cell: any | null) => void;
}

export const useRunsTableStore = create<RunsTableState>((set) => ({
  selectedRun: null,
  selectedCell: null,
  setSelectedRun: (run) => set({ selectedRun: run }),
  setSelectedCell: (cell) => set({ selectedCell: cell }),
}));

export function RunsTable(props: {
  workflow_id: string;
  // searchParams: { [key: string]: any };
  minimal?: boolean;
  filterWorkspace?: boolean;
  loadingIndicatorClassName?: string;
  defaultData?: any;
}) {
  const selectedRun = useRunsTableStore((state) => state.selectedRun);

  const [_, setRunID] = useQueryState("runID");

  const handleClick = () => {
    if (selectedRun) {
      setRunID(selectedRun.id);
      useRunsTableStore.setState({ selectedRun: null });
    }
  };

  return (
    <>
      <ErrorBoundary
        fallback={(e) => (
          <Card className="p-4 text-red-500">
            <p>Error: {e.message}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-2"
              variant="outline"
            >
              Refresh
            </Button>
          </Card>
        )}
      >
        <RunsTableVirtualized
          defaultData={props.defaultData}
          workflow_id={props.workflow_id}
          minimal={props.minimal}
          filterWorkspace={props.filterWorkspace}
          loadingIndicatorClassName={props.loadingIndicatorClassName}
          arrowNavigateRequests={true}
        />
      </ErrorBoundary>
      <Dialog
        open={!!selectedRun}
        onOpenChange={() => useRunsTableStore.setState({ selectedRun: null })}
      >
        <DialogContent className="flex h-fit max-h-[calc(100vh-2rem)] max-w-3xl flex-col">
          <DialogHeader>
            <DialogTitle>Run outputs</DialogTitle>
            <DialogDescription>
              <div className="flex items-center justify-between">
                You can view your run&apos;s outputs here
                <Button variant="outline" onClick={handleClick}>
                  <Settings2Icon size={16} /> Tweak it
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
          {/* <div className="h-full overflow-y-scroll"> */}
          {selectedRun && (
            <ScrollArea className="flex w-full flex-col pr-4">
              <RunInputs run={selectedRun} />
              <LoadingWrapper tag="output">
                <RunOutputs run={selectedRun} />
              </LoadingWrapper>
            </ScrollArea>
          )}
          {/* </div> */}
          {/* <div className="max-h-96 overflow-y-scroll">{view}</div> */}
        </DialogContent>
      </Dialog>
    </>
  );
}

const DEFAULT_ITEM_HEIGHT = 40; // Keep the default, but allow it to be overridden
const BATCH_SIZE = 20; // Adjust this value based on your needs

// Create a new prop type for the custom row renderer
type RunRowRendererProps = {
  run: any | null;
  isSelected: boolean;
  onSelect: () => void;
  setInputValues: (values: any) => void;
};

type RunRowRenderer = (props: RunRowRendererProps) => React.ReactNode;

export function useRuns(props: {
  workflow_id: string;
  defaultData?: any;
  status?: string;
  deployment_id?: string;
}) {
  return useInfiniteQuery({
    queryKey: ["v2", "workflow", props.workflow_id, "runs"],
    meta: {
      limit: BATCH_SIZE,
      params: {
        ...(props.status ? { status: props.status } : {}),
        ...(props.deployment_id ? { deployment_id: props.deployment_id } : {}),
      },
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length === BATCH_SIZE
        ? allPages?.length * BATCH_SIZE
        : undefined;
    },
    initialPageParam: 0,
    initialData: props.defaultData
      ? {
          pages: [props.defaultData],
          pageParams: [0],
        }
      : undefined,
    refetchOnWindowFocus: false,
  });
}

// Update the RunsTableVirtualized props
export function RunsTableVirtualized(props: {
  defaultData?: any;
  workflow_id: string;
  minimal?: boolean;
  filterWorkspace?: boolean;
  loadingIndicatorClassName?: string;
  itemHeight?: number; // New prop for custom height
  RunRowComponent?: RunRowRenderer; // New prop for custom row renderer
  className?: string;
  setInputValues?: (values: any) => void; // for tweaking run inputs
  arrowNavigateRequests?: boolean;
}) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const [runId, setRunId] = useQueryState("run-id");

  const [filterFavorites, setFilterFavorites] = useQueryState("favorite");

  const [deploymentId, setDeploymentId] = useQueryState("filter-deployment-id");
  const [filterStatus, setFilterStatus] = useQueryState("filter-status");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isRefetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useRuns({
    ...props,
    deployment_id: deploymentId || undefined,
    status: filterStatus || undefined,
  });

  useEffect(() => {
    if (deploymentId) {
      refetch();
    }
    if (filterStatus) {
      refetch();
    }
  }, [deploymentId, filterStatus]);

  const [viewPage, setViewPage] = useQueryState("view");

  // Refetch when filterFavorites or RunRowComponent changes
  useEffect(() => {
    if (viewPage === "api") setFilterFavorites(null);

    refetch();
  }, [filterFavorites, viewPage, refetch]);

  const flatData = React.useMemo(() => data?.pages.flat() ?? [], [data]);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? flatData?.length + 1 : flatData?.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => props.itemHeight || DEFAULT_ITEM_HEIGHT,
    overscan: 5,
  });

  // Add state for the current index, but don't initialize it
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  // Add state to track if a key is already pressed to prevent rapid firing
  const isKeyDownRef = React.useRef(false);

  // Handle arrow key navigation
  useEffect(() => {
    if (!props.arrowNavigateRequests) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const isTyping =
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement).tagName,
        ) || (e.target as HTMLElement).isContentEditable;

      // Don't handle navigation if typing or key is already down
      if (!flatData.length || isKeyDownRef.current || isTyping) return;

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        isKeyDownRef.current = true;

        setCurrentIndex((prev) => {
          // If no current selection, select the first item on any arrow key
          if (prev === null) {
            setRunId(flatData[0].id);
            return 0;
          }

          // Otherwise move up or down accordingly
          const nextIndex =
            e.key === "ArrowDown"
              ? Math.min(prev + 1, flatData.length - 1)
              : Math.max(prev - 1, 0);

          if (nextIndex >= 0 && nextIndex < flatData.length) {
            setRunId(flatData[nextIndex].id);
          }
          return nextIndex;
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        isKeyDownRef.current = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [flatData, setRunId, props.arrowNavigateRequests]);

  // Update currentIndex if runId changes from outside (e.g., from clicking)
  useEffect(() => {
    if (runId && flatData.length > 0) {
      const index = flatData.findIndex((run) => run.id === runId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [runId, flatData]);

  // Update virtualizer to scroll to the current item
  useEffect(() => {
    if (currentIndex !== null && rowVirtualizer) {
      rowVirtualizer.scrollToIndex(currentIndex, { align: "center" });
    }
  }, [currentIndex, rowVirtualizer]);

  useEffect(() => {
    const lastItem = rowVirtualizer.getVirtualItems().at(-1);
    if (!lastItem) {
      return;
    }
    if (
      lastItem.index >= flatData.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    flatData.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  // const [selectedRunId, setSelectedRunId] = React.useState<string | null>(null);
  const setSelectedCell = useRunsTableStore((state) => state.setSelectedCell);
  const selectedRunId = useRunsTableStore((state) => state.selectedRun?.id);

  const { data: run } = useQuery({
    queryKey: ["run", runId],
    enabled: !!runId,
    queryFn: async ({ queryKey, pageParam, meta }) => {
      if (!runId) return null;

      const temporary = flatData.find((r) => r.id === runId);
      if (!temporary) {
        const response = await api({
          url: queryKey.join("/"),
        });

        return response;
      }
      return temporary;
    },
    initialData: flatData.find((r) => r.id === runId),
  });

  useEffect(() => {
    if (run) {
      setSelectedCell(run);
    }
  }, [run]);

  if (status === "pending" && !data) {
    return <LoadingState />;
  }

  if (!data || flatData.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p className="p-4 text-muted-foreground text-xs">No runs available</p>
      </div>
    );
  }

  const { workflow_api, workflow_inputs, run_log, ...rest } = run ?? {};

  return (
    <div>
      <div
        ref={parentRef}
        className={cn(
          "scrollbar scrollbar-thumb-gray-200 scrollbar-track-transparent h-[calc(100vh-10rem)] overflow-y-scroll transition-opacity duration-300",
          isRefetching && "pointer-events-none opacity-50",
          props.className,
        )}
        tabIndex={0}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const run = flatData[virtualRow.index];
            return (
              <div
                key={virtualRow.index}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {run ? (
                  <RunRow
                    run={run}
                    isSelected={runId === run.id}
                    onSelect={() => {
                      setRunId(run.id);
                    }}
                    refetch={refetch}
                  />
                ) : hasNextPage ? (
                  <LoadingRow />
                ) : null}
              </div>
            );
          })}
        </div>
        {isFetchingNextPage && (
          <div className="flex items-center justify-center py-4">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingRow() {
  return (
    <div className="flex h-[42px] items-center justify-between overflow-hidden border-b p-2">
      <div className="grid w-full grid-cols-12 items-center gap-2">
        <Skeleton className="col-span-1 h-4 w-8" />
        <Skeleton className="col-span-2 h-6 w-16" />
        <Skeleton className="col-span-2 h-4 w-12" />
        <Skeleton className="col-span-2 h-4 w-20" />
        <div className="col-span-5 flex justify-end">
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    </div>
  );
}

function RunRow({
  run,
  isSelected,
  onSelect,
  refetch,
}: {
  run: any | null;
  isSelected: boolean;
  onSelect: () => void;
  refetch: () => void;
}) {
  const rowRef = React.useRef<HTMLDivElement>(null);
  const [rowWidth, setRowWidth] = React.useState<number | null>(null);

  // Use ResizeObserver to track width changes
  React.useEffect(() => {
    if (!rowRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) {
        setRowWidth(width);
      }
    });

    resizeObserver.observe(rowRef.current);

    // Clean up observer when component unmounts
    return () => resizeObserver.disconnect();
  }, []);

  if (!run) {
    return <LoadingRow />;
  }

  const isRunDetailOpenAndTooNarrow = rowWidth && rowWidth < 650;

  // Truncate the UUID to first 8 characters
  const truncatedId = run.id.substring(0, 6);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      ref={rowRef}
      className={cn(
        "flex h-[42px] cursor-pointer items-center justify-between overflow-hidden border-b p-2 text-sm transition-all",
        isSelected
          ? "bg-gray-50 shadow-md"
          : "hover:bg-gray-100 hover:shadow-sm",
      )}
      onClick={() => {
        onSelect();
      }}
    >
      <div
        className={cn(
          "grid w-full items-center gap-2",
          isRunDetailOpenAndTooNarrow ? "grid-cols-8" : "grid-cols-12",
        )}
      >
        <span className="col-span-1 font-mono text-[10px] text-gray-500">
          #{truncatedId}
        </span>
        <span className="col-span-2">
          <DeploymentVersion deploymentId={run.deployment_id} />
        </span>
        <span className="col-span-1">
          <DisplayVersion versionId={run.workflow_version_id} />
        </span>
        {!isRunDetailOpenAndTooNarrow && (
          <span className="col-span-1">
            {run.gpu && (
              <Badge className="!text-2xs w-fit" variant="outline">
                {run.gpu}
              </Badge>
            )}
          </span>
        )}
        <span className="col-span-2 text-2xs text-gray-500">
          {getRelativeTime(run.created_at)}
        </span>
        {!isRunDetailOpenAndTooNarrow && (
          <div className="col-span-3">
            <OutputPreview runId={run.id} />
          </div>
        )}
        <div className="col-span-2 flex items-center justify-end gap-2">
          <LiveStatus run={run} refetch={refetch} />
        </div>
      </div>
    </div>
  );
}

function OutputPreview(props: { runId: string }) {
  const { data: run, isLoading } = useQuery<any>({
    queryKey: ["run", props.runId],
    queryKeyHashFn: (queryKey) => [...queryKey, "outputs"].toString(),
    refetchInterval: (query) => {
      if (
        query.state.data?.status === "running" ||
        query.state.data?.status === "uploading" ||
        query.state.data?.status === "not-started" ||
        query.state.data?.status === "queued"
      ) {
        return 2000;
      }
      return false;
    },
  });

  if (isLoading) return <Skeleton className="h-6 w-24" />;

  const { urls: urlList } = getTotalUrlCountAndUrls(run.outputs || []);

  const MAX_DISPLAY = 2;
  const urlsToDisplay =
    urlList.length > 0 ? urlList.slice(0, MAX_DISPLAY) : urlList;
  const remainingCount = urlList.length - MAX_DISPLAY;

  if (urlsToDisplay.length === 0) return null;

  return (
    <div className="pointer-events-none flex flex-row items-center gap-2">
      {urlsToDisplay.map((url) => (
        <div key={url.url}>
          <FileURLRender
            url={url.url}
            imgClasses="h-8 w-8 rounded-[8px] object-cover"
            lazyLoading={true}
          />
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="ml-1 whitespace-nowrap text-2xs text-muted-foreground">
          +{remainingCount} more
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col">
      {[...Array(20)].map((_, index) => (
        <LoadingRow key={index} />
      ))}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="h-6 w-6 animate-spin rounded-full border-gray-900 border-b-2" />
  );
}

function DisplayVersion(props: { versionId?: string }) {
  const { data: version } = useQuery({
    queryKey: ["workflow-version", props.versionId],
    queryFn: async ({ queryKey }) => {
      const response = await api({ url: queryKey.join("/") });
      return response;
    },
  });

  if (!version) return null;

  return (
    <Badge className="!text-2xs w-fit px-2 text-gray-500">
      v{version?.version}
    </Badge>
  );
}

function DeploymentVersion(props: { deploymentId?: string }) {
  const { data: deployment } = useQuery<Deployment>({
    queryKey: ["deployment", props.deploymentId],
    enabled: !!props.deploymentId,
  });

  if (!deployment) return null;

  if (!["staging", "production"].includes(deployment.environment)) {
    return null;
  }

  return (
    <Badge
      className={cn(
        "!text-2xs w-fit px-2",
        getEnvColor(deployment.environment),
      )}
    >
      {deployment.environment}
    </Badge>
  );
}

export function FilterDropdown({
  workflowId,
  buttonSize,
  isDeploymentPage = false,
}: {
  workflowId: string;
  buttonSize?: string;
  isDeploymentPage?: boolean;
}) {
  const [statusFilter, setStatusFilter] = useQueryState("filter-status");
  const [deploymentIdFilter, setDeploymentIdFilter] = useQueryState(
    "filter-deployment-id",
  );

  const { data: deployments } = useWorkflowDeployments(workflowId);

  // Group deployments by environment
  const deploymentsByEnvironment = React.useMemo(() => {
    if (!deployments) return {};

    return deployments.reduce(
      (acc: { [key: string]: Deployment[] }, deployment: Deployment) => {
        const env = deployment.environment;
        if (!acc[env]) {
          acc[env] = [];
        }
        acc[env].push(deployment);
        return acc;
      },
      {},
    );
  }, [deployments]);

  // Get environment names for the dropdown
  const environments = React.useMemo(() => {
    return Object.keys(deploymentsByEnvironment).filter((env) =>
      ["production", "staging"].includes(env),
    );
  }, [deploymentsByEnvironment]);

  // Set default environment filter for deployment page
  React.useEffect(() => {
    if (
      isDeploymentPage &&
      deployments &&
      (!deploymentIdFilter || deploymentIdFilter === "")
    ) {
      const setDefaultEnvironment = async () => {
        // Try to set production as default
        if (deploymentsByEnvironment.production?.length > 0) {
          await setDeploymentIdFilter(
            deploymentsByEnvironment.production[0].id,
          );
        }
        // Fall back to staging if production doesn't exist
        else if (deploymentsByEnvironment.staging?.length > 0) {
          await setDeploymentIdFilter(deploymentsByEnvironment.staging[0].id);
        }
      };

      setDefaultEnvironment();
    }
  }, [
    isDeploymentPage,
    deployments,
    deploymentIdFilter,
    deploymentsByEnvironment,
    setDeploymentIdFilter,
  ]);

  // Get the current environment name based on the deployment ID
  const currentEnvironment = React.useMemo(() => {
    if (!deploymentIdFilter || !deployments) return null;

    const deployment = deployments.find(
      (d: Deployment) => d.id === deploymentIdFilter,
    );
    return deployment?.environment || null;
  }, [deploymentIdFilter, deployments]);

  const { refetch } = useRuns({
    workflow_id: workflowId,
    status: statusFilter || undefined,
    deployment_id: deploymentIdFilter || undefined,
  });

  // Helper function to handle status filter changes
  const handleStatusFilterChange = async (newStatus: string | null) => {
    await setStatusFilter(newStatus);
    refetch();
  };

  // Helper function to handle environment filter changes
  const handleEnvironmentFilterChange = async (environment: string | null) => {
    if (environment === null) {
      await setDeploymentIdFilter(null);
    } else {
      const deploymentsForEnv = deploymentsByEnvironment[environment] || [];
      const latestDeployment =
        deploymentsForEnv.length > 0 ? deploymentsForEnv[0] : null;

      if (latestDeployment) {
        await setDeploymentIdFilter(latestDeployment.id);
      }
    }
    refetch();
  };

  // New function to clear all filters
  const clearAllFilters = async () => {
    await setStatusFilter(null);
    await setDeploymentIdFilter(null);
    refetch();
  };

  // Check if any filters are active
  const hasActiveFilters = statusFilter || deploymentIdFilter;

  return (
    <div className="flex items-center gap-2">
      <div className="hidden flex-wrap items-center gap-1.5 lg:flex">
        {statusFilter && (
          <Badge
            variant={statusFilter === "success" ? "green" : "red"}
            className="cursor-pointer gap-x-1"
            onClick={() => handleStatusFilterChange(null)}
          >
            <span>
              {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </span>
            <X className="h-2.5 w-2.5" />
          </Badge>
        )}

        {currentEnvironment && (
          <Badge
            className={cn(
              getEnvColor(currentEnvironment),
              "cursor-pointer gap-x-1",
            )}
            onClick={() => {
              if (isDeploymentPage) return;
              handleEnvironmentFilterChange(null);
            }}
          >
            <span>
              {currentEnvironment.charAt(0).toUpperCase() +
                currentEnvironment.slice(1)}
            </span>
            <X className="h-2.5 w-2.5" />
          </Badge>
        )}
      </div>

      <div className="relative ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size={buttonSize as "sm" | undefined}
              className="relative focus-visible:ring-transparent"
            >
              <Settings2Icon className="mr-2 h-4 w-4" />
              Filter
              {hasActiveFilters && (
                <>
                  <div className="-right-0.5 -top-0.5 absolute h-3 w-3 rounded-full bg-orange-500" />
                  <div className="-right-0.5 -top-0.5 absolute h-3 w-3 animate-ping rounded-full bg-orange-500" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[220px]">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                handleStatusFilterChange(null);
              }}
            >
              All
              {!statusFilter && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                handleStatusFilterChange("success");
              }}
            >
              <div className="flex items-center">
                <Badge variant={"green"}>Success</Badge>
              </div>
              {statusFilter === "success" && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                handleStatusFilterChange("failed");
              }}
            >
              <div className="flex items-center">
                <Badge variant={"red"}>Failed</Badge>
              </div>
              {statusFilter === "failed" && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>

            {environments.length > 0 && (
              <>
                <DropdownMenuLabel className="mt-2">
                  Environment
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    handleEnvironmentFilterChange(null);
                  }}
                >
                  All
                  {!currentEnvironment && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                {environments.map((env) => (
                  <DropdownMenuItem
                    key={env}
                    onClick={(e) => {
                      e.preventDefault();
                      handleEnvironmentFilterChange(env);
                    }}
                  >
                    <div className="flex items-center">
                      <Badge className={cn("mr-2", getEnvColor(env))}>
                        {env}
                      </Badge>
                    </div>
                    {currentEnvironment === env && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </>
            )}

            {hasActiveFilters && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    clearAllFilters();
                  }}
                  className="text-red-500"
                >
                  <div className="flex w-full items-center justify-between">
                    Clear all filters
                    <Trash className="h-4 w-4" />
                  </div>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
