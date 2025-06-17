import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workflows/")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      view: search.view === "import" ? "import" : undefined,
      shared_workflow_id:
        typeof search.shared_workflow_id === "string"
          ? search.shared_workflow_id
          : undefined,
      shared_slug:
        typeof search.shared_slug === "string" ? search.shared_slug : undefined,
    };
  },
});
