"use client";

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
import { Settings2Icon } from "lucide-react";
import { useQueryState } from "nuqs";
import React, { Suspense, use, useEffect } from "react";
import { create } from "zustand";

import { ErrorBoundary } from "@/components/error-boundary";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LiveStatus } from "@/components/workflows/LiveStatus";
import { useRealtimeWorkflow } from "@/components/workflows/RealtimeRunUpdate";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  useInfiniteQuery,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { FileURLRender, getTotalUrlCountAndUrls } from "./OutputRender";
import { getEnvColor } from "../workspace/ContainersTable";
import type { Deployment } from "../deployment/deployment-page";

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
}) {
  return useInfiniteQuery({
    queryKey: ["v2", "workflow", props.workflow_id, "runs"],
    meta: {
      limit: BATCH_SIZE,
      params: { with_outputs: false, with_inputs: false },
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
}) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const [runId, setRunId] = useQueryState("run-id");

  const [filterFavorites, setFilterFavorites] = useQueryState("favorite");

  const { socket, workflowId, connectionStatus } = useRealtimeWorkflow();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useRuns(props);

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

  React.useEffect(() => {
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
          "scrollbar scrollbar-thumb-gray-200 scrollbar-track-transparent h-[calc(100vh-10rem)] overflow-y-scroll",
          props.className,
        )}
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
        {/* <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-full rounded-b-md bg-gradient-to-b from-transparent to-white" /> */}
        {/* <ScrollBar orientation="vertical" /> */}
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
  const { data: version, isLoading } = useQuery({
    queryKey: ["workflow-version", props.versionId],
    queryFn: async ({ queryKey }) => {
      const response = await api({ url: queryKey.join("/") });
      return response;
    },
  });

  if (isLoading) return <Skeleton className="h-5 w-[28px]" />;

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
