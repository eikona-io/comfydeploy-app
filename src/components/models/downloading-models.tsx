import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { DownloadingModel } from "@/types/models";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Copy,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function DownloadingModels() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAllModels, setShowAllModels] = useState(false);
  const MAX_VISIBLE_MODELS = 3;

  const { data: downloadingModels, isLoading } = useQuery({
    queryKey: ["volume", "downloading-models"],
    queryFn: async ({ queryKey }) => {
      const response = await api({
        url: queryKey.join("/"),
      });
      return response as DownloadingModel[];
    },
    refetchInterval: 5000, // Refetch every 5 seconds to update progress
  });

  if (isLoading) {
    return null;
  }

  if (!downloadingModels || downloadingModels.length === 0) {
    return null;
  }

  // Determine if we need to use compact mode (many downloads)
  const useCompactMode = downloadingModels.length > 5;

  // Determine which models to show based on showAllModels state
  const visibleModels = showAllModels
    ? downloadingModels
    : downloadingModels.slice(0, MAX_VISIBLE_MODELS);

  const hiddenModelsCount = downloadingModels.length - visibleModels.length;

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={setIsExpanded}
      className="mb-4 rounded-md border bg-card"
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <h3 className="font-medium">Downloading Models</h3>
          <Badge variant="outline">{downloadingModels.length}</Badge>
        </div>
      </div>

      <CollapsibleContent>
        <div className="space-y-2 p-3 pt-0">
          {visibleModels.map((model) => (
            <DownloadingModelItem
              key={model.id}
              model={model}
              compact={useCompactMode}
            />
          ))}

          {hiddenModelsCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => setShowAllModels(!showAllModels)}
            >
              {showAllModels
                ? "Show Less"
                : `Show ${hiddenModelsCount} More Downloads`}
            </Button>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function DownloadingModelItem({
  model,
  compact = false,
}: {
  model: DownloadingModel;
  compact?: boolean;
}) {
  const [showDetails, setShowDetails] = useState(false);

  const getModelUrl = () => {
    if (model.civitai_url) return model.civitai_url;
    if (model.hf_url) return model.hf_url;
    if (model.user_url) return model.user_url;
    return null;
  };

  const getSourceName = () => {
    switch (model.upload_type) {
      case "civitai":
        return "Civitai";
      case "huggingface":
        return "Hugging Face";
      case "link":
        return "URL";
      default:
        return "Unknown";
    }
  };

  const getTimeAgo = () => {
    try {
      return formatDistanceToNow(new Date(model.created_at), {
        addSuffix: true,
      });
    } catch (e) {
      return "recently";
    }
  };

  const modelUrl = getModelUrl();
  const sourceName = getSourceName();
  const timeAgo = getTimeAgo();

  const copyModelUrl = () => {
    if (modelUrl) {
      navigator.clipboard.writeText(modelUrl);
      toast.success("Download link copied to clipboard");
    }
  };

  const hasImage =
    model.civitai_model_response?.images &&
    model.civitai_model_response.images.length > 0;

  const hasDescription = !!model.civitai_model_response?.description;
  const hasError = !!model.error_log;
  const hasDetails = hasImage || hasDescription || hasError;

  return (
    <div
      className={cn(
        "rounded-md border bg-card overflow-hidden",
        compact ? "text-sm" : "",
      )}
    >
      <div className={cn("p-2", compact ? "py-1" : "p-3")}>
        <div className="flex items-center justify-between">
          <div className="mr-2 flex-1 truncate">
            <div className="truncate font-medium">{model.model_name}</div>
            {!compact && (
              <div className="text-xs text-muted-foreground">
                {sourceName} • {model.folder_path} • Started {timeAgo}
              </div>
            )}
            {compact && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{sourceName}</span>
                <span>•</span>
                <span className="truncate">{model.folder_path}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {model.status === "failed" && (
              <AlertCircle
                className={cn(
                  "text-destructive",
                  compact ? "h-4 w-4" : "h-5 w-5",
                )}
              />
            )}
            {hasDetails && !compact && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setShowDetails(!showDetails)}
              >
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    showDetails && "rotate-90",
                  )}
                />
              </Button>
            )}
            {hasImage && compact && (
              <ImageIcon className="h-3 w-3 text-muted-foreground" />
            )}
            {modelUrl && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "hover:text-foreground p-0 text-muted-foreground",
                  compact ? "h-6 w-6" : "h-8 w-8",
                )}
                onClick={copyModelUrl}
                title="Copy download link"
              >
                <Copy className={cn(compact ? "h-3 w-3" : "h-4 w-4")} />
              </Button>
            )}
          </div>
        </div>

        <div className={cn("mt-1", compact ? "mt-0.5" : "mt-2")}>
          <Progress
            value={model.download_progress}
            className={cn(
              "h-1.5",
              compact && "h-1",
              model.status === "failed" && "bg-destructive/20",
            )}
          />
          <div
            className={cn(
              "flex justify-between text-muted-foreground text-xs",
              compact ? "mt-0.5" : "mt-1",
            )}
          >
            <span>
              {model.status === "failed"
                ? "Failed"
                : `${model.download_progress}%`}
            </span>
            {model.status !== "failed" && (
              <span>
                {model.download_progress === 100
                  ? "Processing..."
                  : "Downloading"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Only show details if not in compact mode and details are toggled on */}
      {!compact && showDetails && hasDetails && (
        <div className="space-y-2 border-t p-3">
          {hasImage && (
            <div className="mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-md">
              <img
                src={model.civitai_model_response.images[0].url}
                alt={model.model_name}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {hasDescription && (
            <div className="text-sm">
              <div className="mb-1 font-medium">Description</div>
              <div className="text-muted-foreground text-xs">
                {model.civitai_model_response.description.length > 300
                  ? `${model.civitai_model_response.description.substring(0, 300)}...`
                  : model.civitai_model_response.description}
              </div>
            </div>
          )}

          {hasError && (
            <div className="text-sm">
              <div className="mb-1 font-medium text-destructive">Error</div>
              <pre className="bg-destructive/10 p-2 rounded text-destructive text-xs whitespace-pre-wrap">
                {model.error_log}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
