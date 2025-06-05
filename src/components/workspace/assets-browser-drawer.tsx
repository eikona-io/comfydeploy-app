import { cn } from "@/lib/utils";
import { sendEventToCD } from "./sendEventToCD";
import { useMediaQuery } from "usehooks-ts";
import { Drawer } from "vaul";
import { AssetBrowser } from "../asset-browser";
import { useAssetsBrowserStore } from "./Workspace";
import type { AssetType } from "../SDInputs/sd-asset-input";

export function AssetsBrowserPopup({
  isPlayground,
  handleAsset,
}: {
  isPlayground?: boolean;
  handleAsset: (asset: AssetType) => void;
}) {
  const { open, setOpen, targetNodeData } = useAssetsBrowserStore();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(open) => setOpen(open)}
      direction={isMobile ? "bottom" : "right"}
    >
      <Drawer.Portal>
        <Drawer.Content
          className={cn(
            isMobile
              ? "fixed right-0 bottom-0 left-0 mt-24 flex h-[96%] flex-col rounded-t-[10px] bg-white md:top-0 md:right-0 md:bottom-0 md:h-full md:w-[400px] md:rounded-l-[10px] md:rounded-tr-none dark:bg-zinc-900"
              : "fixed top-2 right-2 bottom-2 z-50 flex w-[500px] rounded-[10px] border border-gray-300/50 shadow-lg dark:border-zinc-700/50",
          )}
          style={
            {
              "--initial-transform": "calc(100% + 8px)",
            } as React.CSSProperties
          }
        >
          <div className="flex h-full w-full grow flex-col rounded-[16px] bg-zinc-50 p-5 dark:bg-zinc-900">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50 dark:border-zinc-700/50 dark:bg-zinc-900 dark:text-zinc-400"
              >
                Cancel
              </button>
            </div>
            <AssetBrowser
              onItemClick={(asset) => {
                if (isPlayground && handleAsset) {
                  handleAsset(asset);
                  return;
                }
                if (targetNodeData?.node) {
                  // If we have target node data, update the existing node
                  console.log(targetNodeData);

                  sendEventToCD("update_widget", {
                    nodeId: targetNodeData.node,
                    widgetName: targetNodeData.inputName,
                    value: asset.url,
                  });
                  useAssetsBrowserStore.getState().setTargetNodeData(null);
                } else {
                  // Otherwise create a new node (existing behavior)
                  sendEventToCD("add_node", {
                    type: "ComfyUIDeployExternalImage",
                    widgets_values: ["input_image", "", "", asset.url],
                  });
                }
                setOpen(false); // Close the drawer after selection
              }}
              isPanel={true}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
