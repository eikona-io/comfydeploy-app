import MachinePage from "@/components/machine/machine-page";
import { createFileRoute } from "@tanstack/react-router";

type View = "settings" | "deployments" | "overview" | "logs";

export const Route = createFileRoute("/machines/$machineId")({
  validateSearch: (search) => {
    // Define the allowed values and default
    return {
      view: (search.view as View) ?? "overview",
    };
  },
  component: MachineDetail,
});

function MachineDetail() {
  const { machineId } = Route.useParams();

  return <MachinePage params={{ machine_id: machineId }} />;
}
