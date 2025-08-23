"use client";

import { ErrorBoundary } from "@/components/error-boundary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RunDuration } from "@/components/workflows/RunDuration";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/lib/api";
import { getDuration } from "@/lib/get-relative-time";
// import { cancelFunction } from "@/server/curdMachine";
import { CircleX, Zap } from "lucide-react";
import { type ReactNode, useCallback, useMemo } from "react";
import { toast } from "sonner";

export function LiveStatus({
  run,
  minimal = false,
  isForRunPage = false,
  hideProgressAndStatus = false,
  refetch,
}: {
  run: any;
  minimal?: boolean;
  isForRunPage?: boolean;
  hideProgressAndStatus?: boolean;
  refetch?: () => void;
}) {
  const { workflow_api, workflow_inputs, run_log, ...rest } = run;

  const { status, liveStatus, realtimeStatus, canBeCancelled, ended } =
    useMemo(() => {
      const status = run.status;
      let liveStatus: ReactNode = null;
      const realtimeStatus: ReactNode = run.live_status
        ?.replace("Executing", "")
        .trim();

      if (status !== "success" && !run.is_realtime) {
        liveStatus = realtimeStatus;
      }

      if (run.is_realtime) {
        liveStatus = (
          <div className="flex items-center gap-2 text-sm">
            Realtime <Zap size={14} />
          </div>
        );
      }

      const ended = ["success", "failed", "timeout", "cancelled"].includes(
        run.status,
      );

      const canBeCancelled =
        run.machine_type === "comfy-deploy-serverless" &&
        !ended &&
        run.modal_function_call_id;

      return { status, liveStatus, realtimeStatus, canBeCancelled, ended };
    }, [run]);

  const handleCancel = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (run.modal_function_call_id) {
        try {
          const res = await api({
            url: `run/${run.id}/cancel`,
            init: {
              method: "POST",
            },
          });

          toast.success(res.message);
          refetch?.();
        } catch (error: any) {
          toast.error(`Failed to cancel: ${error.message}`);
        }
      }
    },
    [run.id, run.modal_function_call_id, refetch],
  );

  if (isForRunPage) {
    return (
      <div className="w-full">
        {/* Compact Live Status Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Live Status Text */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-medium text-muted-foreground">Live Status</span>
              {!ended && realtimeStatus ? (
                <span className="text-xs text-foreground truncate">{liveStatus}</span>
              ) : (
                <span className="text-xs text-muted-foreground">Waiting...</span>
              )}
            </div>
            
            {/* Duration and Badge */}
            <div className="flex items-center gap-2">
              <ErrorBoundary fallback={(error) => <div>{error.message}</div>}>
                <RunDuration
                  run={run}
                  liveStatus={liveStatus}
                  status={status}
                  realtimeStatus={realtimeStatus}
                />
              </ErrorBoundary>
              {!ended &&
                !liveStatus &&
                run.machine_type === "comfy-deploy-serverless" &&
                (run.queued_at !== undefined ? (
                  <></>
                ) : (
                  <Badge variant="secondary" className="text-2xs">In Queue</Badge>
                ))}
            </div>
          </div>

          {/* Cancel Button aligned with status and time */}
          {canBeCancelled && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleCancel}
              className="h-7 px-3 text-xs"
            >
              Cancel
            </Button>
          )}
        </div>

        {/* Progress Bar - always show with skeleton when no progress */}
        <div className="mt-2">
          {!ended ? (
            <Progress 
              value={realtimeStatus && run.progress !== undefined ? run.progress * 100 : 0} 
              className="w-full h-1.5" 
            />
          ) : null}
        </div>
      </div>
    );
  }

  // ended = false;
  // realtimeStatus = "Executing";
  // liveStatus = "Executing";

  return (
    <>
      {!ended && realtimeStatus && !hideProgressAndStatus && (
        <div className="col-span-2 w-full max-w-[260px] flex-col items-start gap-1 text-2xs">
          <div className="whitespace-nowrap">{liveStatus}</div>
          <Progress
            value={run.progress * 100}
            className="w-full max-w-[260px]"
          />
        </div>
      )}
      <div className="col-span-3 flex items-center justify-end space-x-2">
        <div className="flex flex-col items-start">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-2xs">
            {!ended &&
              !liveStatus &&
              run.machine_type === "comfy-deploy-serverless" &&
              (run.queued_at !== undefined ? (
                // <Badge className="text-2xs">Cold Starting</Badge>
                <></>
              ) : (
                <Badge className="text-2xs">In Queue</Badge>
              ))}
          </div>
        </div>
        <ErrorBoundary
          fallback={(error) => (
            <Tooltip>
              <TooltipTrigger className=" rounded-md p-1 hover:bg-gray-100">
                <CircleX className="text-red-500" />
              </TooltipTrigger>
              <TooltipContent
                className="flex flex-col gap-1 p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <h1 className="font-bold text-lg">Error</h1>
                <h3>{error.message}</h3>
                {liveStatus}
                <div>Total: {getDuration(run.duration)}</div>

                <div className="h-[200px]">
                  <ScrollArea className="h-full w-full">
                    <pre className="h-fit whitespace-pre-wrap">
                      {JSON.stringify(rest, null, 2)}
                    </pre>
                  </ScrollArea>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        >
          <RunDuration
            run={run}
            liveStatus={liveStatus}
            status={status}
            realtimeStatus={realtimeStatus}
          />
        </ErrorBoundary>
        {canBeCancelled && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="h-6 rounded-[10px] px-2 py-1 text-2xs"
          >
            Cancel
          </Button>
        )}
      </div>
    </>
  );
}
