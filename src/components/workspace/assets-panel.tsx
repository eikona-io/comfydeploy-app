import { AssetBrowser } from "@/components/asset-browser";
import { UploadProgress } from "@/components/upload/upload-progress";
import { cn } from "@/lib/utils";
import { useUploadStore } from "@/stores/upload-store";
import { ChevronDown, ChevronUp, Folder } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface AssetsPanelProps {
  className?: string;
}

export function AssetsPanel({ className }: AssetsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isUploading = useUploadStore((state) => state.isUploading);
  const progress = useUploadStore((state) => state.progress);

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex flex-col rounded-lg border bg-white shadow-lg transition-all duration-200",
        isExpanded ? "h-[600px] w-[800px]" : "h-10 w-10",
        className,
      )}
    >
      {/* Header/Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-t-lg border-b px-3",
          !isExpanded && "border-none",
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <>
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              <span>Assets</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </>
        ) : (
          <div className="relative flex h-full w-full items-center justify-center">
            <Folder className="h-4 w-4" />
            {isUploading && (
              <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-blue-500" />
            )}
          </div>
        )}
      </Button>

      {/* Content */}
      {isExpanded ? (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="relative flex-1">
            <AssetBrowser className="absolute inset-0" />
          </div>
        </div>
      ) : (
        isUploading && (
          <div className="absolute -top-12 right-0 w-[200px]">
            <UploadProgress />
          </div>
        )
      )}
    </div>
  );
}
