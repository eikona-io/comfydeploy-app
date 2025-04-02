import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMachine } from "@/hooks/use-machine";
import { getRelativeTime } from "@/lib/get-relative-time";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpCircle } from "lucide-react";

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
  variant?: "inline" | "bottom";
  onUpdate?: () => void;
  hideUpdateButton?: boolean;
}

export function VersionChecker({
  machineId,
  variant = "inline",
  onUpdate,
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
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <Alert className="border-muted bg-muted/50 mb-4" variant="default">
          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <div className="animate-pulse bg-muted h-4 mr-2 rounded w-4" />
              <div className="animate-pulse bg-muted h-4 rounded w-48" />
            </div>
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute bg-muted/30 h-full left-8 top-2 w-[1px]" />
                <table className="min-w-full">
                  <tbody className="space-y-3">
                    {[0, 1].map((i) => (
                      <tr className="group" key={i}>
                        <td className="font-mono pb-3 pr-2 w-[60px]">
                          <div className="animate-pulse bg-muted h-3 rounded w-12" />
                        </td>
                        <td className="font-mono pb-3 pr-2 w-[80px]">
                          <div className="animate-pulse bg-muted h-3 rounded w-12" />
                        </td>
                        <td className="pb-3 pr-2 w-[120px]">
                          <div className="animate-pulse bg-muted h-3 rounded w-16" />
                        </td>
                        <td className="pb-3 relative">
                          <div className="absolute bg-muted/30 h-2 left-[-0.75rem] rounded-full top-[0.5rem] w-2" />
                          <div className="animate-pulse bg-muted h-3 rounded w-48" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex">
                <div className="animate-pulse bg-muted h-8 rounded w-24" />
              </div>
            </div>
          </div>
        </Alert>
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

    return (
      <div className="animate-in duration-300 fade-in slide-in-from-bottom-4">
        <Alert
          className="shadow-md bg-[#fff9ed] border-amber-500/50 mb-4"
          variant="default"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <ArrowUpCircle className="h-4 mr-2 text-amber-500 w-4" />
              <div className="font-semibold text-amber-500 text-sm flex justify-between w-full items-center">
                Update Available for ComfyDeploy custom node
                {!hideUpdateButton && onUpdate && (
                  <Button
                    className="h-8 hover:bg-amber-500/20 hover:text-amber-600 text-xs w-fit"
                    onClick={onUpdate}
                    size="sm"
                    variant="outline"
                  >
                    <ArrowUpCircle className="h-3 mr-2 w-3" />
                    Update Now
                  </Button>
                )}
              </div>
            </div>

            <AlertDescription className="space-y-3">
              <div className="relative">
                <div className="absolute bg-muted/50 h-full left-8 top-2 w-[1px]" />
                <table className="min-w-full">
                  <tbody className="space-y-3">
                    <tr className="group">
                      <td className="font-mono pb-3 pr-2 text-amber-500 text-xs w-[60px]">
                        <Badge className="text-amber-500 text-xs">Latest</Badge>
                      </td>
                      <td className="font-mono pb-3 pr-2 text-amber-500 text-xs w-[80px]">
                        {data?.latest_commit.hash?.slice(0, 5)}
                      </td>
                      <td className="pb-3 pr-2 text-muted-foreground text-xs w-[120px]">
                        {latestDate}
                      </td>
                      <td className="pb-3 relative">
                        <div className="absolute bg-amber-500 h-2 left-[-0.75rem] rounded-full top-[0.5rem] w-2" />
                        <div className="group/badge relative">
                          <Badge
                            className="bg-amber-500/20 block max-w-[280px] overflow-hidden text-amber-600 text-xs truncate whitespace-nowrap"
                            variant="secondary"
                          >
                            {data?.latest_commit?.message || "Unknown"}
                          </Badge>
                          <div className="absolute bg-popover border border-border group-hover/badge:block hidden left-0 p-2 rounded-md shadow-md text-xs top-6 z-10">
                            {data?.latest_commit?.message || "Unknown"}
                          </div>
                        </div>
                      </td>
                    </tr>

                    <tr className="group">
                      <td className="font-mono pr-2 text-muted-foreground text-xs w-[60px]">
                        <Badge className="text-muted-foreground text-xs">
                          Current
                        </Badge>
                      </td>
                      <td className="font-mono pr-2 text-muted-foreground text-xs w-[80px]">
                        {data?.local_commit.hash?.slice(0, 5)}
                      </td>
                      <td className="pr-2 text-muted-foreground text-xs w-[120px]">
                        {localDate}
                      </td>
                      <td className="relative">
                        <div className="absolute bg-muted/50 h-2 left-[-0.75rem] rounded-full top-[0.5rem] w-2" />
                        <div className="group/badge relative">
                          <Badge
                            className="bg-muted/50 block max-w-[280px] overflow-hidden text-xs truncate whitespace-nowrap"
                            variant="secondary"
                          >
                            {data?.local_commit?.message || "Unknown"}
                          </Badge>
                          <div className="absolute bg-popover border border-border group-hover/badge:block hidden left-0 p-2 rounded-md shadow-md text-xs top-6 z-10">
                            {data?.local_commit?.message || "Unknown"}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </AlertDescription>
          </div>
        </Alert>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <Alert
          className="border-green-500/50 bg-green-500/10 mb-4"
          variant="default"
        >
          <div className="flex items-center">
            <div className="mr-2 text-green-500 w-4">✓</div>
            <div className="text-green-500 text-sm">
              Running Latest Version ComfyDeploy custom node
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  return null;
}
