import MachinePage from "@/components/machine/machine-page";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/machines/$machineId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { machineId } = Route.useParams();

  return <MachinePage params={{ machine_id: machineId }} />;
}
