import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/machines/$machineId/$machineVersionId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/machines/$machineId/$machineVersionId"!</div>;
}
