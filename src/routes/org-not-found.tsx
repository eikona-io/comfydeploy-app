import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/org-not-found")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/org-not-found"!</div>;
}
