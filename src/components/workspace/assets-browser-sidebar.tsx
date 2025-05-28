import { AssetBrowser } from "../asset-browser";
import { sendEventToCD } from "./sendEventToCD";
import { useAssetsBrowserStore } from "./Workspace";
import type { AssetType } from "../SDInputs/sd-asset-input";

interface AssetBrowserSidebarProps {
  onItemClick: (asset: AssetType) => void;
}

export function AssetBrowserSidebar({ onItemClick }: AssetBrowserSidebarProps) {
  const { targetNodeData } = useAssetsBrowserStore();

  const handleAssetClick = (asset: AssetType) => {
    if (targetNodeData?.node) {
      sendEventToCD("update_widget", {
        nodeId: targetNodeData.node,
        widgetName: targetNodeData.inputName,
        value: asset.url,
      });
      useAssetsBrowserStore.getState().setTargetNodeData(null);
    } else {
      sendEventToCD("add_node", {
        type: "ComfyUIDeployExternalImage",
        widgets_values: ["input_image", "", "", asset.url],
      });
    }
    onItemClick(asset);
  };

  return (
    <AssetBrowser
      onItemClick={handleAssetClick}
      isPanel={true}
    />
  );
}
