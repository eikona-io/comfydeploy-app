"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ArrowDownToLine, Expand } from "lucide-react";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export type LogsType = {
  machine_id?: string;
  logs: string;
  timestamp?: number;
}[];

interface LogContentProps {
  logs: LogsType;
  hideTimestamp?: boolean;
  className?: string;
  initialStickToBottom?: boolean;
}

function LogContent({
  logs,
  hideTimestamp,
  className,
  initialStickToBottom = true,
}: LogContentProps) {
  const container = useRef<HTMLDivElement | null>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(initialStickToBottom);
  const [userHasScrolled, setUserHasScrolled] = useState(false);

  // Handle auto-scroll
  useEffect(() => {
    if (!isAutoScroll) return;

    if (container.current) {
      const scrollHeight = container.current.scrollHeight;
      container.current.scrollTo({
        top: scrollHeight,
        behavior: "instant",
      });
    }
  }, [logs?.length, isAutoScroll]);

  // Detect manual scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!container.current) return;

      const isAtBottom =
        container.current.scrollHeight - container.current.scrollTop ===
        container.current.clientHeight;
      if (!isAtBottom) {
        setIsAutoScroll(false);
        setUserHasScrolled(true);
      }
    };

    container.current?.addEventListener("scroll", handleScroll);
    return () => {
      container.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // console.log("logs", logs);

  return (
    <div className={cn("relative h-full w-full rounded")}>
      <Button
        className={cn(
          "absolute right-2 bottom-2 z-50 opacity-0 transition-opacity duration-300",
          userHasScrolled && !isAutoScroll && "opacity-100",
        )}
        onClick={() => {
          setIsAutoScroll(true);
          setUserHasScrolled(false);
          container.current?.scrollTo({
            top: container.current.scrollHeight,
            behavior: "instant",
          });
        }}
      >
        <ArrowDownToLine className="h-4 w-4" />
      </Button>

      <div
        ref={container}
        className={cn(
          "scrollbar scrollbar-thumb-gray-200 scrollbar-track-transparent relative flex h-full w-full flex-col overflow-x-hidden overflow-y-scroll whitespace-break-spaces bg-[#262626] p-3 font-mono text-gray-300 text-xs",
          className,
          // ,
        )}
      >
        {"map" in logs &&
          logs?.map((x, i) => (
            <div
              key={i}
              className="flex flex-row items-center gap-2 hover:bg-stone-700"
              onClick={() => {
                toast.success("Copied to clipboard");
                navigator.clipboard.writeText(x.logs);
              }}
            >
              {!hideTimestamp && x.timestamp !== undefined && (
                <>
                  <span className="w-[180px] flex-shrink-0">
                    {new Date(x.timestamp * 1000).toLocaleString()}
                  </span>
                  <div className="h-full w-[1px] flex-shrink-0 bg-stone-400" />
                </>
              )}
              <div>{x.logs}</div>
            </div>
          ))}
      </div>
    </div>
  );
}

export function LogsViewer({
  logs: initialLogs,
  hideTimestamp,
  className,
  containerClassName,
  stickToBottom = true,
  children,
}: {
  logs: LogsType;
  hideTimestamp?: boolean;
  containerClassName?: string;
  className?: string;
  stickToBottom?: boolean;
  children?: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const logs = useDeferredValue(initialLogs);

  return (
    <>
      <div
        className={cn(
          "relative isolate h-full overflow-hidden rounded",
          containerClassName,
        )}
      >
        <Button
          // size="icon"
          className="absolute top-2 right-2 z-50"
          onClick={() => setIsExpanded(true)}
        >
          <Expand className="h-4 w-4" />
        </Button>

        {children}
        <LogContent
          logs={logs}
          hideTimestamp={hideTimestamp}
          className={className}
          initialStickToBottom={stickToBottom}
        />
      </div>

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-h-[90vh] max-w-[90vw] bg-[#262626]">
          {/* {children} */}
          <LogContent
            logs={logs}
            hideTimestamp={false}
            className={"h-[80vh]"}
            initialStickToBottom={stickToBottom}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
