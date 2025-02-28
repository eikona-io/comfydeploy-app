import { Badge } from "@/components/ui/badge";
import { LoadingIcon } from "@/components/ui/custom/loading-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Clock12, Minus, X } from "lucide-react";

export function StatusBadge({
  status,
  mini = false,
}: {
  status: string;
  mini?: boolean;
}) {
  function getBadge() {
    // return (
    //   <Badge variant="secondary">
    //     <LoadingIcon />
    //   </Badge>
    // );

    switch (status) {
      case "uploading":
      case "running":
        if (mini) {
          return (
            <Badge variant="secondary">
              <LoadingIcon />
            </Badge>
          );
        }

        return (
          <Badge variant="secondary" className="w-fit gap-2">
            {status} <LoadingIcon />
          </Badge>
        );
      case "success":
        if (mini) {
          return (
            <Badge variant="success">
              <Check size={14} />
            </Badge>
          );
        }

        return <Badge variant="success">{status}</Badge>;
      case "timeout":
        if (mini) {
          return (
            <Badge variant="amber">
              <Clock12 size={14} />
            </Badge>
          );
        }

        return <Badge variant="amber">{status}</Badge>;
      case "failed":
        if (mini) {
          return (
            <Badge variant="destructive">
              <X size={14} />
            </Badge>
          );
        }

        return <Badge variant="destructive">{status}</Badge>;
      case "not-started":
        if (mini) {
          return (
            <Badge variant="secondary">
              <Clock12 size={14} />
            </Badge>
          );
        }
        break;
      case "queued":
        if (mini) {
          return (
            <Badge variant="secondary">
              <Clock12 size={14} />
            </Badge>
          );
        }
        break;
      case "started":
        if (mini) {
          return (
            <Badge variant="secondary">
              <Clock12 size={14} />
            </Badge>
          );
        }
        break;
      case "cancelled":
        if (mini) {
          return (
            <Badge variant="secondary">
              <Minus size={14} />
            </Badge>
          );
        }
        break;
    }
    return <Badge variant="secondary">{status}</Badge>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{getBadge()}</TooltipTrigger>
      <TooltipContent>
        <div>{status}</div>
      </TooltipContent>
    </Tooltip>
  );
}
