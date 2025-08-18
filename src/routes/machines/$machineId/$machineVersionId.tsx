import { createFileRoute } from "@tanstack/react-router";
import { MachineVersionDetailPage } from "@/components/machine/machine-version-detail";

export const Route = createFileRoute("/machines/$machineId/$machineVersionId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { machineId, machineVersionId } = Route.useParams();

  return (
    <MachineVersionDetailPage
      machineId={machineId}
      machineVersionId={machineVersionId}
    />
  );
}
