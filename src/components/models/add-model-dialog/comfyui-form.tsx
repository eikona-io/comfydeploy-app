import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { AddModelRequest, ComfyUIModel } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown, Search } from "lucide-react";
import { FolderPathDisplay } from "./folder-path-display";
import { useDebounce } from "use-debounce";

interface ComfyUIFormProps {
  onSubmit: (request: AddModelRequest) => void;
  folderPath: string;
  className?: string;
  isSubmitting?: boolean;
}

export function ComfyUIForm({
  onSubmit,
  folderPath,
  className,
  isSubmitting = false,
}: ComfyUIFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState<ComfyUIModel | null>(null);
  const [filename, setFilename] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounce search query to avoid too many API calls
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  // Search for ComfyUI models
  const {
    data: models,
    isLoading,
    isFetching,
  } = useQuery<{
    models: ComfyUIModel[];
  }>({
    queryKey: ["search", "model"],
    queryKeyHashFn: (queryKey) =>
      [...queryKey, debouncedSearchQuery].toString(),
    meta: {
      params: {
        query: debouncedSearchQuery,
        provider: "comfyui",
      },
    },
    enabled: debouncedSearchQuery.length > 0, // Search when query has at least 1 character
  });

  // Process models data - ensure it's always an array
  const processedModels = useMemo(() => {
    if (!models) return [];
    if (models.models && Array.isArray(models.models)) return models.models;
  }, [models]);

  // Auto-fill filename when model is selected
  useEffect(() => {
    if (selectedModel) {
      setFilename(selectedModel.filename);
    }
  }, [selectedModel]);

  const handleModelSelect = (model: ComfyUIModel) => {
    setSelectedModel(model);
    setSearchQuery(model.name);
    setShowDropdown(false);
  };

  const handleSubmit = () => {
    if (!selectedModel || !filename.trim()) return;

    onSubmit({
      source: "link",
      folderPath,
      filename,
      downloadLink: selectedModel.download_url,
    });
  };

  const formatFileSize = (bytes: number) => {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      !isSubmitting &&
      selectedModel &&
      filename.trim()
    ) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Determine if popover should show content
  const hasContent = useMemo(() => {
    return (
      searchQuery.length > 0 &&
      ((processedModels && processedModels.length > 0) ||
        (debouncedSearchQuery.length > 0 && isFetching))
    );
  }, [searchQuery, processedModels, debouncedSearchQuery, isFetching]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className={cn("flex flex-col gap-4", className)}
    >
      <FolderPathDisplay path={folderPath} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="search">Search</Label>
        <Popover
          open={showDropdown && hasContent}
          onOpenChange={(open) => {
            // Only allow closing the popover, don't interfere with opening
            if (!open) {
              setShowDropdown(false);
            }
          }}
        >
          <PopoverTrigger asChild>
            <div className="relative">
              <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                  if (e.target.value !== selectedModel?.name) {
                    setSelectedModel(null);
                  }
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={(e) => {
                  // Only close if we're not clicking on the popover content
                  const relatedTarget = e.relatedTarget as HTMLElement;
                  if (
                    !relatedTarget ||
                    !relatedTarget.closest(
                      "[data-radix-popper-content-wrapper]",
                    )
                  ) {
                    setTimeout(() => setShowDropdown(false), 150);
                  }
                }}
                placeholder="Search for models (e.g., RealESRGAN, SDXL, Hyper...)"
                className="pr-10 pl-10"
                onKeyDown={handleKeyDown}
              />
              <ChevronDown className="absolute top-3 right-3 h-4 w-4 text-muted-foreground" />
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-1"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            onEscapeKeyDown={() => setShowDropdown(false)}
            onPointerDownOutside={(e) => {
              // Don't close if clicking on the input
              const target = e.target as HTMLElement;
              if (target.closest('input[id="search"]')) {
                e.preventDefault();
              }
            }}
          >
            <div className="max-h-60 overflow-auto">
              {processedModels && processedModels.length > 0
                ? processedModels.map((model: ComfyUIModel, index: number) => (
                    <button
                      key={`${model.download_url}-${index}`}
                      type="button"
                      onClick={() => handleModelSelect(model)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-sm px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
                        selectedModel?.download_url === model.download_url &&
                          "bg-accent",
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{model.name}</div>
                        <div className="text-muted-foreground text-xs">
                          {model.type} • {formatFileSize(model.size)}
                        </div>
                        <div className="truncate text-muted-foreground text-xs">
                          {model.filename}
                        </div>
                      </div>
                      {selectedModel?.download_url === model.download_url && (
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      )}
                    </button>
                  ))
                : Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex w-full animate-pulse items-start gap-3 rounded-sm px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 h-4 w-3/4 rounded bg-muted" />
                        <div className="mb-1 h-3 w-1/2 rounded bg-muted" />
                        <div className="h-3 w-2/3 rounded bg-muted" />
                      </div>
                    </div>
                  ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {selectedModel && (
        <>
          <div className="rounded-lg border bg-muted/50 p-3">
            <div className="mb-1 font-medium text-sm">Selected Model</div>
            <div className="text-muted-foreground text-sm">
              <div>Name: {selectedModel.name}</div>
              <div>Type: {selectedModel.type}</div>
              <div>Size: {formatFileSize(selectedModel.size)}</div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="model.safetensors"
              onKeyDown={handleKeyDown}
            />
          </div>
        </>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || !selectedModel || !filename.trim()}
      >
        {isSubmitting ? "Adding Model..." : "Add Model"}
      </Button>
    </form>
  );
}
