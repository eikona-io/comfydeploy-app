import { useEffect, useMemo, useState, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Session {
  created_at: string;
  timeout_end?: string;
  timeout?: number;
  url?: string;
  tunnel_url?: string;
  gpu?: string;
}

export function useSessionTimer(session: Session | undefined) {
  const isLegacyMode = !session?.timeout_end;

  const progressPercentage = useMemo(() => {
    if (!session?.created_at) return 0;

    const now = new Date().getTime();
    const start = new Date(session.created_at).getTime();

    if (isLegacyMode) {
      // For legacy mode, use session.timeout as total duration
      if (session?.timeout) {
        const duration = session.timeout * 60 * 1000; // Convert minutes to milliseconds
        const elapsed = now - start;
        const remaining = Math.max(0, duration - elapsed);
        return (remaining / duration) * 100;
      }
      return 0;
    }

    // For modern mode with timeout_end
    if (session?.timeout_end) {
      const end = new Date(session.timeout_end).getTime();
      const total = end - start;
      const remaining = Math.max(0, end - now);
      return (remaining / total) * 100;
    }

    return 0;
  }, [
    session?.timeout_end,
    session?.created_at,
    session?.timeout,
    isLegacyMode,
  ]);

  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!session?.created_at) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const start = new Date(session.created_at).getTime();
      let distance = 0;

      if (isLegacyMode) {
        // For legacy mode, calculate remaining time from session.timeout
        if (session?.timeout) {
          const duration = session.timeout * 60 * 1000; // Convert minutes to milliseconds
          distance = Math.max(0, duration - (now - start));
        }
      } else if (session?.timeout_end) {
        // For non-legacy mode, use timeout_end
        const targetTime = new Date(session.timeout_end).getTime();
        distance = Math.max(0, targetTime - now);
      }

      if (distance <= 0) {
        setCountdown("00:00:00");
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      );
    };

    const intervalId = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial update

    return () => clearInterval(intervalId);
  }, [
    session?.timeout_end,
    session?.created_at,
    session?.timeout,
    isLegacyMode,
  ]);

  return {
    countdown,
    progressPercentage,
    isLegacyMode,
  };
}

interface SessionTimerProps {
  session: Session;
  size?: "sm" | "lg";
  onClick?: () => void;
  showFullCountdown?: boolean;
  className?: string;
}

export function SessionTimer({
  session,
  size = "lg",
  onClick,
  showFullCountdown = false,
  className,
}: SessionTimerProps) {
  const { countdown, progressPercentage } = useSessionTimer(session);
  const hasTriggeredRef = useRef(false);

  // Update useEffect to check countdown time and call onClick if < 30s
  useEffect(() => {
    if (!onClick || !countdown) return;

    const [hours, minutes, seconds] = countdown.split(":").map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (totalSeconds > 0 && totalSeconds < 30 && !hasTriggeredRef.current) {
      toast.info("Session ending soon, increasing session time...");
      hasTriggeredRef.current = true;
      onClick();
    } else if (totalSeconds >= 30) {
      // Reset the flag if the time goes above 30 seconds again
      hasTriggeredRef.current = false;
    }
  }, [countdown, onClick]);

  const timerDisplay = showFullCountdown
    ? countdown
    : `${countdown.split(":")[1]}:${countdown.split(":")[2]}`;

  if (size === "sm") {
    return (
      <span
        className={cn(
          "flex items-center gap-1 text-muted-foreground text-xs",
          className,
        )}
      >
        <div className="h-2 relative w-2">
          <div className="absolute inset-0">
            <svg
              viewBox="0 0 32 32"
              className="h-full w-full"
              role="img"
              aria-label="Session timer progress"
            >
              <circle cx="16" cy="16" r="16" className="fill-black/10" />
              <path
                d={(() => {
                  const x = 16;
                  const y = 16;
                  const radius = 16;
                  const angle = (progressPercentage / 100) * 360 - 90;
                  let d = `M ${x},${y} L ${x},0 `;
                  const largeArcFlag = progressPercentage <= 50 ? "0" : "1";
                  const endX = x + radius * Math.cos((angle * Math.PI) / 180);
                  const endY = y + radius * Math.sin((angle * Math.PI) / 180);
                  d += `A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY} Z`;
                  return d;
                })()}
                className="fill-primary/40"
              />
            </svg>
          </div>
        </div>
        {timerDisplay}
      </span>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "cursor-pointer group h-8 mx-auto relative w-8",
            className,
          )}
          onClick={onClick}
        >
          <div className="absolute inset-0">
            <svg
              viewBox="0 0 32 32"
              className="h-full w-full"
              role="img"
              aria-label="Session timer progress"
            >
              <circle cx="16" cy="16" r="16" className="fill-black/40" />
              <path
                d={(() => {
                  const x = 16;
                  const y = 16;
                  const radius = 16;
                  const angle = (progressPercentage / 100) * 360 - 90;
                  let d = `M ${x},${y} L ${x},0 `;
                  const largeArcFlag = progressPercentage <= 50 ? "0" : "1";
                  const endX = x + radius * Math.cos((angle * Math.PI) / 180);
                  const endY = y + radius * Math.sin((angle * Math.PI) / 180);
                  d += `A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY} Z`;
                  return d;
                })()}
                className="fill-primary"
              />
            </svg>
          </div>
          <span className="absolute flex font-medium inset-0 items-center justify-center tabular-nums text-[10px] text-background">
            {timerDisplay}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" className="p-2 text-xs w-auto">
        {`${countdown} remaining`}
      </PopoverContent>
    </Popover>
  );
}
