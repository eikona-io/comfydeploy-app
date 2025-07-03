import { cn } from "@/lib/utils";
import { Image } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { ImageInputsTooltip } from "../image-inputs-tooltip";
import { useAssetsBrowserStore } from "../workspace/Workspace";
import { useSessionIdInSessionView } from "@/hooks/hook";

interface Props {
  onChange: (
    file:
      | File
      | string
      | undefined
      | FileList
      | { type: "folder"; path: string; name: string },
  ) => void;
}

export type AssetType = {
  url: string;
  name: string;
  id: string;
  type?: "file" | "folder";
  path?: string;
  is_folder: boolean;
};

export const SDAssetInput = ({ onChange }: Props) => {
  const { setOpen, setSidebarMode, setOnAssetSelect } = useAssetsBrowserStore();
  const handleAsset = (asset: AssetType) => {
    if (asset.is_folder) {
      onChange({ type: "folder", path: asset.path || "", name: asset.name });
    } else {
      onChange(asset.url);
    }
    setOnAssetSelect(null);
    setOpen(false);
  };

  const sessionId = useSessionIdInSessionView();

  const handleClick = () => {
    if (sessionId) {
      setSidebarMode(true);
    } else {
      setOnAssetSelect(handleAsset);
      setOpen(true);
    }
  };

  return (
    <>
      <ImageInputsTooltip tooltipText="Assets">
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            buttonVariants({
              variant: "outline",
              className:
                "flex cursor-pointer items-center justify-center rounded-[8px] transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50",
            }),
          )}
        >
          <Image size={18} />
        </button>
      </ImageInputsTooltip>
    </>
  );
};
