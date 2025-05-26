import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface LoadingProgressProps {
  className?: string;
  message?: string;
}

export function LoadingProgress({
  className,
  message = "Loading your account...",
}: LoadingProgressProps) {
  const [dots, setDots] = useState("");

  // Animate dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return `${prev}.`;
      });
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  return (
    <div
      className={cn(
        "bg-transparent flex flex-1 h-screen inset-0 items-center justify-center w-full z-50",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground">
          {message}
          <span className="inline-block text-left w-6">{dots}</span>
        </p>
      </div>
    </div>
  );
}
