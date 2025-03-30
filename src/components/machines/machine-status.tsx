import { differenceInHours } from "date-fns";
import {
  AlertTriangle,
  Check,
  Clock,
  ExternalLink,
  Pause,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { LoadingIcon } from "@/components/ui/custom/loading-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function MachineStatus(props: {
  machine: Pick<
    any,
    | "keep_warm"
    | "disabled"
    | "status"
    | "static_assets_status"
    | "updated_at"
    | "import_failed_logs"
  >;
  mini?: boolean;
}) {
  const isStale = useMemo(() => {
    if (props.machine.status === "building") {
      const buildDuration = differenceInHours(
        new Date(),
        new Date(props.machine.updated_at),
      );
      return buildDuration >= 1;
    }
    return false;
  }, [props.machine.status, props.machine.updated_at]);

  const importFailedLogs = useMemo<
    { logs: string; timestamp: string }[]
  >(() => {
    if (
      !props.machine.import_failed_logs ||
      props.machine.import_failed_logs.length === 0
    )
      return [];
    return JSON.parse(props.machine.import_failed_logs);
  }, [props.machine.import_failed_logs]);

  const isImportFailed = useMemo(() => {
    return importFailedLogs.length > 0;
  }, [importFailedLogs]);

  const [showImportFailedDialog, setShowImportFailedDialog] = useState(false);

  if (props.mini) {
    return (
      <div className="flex gap-1">
        {/* {props.machine.keep_warm > 0 && <Flame size={16} className="text-fuchsia-500" />} */}
        {props.machine.disabled && <X size={16} className="text-red-500" />}
        {props.machine.status === "building" && !isStale && <LoadingIcon />}
        {isStale && <Clock size={16} className="text-yellow-500" />}
        {props.machine.status === "ready" &&
          (isImportFailed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <AlertTriangle size={16} className="text-yellow-500" />
              </TooltipTrigger>
              <TooltipContent side="right">
                {importFailedLogs.length} nodes import failed during the build
                process.
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="w-2 h-2 rounded-full bg-green-500" />
          ))}
        {props.machine.status === "running" && (
          <div className="w-2 h-2 rounded-full bg-green-500" />
        )}
        {props.machine.status === "paused" && (
          <Pause size={16} className="text-yellow-500" />
        )}
        {props.machine.status === "error" && (
          <AlertTriangle size={16} className="text-red-500" />
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {props.machine.keep_warm > 0 && (
        <Badge className="text-left font-medium truncate" variant="fuchsia">
          {props.machine.keep_warm} Always On
        </Badge>
      )}
      {props.machine.disabled && <Badge variant="destructive">Disabled</Badge>}
      {props.machine.status === "building" && !isStale && (
        <Badge variant="amber" className="capitalize">
          {props.machine.status} <LoadingIcon />
        </Badge>
      )}
      {props.machine.static_assets_status === "building" && (
        <Badge variant="amber" className="capitalize">
          Front end {props.machine.static_assets_status} <LoadingIcon />
        </Badge>
      )}
      {props.machine.static_assets_status === "ready" && (
        <Badge variant="success" className="capitalize">
          Front end {props.machine.static_assets_status}
        </Badge>
      )}
      {props.machine.static_assets_status === "error" && (
        <Badge variant="destructive" className="capitalize">
          Front end {props.machine.static_assets_status}
        </Badge>
      )}
      {!props.machine.disabled &&
        props.machine.status &&
        props.machine.status !== "building" && (
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <Badge
                variant={
                  (props.machine.status === "ready" ||
                    props.machine.status === "running") &&
                  !isImportFailed
                    ? "success"
                    : props.machine.status === "paused" || isImportFailed
                      ? "yellow"
                      : "destructive"
                }
                className={cn(
                  "capitalize",
                  isImportFailed && "cursor-pointer hover:opacity-80",
                )}
                onClick={() => {
                  if (isImportFailed) setShowImportFailedDialog(true);
                }}
              >
                {props.machine.status}
                {isImportFailed && <ExternalLink className="h-3 w-3" />}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="right">
              {importFailedLogs.length} nodes import failed during the build
              process.
            </TooltipContent>
          </Tooltip>
        )}
      {isStale && (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Badge variant="zinc" className="cursor-help">
              Stale <Clock className="ml-1 h-3 w-3" />
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            Build duration exceeded 1 hour. Consider rebuilding the machine.
          </TooltipContent>
        </Tooltip>
      )}

      <Dialog
        open={showImportFailedDialog}
        onOpenChange={setShowImportFailedDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Failed</DialogTitle>
            <DialogDescription>
              The following imports failed during the build process:
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto">
            {importFailedLogs.map((logs, index) => (
              <pre key={index} className="text-sm whitespace-pre-wrap">
                {logs.logs}
              </pre>
            ))}
          </div>
          <DialogFooter>
            <DialogClose
              onClick={() => {
                setShowImportFailedDialog(false);
              }}
            >
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
