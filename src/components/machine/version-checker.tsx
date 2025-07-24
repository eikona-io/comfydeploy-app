import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useMachine } from "@/hooks/use-machine";
import { getRelativeTime } from "@/lib/get-relative-time";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpCircle, Check, Info } from "lucide-react";

interface CustomNodesVersionResponse {
  status: string;
  local_commit: {
    hash: string;
    message: string;
    date: string;
  };
  latest_commit: {
    hash: string;
    message: string;
    date: string;
  };
  is_up_to_date: boolean;
}

interface VersionCheckerProps {
  machineId: string;
  variant?: "inline" | "bottom" | "expanded";
  onUpdate?: () => void;
  hideUpdateButton?: boolean;
  className?: string;
}

export function VersionChecker({
  machineId,
  variant = "inline",
  onUpdate,
  className,
  hideUpdateButton = false,
}: VersionCheckerProps) {
  const { data: machine } = useMachine(machineId);

  const { data, isLoading } = useQuery<CustomNodesVersionResponse>({
    queryKey: ["machine", machineId, "check-custom-nodes"],
  });

  if (machine?.type !== "comfy-deploy-serverless") {
    return null;
  }

  if (isLoading) {
    return (
      <div className="fade-in slide-in-from-bottom-4 animate-in duration-300">
        <div className="flex items-center justify-center">
          <div
            className={cn(
              "h-6 w-32 animate-pulse rounded-full bg-muted",
              className,
            )}
          />
        </div>
      </div>
    );
  }

  if (!data?.is_up_to_date) {
    const localDate = data?.local_commit?.date
      ? getRelativeTime(new Date(data.local_commit.date))
      : "Unknown";
    const latestDate = data?.latest_commit?.date
      ? getRelativeTime(new Date(data?.latest_commit.date))
      : "Unknown";

    if (variant === "expanded") {
      return (
        <div className="fade-in slide-in-from-bottom-4 animate-in duration-300">
          <div className="flex items-center justify-center">
            <div
              className={cn(
                "flex w-full flex-col gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-amber-600 text-sm",
                className,
              )}
            >
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="h-4 w-4" />
                <span>Update Available</span>
                {!hideUpdateButton && onUpdate && (
                  <Button
                    className="h-6 px-2 text-xs hover:bg-amber-500/20 hover:text-amber-600"
                    onClick={onUpdate}
                    size="sm"
                    variant="ghost"
                  >
                    Update
                  </Button>
                )}
              </div>
              <div className="space-y-2 pl-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <div className="font-medium text-xs">Latest Version</div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-amber-500/10 text-xs"
                  >
                    {latestDate}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="font-mono text-[10px] text-muted-foreground/70">
                    {data?.latest_commit.hash?.slice(0, 7)}
                  </div>
                  <div className="line-clamp-6 text-xs">
                    {data?.latest_commit?.message}
                  </div>
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-muted" />
                    <div className="font-medium text-muted-foreground text-xs">
                      Current Version
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {localDate}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="font-mono text-[10px] text-muted-foreground/70">
                    {data?.local_commit.hash?.slice(0, 7)}
                  </div>
                  <div className="text-xs">{data?.local_commit?.message}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fade-in slide-in-from-bottom-4 animate-in duration-300">
        <div className="flex items-center justify-center">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 text-sm cursor-pointer hover:bg-amber-500/20 transition-colors",
                  className,
                )}
              >
                <ArrowUpCircle className="h-4 w-4" />
                <span>Update Available</span>
                {!hideUpdateButton && onUpdate && (
                  <Button
                    className="h-6 px-2 text-xs hover:bg-amber-500/20 hover:text-amber-600"
                    onClick={onUpdate}
                    size="sm"
                    variant="ghost"
                  >
                    Update
                  </Button>
                )}
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Version Details</h4>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        <div className="font-medium text-amber-600 text-xs">
                          Latest Version
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-amber-500/10 text-amber-600 text-xs"
                      >
                        {latestDate}
                      </Badge>
                    </div>
                    <div className="space-y-1 pl-4">
                      <div className="font-mono text-[10px] text-muted-foreground/70">
                        {data?.latest_commit.hash?.slice(0, 7)}
                      </div>
                      <div className="line-clamp-3 text-xs">
                        {data?.latest_commit?.message}
                      </div>
                    </div>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-muted" />
                        <div className="font-medium text-muted-foreground text-xs">
                          Current Version
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {localDate}
                      </Badge>
                    </div>
                    <div className="space-y-1 pl-4">
                      <div className="font-mono text-[10px] text-muted-foreground/70">
                        {data?.local_commit.hash?.slice(0, 7)}
                      </div>
                      <div className="line-clamp-3 text-xs">
                        {data?.local_commit?.message}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="fade-in slide-in-from-bottom-4 animate-in duration-300">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 text-green-600 text-sm">
            <Check className="h-4 w-4" />
            <span>Latest Plugin Version</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
