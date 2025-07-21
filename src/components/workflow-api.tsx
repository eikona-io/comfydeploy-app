import { api } from "@/lib/api";

export async function renameWorkflow(workflow_id: string, new_name: string) {
  await api({
    url: `workflow/${workflow_id}`,
    init: {
      method: "PATCH",
      body: JSON.stringify({
        name: new_name,
      }),
    },
  });
}

export async function cloneWorkflow(workflow_id: string, name: string) {
  const response = await api({
    url: `workflow/${workflow_id}/clone`,
    init: {
      method: "POST",
      body: JSON.stringify({
        name,
      }),
    },
  });
  return response;
}

export async function deleteWorkflow(workflow_id: string) {
  await api({
    url: `workflow/${workflow_id}`,
    init: {
      method: "DELETE",
    },
  });
}

export async function pinWorkflow(workflow_id: string, pinned: boolean) {
  await api({
    url: `workflow/${workflow_id}`,
    init: {
      method: "PATCH",
      body: JSON.stringify({
        pinned,
      }),
    },
  });
}
