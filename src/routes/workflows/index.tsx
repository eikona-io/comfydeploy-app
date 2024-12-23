import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workflows/")({
  validateSearch: (search: Record<string, unknown>) => {
    if (!search.view) {
      return {};
    }

    return {
      view: search.view === "import" ? "import" : undefined,
    };
  },
});
