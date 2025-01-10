import { createFileRoute } from "@tanstack/react-router";

type View = "deployments" | "overview";

export const Route = createFileRoute("/machines/$machineId/")({
  validateSearch: (search: Record<string, unknown>) => {
    const view = search.view as View;
    return {
      view:
        view === "overview" || !["deployments"].includes(view)
          ? undefined
          : view,
    };
  },
});
