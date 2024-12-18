"use client";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogsViewer } from "@/components/workflows/LogsViewer";

export function LogDialog({
  run,
  children,
  open,
  onOpenChange,
}: {
  run: any;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  if (!run.run_log) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="grid h-full max-h-[600px] grid-rows-[auto,1fr,auto] sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Run Log</DialogTitle>
        </DialogHeader>
        <LogsViewer logs={run.run_log} stickToBottom={false} />
        <DialogFooter>
          <CopyButton
            className="aspect-auto w-fit p-4"
            text={JSON.stringify(run.run_log)}
          >
            Copy
          </CopyButton>
          <DialogClose>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
