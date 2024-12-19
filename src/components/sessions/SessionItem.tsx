import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Timer } from "@/components/workflows/Timer";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface SessionItemProps {
  session: {
    id: string;
    session_id: string;
    gpu: string;
    created_at: string;
  };
  index: number;
  isActive: boolean;
  onSelect: (sessionId: string) => void;
  onDelete: (sessionId: string) => Promise<void>;
}

export function SessionItem({
  session,
  index,
  isActive,
  onSelect,
  onDelete,
}: SessionItemProps) {
  const [isStopping, setIsStopping] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStopping(true);
    await onDelete(session.session_id);
    setTimeout(() => {
      setIsStopping(false);
    }, 10000);
  };

  return (
    <div className="flex w-full items-center justify-between">
      <Button
        variant="ghost"
        className={cn(
          "relative inline-block flex-grow justify-start rounded-sm px-0 text-start transition-colors hover:no-underline",
          isActive ? "opacity-100" : "opacity-50",
        )}
        onClick={() => onSelect(session.session_id)}
        disabled={isStopping}
      >
        <div className="flex w-full flex-col items-start">
          <div className="flex w-full justify-between gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex flex-row items-center gap-3 text-left">
                  {index + 1}
                  <div className="w-14 overflow-hidden text-2xs">
                    <Timer
                      start={new Date(session.created_at).getTime()}
                      relative={true}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{session.session_id}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center space-x-2">
              {session.gpu && (
                <Badge variant="secondary" className="text-xs">
                  {session.gpu}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full p-1 hover:bg-red-100 hover:text-red-600"
        onClick={handleDelete}
        disabled={isStopping}
      >
        {isStopping ? (
          <span className="animate-pulse">Stopping...</span>
        ) : (
          <X size={16} />
        )}
      </Button>
    </div>
  );
}
