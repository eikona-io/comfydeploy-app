import { createFileRoute } from "@tanstack/react-router";

type View = "settings" | "deployments" | "overview" | "logs";

export const Route = createFileRoute("/machines/$machineId/")({
  validateSearch: (search: Record<string, unknown>) => {
    const view = search.view as View;
    return {
      view:
        view === "overview" ||
        !["settings", "deployments", "logs"].includes(view)
          ? undefined
          : view,
    };
  },
});
