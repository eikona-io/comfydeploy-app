import { MachineVersionDetail } from "@/components/machine/machine-version-detail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/machines/$machineId/$machineVersionId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { machineId, machineVersionId } = Route.useParams();

  return (
    <MachineVersionDetail
      machineId={machineId}
      machineVersionId={machineVersionId}
    />
  );
}
