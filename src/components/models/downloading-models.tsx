import { useState } from "react";
import { useUploadsProgressStore } from "@/stores/uploads-progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Folder,
  Clock,
  Trash2,
  X,
  Download,
  CheckCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
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
  const MAX_VISIBLE_MODELS = 2;

  const { data: downloadingModels, isLoading } = useQuery<DownloadingModel[]>({
    queryKey: ["volume", "downloading-models"],
    refetchInterval: 5000, // Refetch every 5 seconds to update progress
  });

  if (isLoading) {
    return null;
  }

  if (!downloadingModels || downloadingModels.length === 0) {
    return null;
  }

  // Determine which models to show based on showAllModels state
  const visibleModels = showAllModels
    ? downloadingModels
    : downloadingModels.slice(0, MAX_VISIBLE_MODELS);

  const hiddenModelsCount = downloadingModels.length - visibleModels.length;

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={setIsExpanded}
      className="mx-auto w-full max-w-screen-2xl rounded-lg border bg-card"
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
        <div className="space-y-2 px-3 pb-3">
          <UploadingList />

          {visibleModels.map((model) => (
            <DownloadingModelItem key={model.id} model={model} />
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
}: {
  model: DownloadingModel;
}) {
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const queryClient = useQueryClient();

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
      case "download-url":
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

  const getStatusBadge = () => {
    switch (model.status) {
      case "failed":
        return (
          <Badge variant="destructive" className="h-5 text-xs">
            <AlertCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        );
      case "success":
        return (
          <Badge variant="default" className="h-5 bg-green-500 text-xs">
            <CheckCircle className="mr-1 h-3 w-3" />
            Complete
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="h-5 text-xs">
            <Download className="mr-1 h-3 w-3" />
            {model.download_progress === 100 ? "Processing" : "Downloading"}
          </Badge>
        );
    }
  };

  const modelUrl = getModelUrl();
  const sourceName = getSourceName();
  const timeAgo = getTimeAgo();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return api({
        url: `file/${model.id}/cancel`,
        init: { method: "DELETE" },
      });
    },
    onSuccess: () => {
      toast.success("Download removed successfully");
      queryClient.invalidateQueries({
        queryKey: ["volume", "downloading-models"],
      });
    },
    onError: (error) => {
      toast.error("Failed to remove download");
    },
  });

  const copyModelUrl = () => {
    if (modelUrl) {
      navigator.clipboard.writeText(modelUrl);
      toast.success("Download link copied to clipboard");
    }
  };

  return (
    <div className="overflow-hidden border border-x-0 border-t-0 bg-card/50">
      <div className="p-2.5">
        {/* Header row */}

        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap truncate font-medium text-sm lg:gap-3">
                {model.model_name}
                {/* Metadata row */}
                <div className="flex items-center gap-3 text-muted-foreground text-xs">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" />
                    {sourceName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Folder className="h-3 w-3" />
                    <span className="max-w-[100px] truncate">
                      {model.folder_path}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {timeAgo}
                  </span>
                </div>
              </div>
            </div>
            {getStatusBadge()}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {model.status !== "success" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                title="Delete failed download"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
            {modelUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                onClick={copyModelUrl}
                title="Copy download link"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress bar for non-failed downloads */}
        {model.status !== "failed" && (
          <div className="mt-2 flex items-center gap-2">
            <Progress value={model.download_progress} className="h-1.5 flex-1" />
            <span className="min-w-[2.5rem] text-right text-muted-foreground text-xs">
              {model.download_progress}%
            </span>
          </div>
        )}

        {/* Error section for failed downloads */}
        {model.status === "failed" && model.error_log && (
          <div className="mt-2">
            <Collapsible open={showErrorDetails} onOpenChange={setShowErrorDetails}>
              <CollapsibleTrigger asChild>
                <button type="button" className="flex h-6 flex-row items-center gap-1 px-0 text-destructive text-xs">
                  {showErrorDetails ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                  Show Error Details
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-1 rounded border bg-destructive/5 p-2">
                  <pre className="whitespace-pre-wrap break-words text-destructive text-xs">
                    {model.error_log}
                  </pre>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </div>
    </div>
  );
}

function UploadingList() {
  const uploads = useUploadsProgressStore((s) => Object.values(s.items));
  if (!uploads.length) return null;
  return (
    <div className="space-y-1">
      {uploads.map((u: any) => (
        <div
          key={u.id}
          className="flex items-center justify-between gap-2 rounded-md border px-2 py-1"
        >
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm">{u.name}</div>
            <div className="text-xs text-muted-foreground">
              {Math.round(u.percent)}% • {(u.uploaded / 1024 / 1024).toFixed(1)}MB / {(u.size / 1024 / 1024).toFixed(1)}MB
              {u.eta > 0 ? ` • ${Math.max(0, Math.round(u.eta))}s left` : ""}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={u.percent} className="w-28" />
            {u.status === "uploading" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => useUploadsProgressStore.getState().cancelById(u.id)}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
