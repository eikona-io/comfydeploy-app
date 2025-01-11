import { createFileRoute } from "@tanstack/react-router";

type View = "history" | "overview" | "activity";

export const Route = createFileRoute("/machines/$machineId/")({
  validateSearch: (search: Record<string, unknown>) => {
    const view = search.view as View;
    return {
      view:
        view === "overview" || !["history", "activity"].includes(view)
          ? undefined
          : view,
    };
  },
});
