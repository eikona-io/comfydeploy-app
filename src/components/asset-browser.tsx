import { FileURLRender } from "@/components/workflows/OutputRender";
import { useAssetList, useDeleteAsset } from "@/hooks/hook";
import { cn } from "@/lib/utils";
import { useAssetBrowserStore } from "@/stores/asset-browser-store";
import { Folder, FolderPlus, Loader2, MoreVertical, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UploadZone } from "./upload/upload-zone";

interface AssetBrowserProps {
  className?: string;
  showNewFolderButton?: boolean;
  onItemClick?: (asset: { url: string; name: string; id: string }) => void;
}

export function AssetBrowser({
  className,
  showNewFolderButton = true,
  onItemClick,
}: AssetBrowserProps) {
  const { currentPath, setCurrentPath } = useAssetBrowserStore();
  const { data: assets, isLoading } = useAssetList(currentPath);
  const { mutateAsync: deleteAsset } = useDeleteAsset();

  const handleDeleteAsset = async (assetId: string) => {
    try {
      await deleteAsset(assetId);
      toast.success("Asset deleted successfully");
    } catch (e) {
      toast.error("Error deleting asset");
    }
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const breadcrumbs = currentPath
    .split("/")
    .filter(Boolean)
    .reduce<{ name: string; path: string }[]>(
      (acc, part) => {
        const lastPath = acc[acc.length - 1]?.path || "";
        acc.push({
          name: part,
          path: `${lastPath}/${part}`,
        });
        return acc;
      },
      [{ name: "Root", path: "/" }],
    );

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "@container flex h-full w-full flex-col gap-2 overflow-hidden",
      )}
    >
      {/* Header with breadcrumb and actions - fixed */}
      <div className="flex shrink-0 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <div key={crumb.path} className="flex items-center">
              {i > 0 && <span className="mx-2">/</span>}
              <button
                type="button"
                onClick={() => handleNavigate(crumb.path)}
                className="hover:text-gray-900"
              >
                {crumb.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable grid container */}
      <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-1 overflow-y-auto">
        <div className="grid min-h-[200px] w-full @[300px]:grid-cols-2 @[500px]:grid-cols-3 @[700px]:grid-cols-4 @[900px]:grid-cols-5 grid-cols-2 gap-4 p-4">
          {assets?.map((asset) => (
            <div
              key={asset.id}
              className="group relative flex aspect-square w-full flex-col items-center gap-2"
            >
              {asset.is_folder ? (
                <button
                  type="button"
                  onClick={() => handleNavigate(asset.path)}
                  className="flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 hover:bg-gray-50"
                >
                  <Folder className="h-12 w-12 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-600">
                    {asset.name}
                  </span>
                </button>
              ) : (
                <div
                  className="relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border"
                  onClick={() =>
                    onItemClick?.({
                      url: asset.url || "",
                      name: asset.name,
                      id: asset.id,
                    })
                  }
                >
                  <FileURLRender
                    url={asset.url || ""}
                    imgClasses="object-contain w-full h-full"
                  />
                </div>
              )}
              <div className="flex w-full items-center justify-between">
                <span className="truncate text-sm">{asset.name}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteAsset(asset.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
          {assets?.length === 0 && (
            <div className="col-span-full flex h-[200px] items-center justify-center text-sm text-gray-500">
              No assets in this folder
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
