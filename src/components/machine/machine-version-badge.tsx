import { Badge } from "@/components/ui/badge";
import { useMachineVersion, useMachineVersionsAll } from "@/hooks/use-machine";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { CircleArrowUp, RotateCcw } from "lucide-react";
import { useMemo } from "react";

export function MachineVersionBadge({
  machine,
  isExpanded,
}: {
  machine: any;
  isExpanded: boolean;
}) {
  const { data: machineVersion } = useMachineVersion(
    machine.id,
    machine.machine_version_id,
  );
  const { data: machineVersionsAll, isLoading: isLoadingVersions } =
    useMachineVersionsAll(machine.id);

  const isLatestVersion = useMemo(() => {
    if (isLoadingVersions || !machineVersionsAll) return true;

    return (
      machine?.machine_version_id !== null &&
      machineVersionsAll[0]?.id === machine.machine_version_id
    );
  }, [machine?.machine_version_id, machineVersionsAll, isLoadingVersions]);

  return (
    <Link
      to="/machines/$machineId"
      params={{
        machineId: machine.id,
      }}
      search={{ view: "history" }}
      className="flex items-center justify-center"
    >
      <Badge
        variant={isLatestVersion ? "blue" : "yellow"}
        className={cn(
          "!text-[11px] !font-semibold !py-0",
          isExpanded ? "!py-0.5 ml-1" : "!py-0 ml-2",
        )}
      >
        {isLatestVersion ? (
          <CircleArrowUp className="h-3 w-3" />
        ) : (
          <RotateCcw className="h-3 w-3" />
        )}
        v{machineVersion?.version}
      </Badge>
    </Link>
  );
}
