import { FileURLRender } from "@/components/workflows/OutputRender";
import { useAssetList, useDeleteAsset } from "@/hooks/hook";
import { cn, formatFileSize } from "@/lib/utils";
import { useAssetBrowserStore } from "@/stores/asset-browser-store";
import {
  ChevronRight,
  Folder,
  FolderPlus,
  Loader2,
  MoreVertical,
  Trash,
  Grid,
  List,
} from "lucide-react";
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
import { Dialog, DialogContent } from "./ui/dialog";
import { getRelativeTime } from "@/lib/get-relative-time";
import { UserIcon } from "./run/SharePageComponent";

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
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  const handleDeleteAsset = async (assetId: string) => {
    try {
      await deleteAsset(assetId);
      toast.success("Asset deleted successfully");
    } catch (e) {
      toast.error("Error deleting asset");
    }
  };

  const handleNavigate = (path: string) => {
    console.log(path);
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
          path: lastPath === "/" ? `${part}` : `${lastPath}/${part}`,
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
      <div className="flex shrink-0 items-center justify-between gap-4 p-4 pb-0">
        <div className="flex items-center gap-2 pl-1 text-gray-500 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <>
              <div key={`separator-${crumb.path}`}>
                {i > 0 && <ChevronRight className="h-4 w-4" />}
              </div>
              <div key={`crumb-${crumb.path}`} className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleNavigate(crumb.path)}
                  className="hover:text-gray-900"
                >
                  {crumb.name}
                </button>
              </div>
            </>
          ))}
        </div>

        {/* View toggle buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant={viewType === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8 rounded-[8px]"
            onClick={() => setViewType("grid")}
            aria-label="Grid view"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8 rounded-[8px]"
            onClick={() => setViewType("list")}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable container */}
      <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-1 overflow-y-auto">
        {viewType === "grid" ? (
          <div className="grid min-h-[200px] w-full @[300px]:grid-cols-2 @[500px]:grid-cols-3 @[700px]:grid-cols-4 @[900px]:grid-cols-5 grid-cols-2 gap-3 p-4">
            {assets?.map((asset) => (
              <div
                key={asset.id}
                className="group relative flex aspect-square w-full flex-col items-center gap-1.5"
              >
                {asset.is_folder ? (
                  <button
                    type="button"
                    onClick={() => handleNavigate(asset.path)}
                    className="flex h-full w-full flex-col items-center justify-center rounded-[8px] border-2 border-dashed p-4 hover:bg-gray-50"
                  >
                    <Folder className="h-12 w-12 text-gray-400" />
                  </button>
                ) : (
                  <div className="relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-[8px] border">
                    <FileURLRender
                      canFullScreen={true}
                      url={asset.url || ""}
                      imgClasses="max-w-[230px] w-full h-[230px] object-cover object-center rounded-[8px] transition-all duration-300 ease-in-out group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex w-full items-center justify-between pl-2">
                  <div className="flex w-[calc(100%-2rem)] flex-col">
                    <span className="truncate text-sm leading-snug">
                      {asset.name}
                    </span>
                    {!asset.is_folder && (
                      <span className="text-2xs text-muted-foreground">
                        {asset.mime_type.split("/")[1].toUpperCase()} •{" "}
                        {formatFileSize(asset.file_size)}
                      </span>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100 data-[state=open]:opacity-100"
                      >
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
              <div className="col-span-full flex h-[200px] items-center justify-center text-gray-500 text-sm">
                No assets in this folder
              </div>
            )}
          </div>
        ) : (
          <div className="w-full p-4">
            {/* Column headers for list view */}
            <div className="sticky top-0 z-10 flex w-full items-center border-b bg-white px-3 py-2 font-medium text-gray-500 text-sm">
              <div className="flex flex-1 items-center">
                <div className="w-8" /> {/* Space for icon */}
                <div className="flex-1 px-2">Name</div>
                <div className="hidden w-32 text-center lg:block">Size</div>
                <div className="hidden w-32 text-center lg:block">Modified</div>
                <div className="hidden w-32 text-center lg:block">Owner</div>
              </div>
              <div className="w-8" /> {/* Space for actions */}
            </div>

            {assets?.map((asset) => (
              <div
                key={asset.id}
                className="group flex w-full items-center border-b px-3 py-2 hover:bg-gray-50"
              >
                <div className="flex flex-1 items-center">
                  {/* Icon column */}
                  <div className="flex w-8 justify-center">
                    {asset.is_folder ? (
                      <Folder className="h-5 w-5 text-gray-400" />
                    ) : (
                      <div className="h-6 w-6 overflow-hidden rounded-[4px] border">
                        <FileURLRender
                          url={asset.url || ""}
                          imgClasses="w-full h-full object-cover object-center"
                          canFullScreen={true}
                        />
                      </div>
                    )}
                  </div>

                  {/* Name column */}
                  <div className="flex-1 px-2">
                    {asset.is_folder ? (
                      <button
                        type="button"
                        onClick={() => handleNavigate(asset.path)}
                        className="block w-full truncate text-left text-sm hover:underline"
                      >
                        {asset.name}
                      </button>
                    ) : (
                      <div className="max-w-[300px] truncate text-sm">
                        {asset.name}
                      </div>
                    )}
                  </div>

                  {/* Size column */}
                  <div className="hidden w-32 text-center text-muted-foreground text-xs lg:block">
                    {!asset.is_folder && asset.mime_type
                      ? `${asset.mime_type.split("/")[1].toUpperCase()} • ${formatFileSize(asset.file_size)}`
                      : "-"}
                  </div>

                  {/* Time column */}
                  <div className="hidden w-32 text-center text-muted-foreground text-xs lg:block">
                    {getRelativeTime(asset.created_at)}
                  </div>

                  {/* User column */}
                  <div className="hidden w-32 justify-center lg:flex">
                    <UserIcon
                      displayName
                      user_id={asset.user_id}
                      className="h-5 w-5"
                    />
                  </div>
                </div>

                {/* Actions column */}
                <div className="w-8">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100 data-[state=open]:opacity-100"
                      >
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
              <div className="flex h-[200px] w-full items-center justify-center text-gray-500 text-sm">
                No assets in this folder
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
