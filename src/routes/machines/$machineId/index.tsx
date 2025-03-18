import MachinePage from "@/components/machine/machine-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/machines/$machineId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { machineId } = Route.useParams();

  return <MachinePage params={{ machine_id: machineId }} />;
}
