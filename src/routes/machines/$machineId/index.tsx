import { createFileRoute } from "@tanstack/react-router";

type View = "environment" | "autoscaling" | "advanced";

export const Route = createFileRoute("/machines/$machineId/")({
  validateSearch: (search: Record<string, unknown>) => {
    const view = search.view as View;
    return {
      view:
        view === "environment" || !["autoscaling", "advanced"].includes(view)
          ? undefined
          : view,
    };
  },
});
