import { createFileRoute } from "@tanstack/react-router";

type View = "history" | "overview";

export const Route = createFileRoute("/machines/$machineId/")({
  validateSearch: (search: Record<string, unknown>) => {
    const view = search.view as View;
    return {
      view:
        view === "overview" || !["history"].includes(view) ? undefined : view,
    };
  },
});
