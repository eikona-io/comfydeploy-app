import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Timer } from "@/components/workflows/Timer";
import { UserIcon } from "@/components/run/SharePageComponent";
import { cn } from "@/lib/utils";
import { X, Loader2 } from "lucide-react";
import { useState } from "react";

interface CompactSessionItemProps {
  session: {
    id: string;
    session_id: string;
    gpu: string;
    created_at: string;
    user_id?: string;
    org_id?: string;
    workflowId?: string;
    creator_name?: string;
    machine_id?: string;
  };
  index: number;
  onDelete: (sessionId: string) => void;
}

export function SessionItem({
  session,
  index,
  onDelete,
}: CompactSessionItemProps) {
  const [isStopping, setIsStopping] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStopping(true);
    try {
      await onDelete(session.session_id);
    } finally {
      setTimeout(() => {
        setIsStopping(false);
      }, 10000);
    }
  };

  return (
    <div className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-md">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span className="text-sm text-muted-foreground w-6">{index + 1}</span>

        {/* Session ID (first 7 characters) */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                {session.session_id.slice(0, 7)}
              </code>
            </TooltipTrigger>
            <TooltipContent>
              <p>Full Session ID: {session.session_id}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {session.user_id && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <UserIcon user_id={session.user_id} className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>User: {session.user_id}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <div className="text-sm text-muted-foreground">
          <Timer
            start={new Date(session.created_at).getTime()}
            relative={true}
          />
        </div>

        {session.creator_name && (
          <div className="text-sm text-muted-foreground truncate">
            by {session.creator_name}
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {session.gpu && (
            <Badge variant="secondary" className="text-xs">
              {session.gpu}
            </Badge>
          )}
          {session.workflowId && (
            <Badge variant="outline" className="text-xs">
              Workflow
            </Badge>
          )}
        </div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleDelete}
              disabled={isStopping}
            >
              {isStopping ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Session</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
