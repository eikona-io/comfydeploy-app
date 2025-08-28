import {
  type ConnectionDetails,
  ConnectionStatus,
} from "@/hooks/use-progress-update";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ConnectionStatusIndicatorProps {
  connectionDetails: ConnectionDetails;
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ConnectionStatusIndicator({
  connectionDetails,
  className,
  showText = false,
  size = "md",
}: ConnectionStatusIndicatorProps) {
  const { status, retryCount, maxRetries, lastError, isReconnecting } =
    connectionDetails;

  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
  };

  const getIndicatorConfig = () => {
    switch (status) {
      case "connected":
        return {
          color: "bg-green-500",
          animation: "animate-pulse",
          text: "Connected",
          description: "Real-time updates active",
        };
      case "connecting":
        return {
          color: "bg-yellow-500",
          animation: "animate-pulse",
          text: "Connecting",
          description: "Establishing connection...",
        };
      case "reconnecting":
        return {
          color: "bg-orange-500",
          animation: "animate-pulse",
          text: `Reconnecting (${retryCount}/${maxRetries})`,
          description: lastError || "Attempting to reconnect...",
        };
      case "error":
        return {
          color: "bg-red-500",
          animation: "animate-pulse",
          text: "Connection Error",
          description: lastError || "Unable to connect",
        };
      case "disconnected":
        return {
          color: "bg-gray-400",
          animation: "",
          text: "Disconnected",
          description: "Real-time updates inactive",
        };
      default:
        return {
          color: "bg-gray-400",
          animation: "",
          text: "Unknown",
          description: "Connection status unknown",
        };
    }
  };

  const config = getIndicatorConfig();

  if (showText) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div
          className={cn(
            "rounded-full",
            sizeClasses[size],
            config.color,
            config.animation,
          )}
        />
        <div className="flex flex-col">
          <span className="text-xs font-medium text-foreground">
            {config.text}
          </span>
          {config.description && (
            <span className="text-xs text-muted-foreground">
              {config.description}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center justify-center", className)}>
            <div
              className={cn(
                "rounded-full",
                sizeClasses[size],
                config.color,
                config.animation,
              )}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <div className="text-sm font-medium">Real-time Updates</div>
            <div className="text-muted-foreground text-xs">
              Status: {config.text}
            </div>
            {config.description && (
              <div className="text-muted-foreground text-xs">
                {config.description}
              </div>
            )}
            {lastError && (
              <div className="text-red-400 text-xs">{lastError}</div>
            )}
            {isReconnecting && (
              <div className="text-orange-400 text-xs">
                Attempting to reconnect...
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Compact version for navbar usage
export function NavbarConnectionIndicator({
  connectionDetails,
  className,
}: {
  connectionDetails: ConnectionDetails;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center h-[46px] ml-2",
        className,
      )}
    >
      <ConnectionStatusIndicator
        connectionDetails={connectionDetails}
        size="md"
      />
    </div>
  );
}
