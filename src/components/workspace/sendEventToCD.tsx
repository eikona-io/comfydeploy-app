// import { useWorkflowStore } from "@/repo/components/ui/custom/workspace/Workspace";

export function reloadIframe() {
  const iframe = document.getElementById(
    "workspace-iframe",
  ) as HTMLIFrameElement;
  if (iframe) {
    iframe.src = iframe.src;
  }
}

export function sendEventToCD(event: string, data?: any) {
  const iframe = document.getElementById(
    "workspace-iframe",
  ) as HTMLIFrameElement;
  if (iframe?.contentWindow) {
    // console.log(event);
    iframe.contentWindow.postMessage(
      JSON.stringify({ type: event, data }),
      "*",
    );
  }
}

export function sendInetrnalEventToCD(data?: any) {
  const iframe = document.getElementById(
    "workspace-iframe",
  ) as HTMLIFrameElement;
  if (iframe?.contentWindow) {
    // console.log(event);
    iframe.contentWindow.postMessage({ internal: data }, "*");
  }
}

export function sendWorkflow(workflow_json: any) {
  // const state = useWorkflowStore.getState();
  // state.setHasChanged(false);
  // state.setWorkflow(workflow_json);
  sendEventToCD("graph_load", workflow_json);
}
