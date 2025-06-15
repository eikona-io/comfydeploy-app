import { createFileRoute } from "@tanstack/react-router";
import { ExploreSharedWorkflows } from "@/components/explore-shared-workflows";

export const Route = createFileRoute("/explore")({
  component: ExploreSharedWorkflows,
});
