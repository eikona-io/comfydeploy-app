import { MachineCreate } from "@/components/machines/machine-create";
import { MachineList } from "@/components/machines/machine-list";
import { useCurrentPlan } from "@/hooks/use-current-plan";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/machines/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: "/machines" });
  const sub = useCurrentPlan();
  const { view } = Route.useSearch();

  useKeyboardShortcut(
    "c",
    () => {
      if (!sub?.features.machineLimited) {
        navigate({
          search: { view: "create" },
        });
      }
    },
    {
      exactPath: "/machines",
    },
  );

  return view === "create" ? <MachineCreate /> : <MachineList />;
}
