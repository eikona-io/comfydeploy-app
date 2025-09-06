import { MachineCreate } from "@/components/machines/machine-create";
import { MachineList } from "@/components/machines/machine-list";
import { useCurrentPlan } from "@/hooks/use-current-plan";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { Feature as AutumnFeature } from "@/types/autumn-v2";
import { useCurrentPlanWithStatus } from "@/hooks/use-current-plan";
import { getMachineLimits } from "@/lib/autumn-helpers";
export const Route = createFileRoute("/machines/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      view: search.view === "create" ? "create" : undefined,
      action:
        search.action === "update-custom-nodes"
          ? "update-custom-nodes"
          : undefined,
    };
  },
});

function RouteComponent() {
  const navigate = useNavigate({ from: "/machines" });
  const sub = useCurrentPlan();
  const { view } = Route.useSearch();
  const { data: planStatus } = useCurrentPlanWithStatus();
  const { isLimited: machineLimited } = getMachineLimits(planStatus, undefined, sub);

  useKeyboardShortcut(
    "c",
    () => {
      if (!machineLimited) {
        navigate({
          search: { view: "create" as const, action: undefined },
        });
      }
    },
    {
      exactPath: "/machines",
    },
  );

  if (view === "create") {
    return <MachineCreate />;
  }

  return <MachineList />;
}
