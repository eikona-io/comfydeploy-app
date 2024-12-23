import { MachineCreate } from "@/components/machines/machine-create";
import { MachineList } from "@/components/machines/machine-list";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/machines/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { view } = Route.useSearch();

  return view === "create" ? <MachineCreate /> : <MachineList />;
}
