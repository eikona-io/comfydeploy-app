import { useActiveMachineCount } from "@/components/machines/active-machine-context";
import {
  MachineListItem,
  useHasActiveEvents,
} from "@/components/machines/machine-list-item";
import { Separator } from "@/components/ui/separator";
import { useMachinesAll } from "@/hooks/use-machine";
import { useEffect, useState } from "react";

function MachineWithActiveStatus({
  machine,
  expandedMachineId,
  setExpandedMachineId,
  machineActionItemList,
}: {
  machine: any;
  expandedMachineId: string | null;
  setExpandedMachineId: (id: string | null) => void;
  machineActionItemList: React.ReactNode;
}) {
  const { hasActiveEvents } = useHasActiveEvents(machine.id);
  const { incrementActive, decrementActive } = useActiveMachineCount();

  // Update active count when status changes
  useEffect(() => {
    if (hasActiveEvents) {
      incrementActive();
    }
    return () => {
      if (hasActiveEvents) {
        decrementActive();
      }
    };
  }, [hasActiveEvents, incrementActive, decrementActive]);

  if (!hasActiveEvents) return null;

  return (
    <MachineListItem
      key={machine.id}
      machine={machine}
      isExpanded={expandedMachineId === machine.id}
      setIsExpanded={(expanded: boolean) =>
        setExpandedMachineId(expanded ? machine.id : null)
      }
      machineActionItemList={machineActionItemList}
    />
  );
}

export function ActiveMachineList({
  machineActionItemList,
  hide = false,
}: {
  machineActionItemList: React.ReactNode;
  hide?: boolean;
}) {
  const [expandedMachineId, setExpandedMachineId] = useState<string | null>(
    null,
  );
  const { data: machines, isLoading } = useMachinesAll();
  const { activeCount } = useActiveMachineCount();

  if (isLoading || !machines || hide) return null;

  return (
    <div>
      {activeCount > 0 && (
        <h2 className="mb-2 font-medium">Currently Running ({activeCount})</h2>
      )}

      <div className="flex flex-col gap-2">
        {machines.map((machine: any) => (
          <MachineWithActiveStatus
            key={machine.id}
            machine={machine}
            expandedMachineId={expandedMachineId}
            setExpandedMachineId={setExpandedMachineId}
            machineActionItemList={machineActionItemList}
          />
        ))}
      </div>

      {activeCount > 0 && <Separator className="my-6" />}
    </div>
  );
}
