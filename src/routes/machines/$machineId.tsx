import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/machines/$machineId")({
  component: MachineDetail
});

function MachineDetail() {
  const { machineId } = Route.useParams();

  return (
    <div>
      <h1>Machine Details</h1>
      <div>ID: {machineId}</div>
      {/* Add more machine details here */}
    </div>
  );
}
