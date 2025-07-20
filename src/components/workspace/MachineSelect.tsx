import { MachineStatus } from "@/components/machines/machine-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentWorkflow } from "@/hooks/use-current-workflow";
import { useMachine, useMachines } from "@/hooks/use-machine";
import { api } from "@/lib/api";
import { callServerPromise } from "@/lib/call-server-promise";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ExternalLink, Search, Settings } from "lucide-react";
import * as React from "react";
import { useDebounce } from "use-debounce";
import { UserIcon } from "../run/SharePageComponent";
import { VirtualizedInfiniteList } from "../virtualized-infinite-list";
import { useUserSessionsCount } from "./session-creator-form";

interface MachineSelectProps {
  workflow_id: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSettingsClick?: (machineId: string) => void;
}

export function MachineSelect({
  workflow_id,
  className,
  value,
  onChange,
  onSettingsClick,
}: MachineSelectProps) {
  const { workflow, mutateWorkflow } = useCurrentWorkflow(workflow_id);

  // Use either the controlled value or the workflow's selected machine
  const machineId = value ?? workflow?.selected_machine_id;
  const { data: valueData } = useMachine(machineId);

  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 250);

  const query = useMachines(debouncedSearchValue);

  const userSessionCount = useUserSessionsCount(machineId || "");

  React.useEffect(() => {
    query.refetch();
  }, [debouncedSearchValue]);

  const handleSelect = async (selectedMachine: any) => {
    if (onChange) {
      // Controlled mode - just call onChange
      onChange(selectedMachine.id);
    } else {
      // Uncontrolled mode - update workflow's selected machine
      await callServerPromise(
        api({
          url: `workflow/${workflow_id}`,
          init: {
            method: "PATCH",
            body: JSON.stringify({
              selected_machine_id: selectedMachine.id,
            }),
          },
        }),
      );
      mutateWorkflow();
    }
    setOpen(false);
  };

  return (
    <div className={cn("flex w-full items-center", className)}>
      <div className="min-w-0 flex-auto">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild disabled={userSessionCount > 0}>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="flex w-full justify-between border-none bg-transparent pr-0 hover:bg-transparent"
            >
              <span className="w-full truncate text-ellipsis text-start">
                <>
                  {valueData ? (
                    <div className="flex w-full items-center">
                      <div className="flex min-w-0 gap-1 flex-grow items-center">
                        {valueData?.gpu && (
                          <Badge className="flex-shrink-0">
                            {valueData?.gpu}
                          </Badge>
                        )}
                        <span className="truncate text-xs">
                          {valueData?.name}
                        </span>
                      </div>
                      <MachineStatus
                        machine={{
                          ...(valueData || {}),
                        }}
                        mini={true}
                      />
                    </div>
                  ) : (
                    "Select a machine"
                  )}
                </>
              </span>
              <ChevronDown className="mx-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-[400px] overflow-hidden p-0"
            side="bottom"
          >
            <div className="relative p-2">
              <Search className="-translate-y-1/2 absolute top-1/2 left-6 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search machines..."
                className="pl-12 text-sm"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <VirtualizedInfiniteList
              queryResult={query}
              renderItem={(item) => (
                <MachineRow
                  item={item}
                  selected={valueData}
                  onSelect={handleSelect}
                />
              )}
              renderLoading={() => <LoadingRow />}
              estimateSize={58}
            />
          </PopoverContent>
        </Popover>
      </div>
      <Separator orientation="vertical" className="z-10 h-[40px] flex-none" />
      {onSettingsClick ? (
        <Button
          variant={"ghost"}
          className="flex-none border-none hover:bg-transparent"
          onClick={() => valueData?.id && onSettingsClick(valueData.id)}
        >
          <Settings size={14} />
        </Button>
      ) : (
        <Link
          to="/workflows/$workflowId/$view"
          params={{
            workflowId: workflow_id,
            view: "machine",
          }}
        >
          <Button
            variant={"ghost"}
            className="flex-none border-none hover:bg-transparent"
          >
            <Settings size={14} />
          </Button>
        </Link>
      )}
    </div>
  );
}

function MachineRow({
  item,
  selected,
  onSelect,
}: {
  item: any;
  selected?: any;
  onSelect: (value: any) => void;
  // shareMachine?: any;
}) {
  const isSelected = selected?.id === item.id;

  return (
    <div
      className={cn(
        "flex h-full items-center overflow-hidden transition-colors cursor-pointer",
        isSelected ? "bg-accent" : "hover:bg-accent/50",
      )}
      onClick={() => onSelect(item)}
    >
      <div className="relative flex h-full w-[400px] flex-shrink items-center gap-1 px-2 py-1 text-xs">
        <div className="flex w-full flex-col gap-0.5">
          <span className="flex w-full items-center justify-between gap-1">
            <div className="flex items-center gap-4">
              <UserIcon user_id={item.user_id} className="w-6 h-6" />
              <div className="flex flex-col">
                <div
                  className={cn(
                    "flex items-center gap-1",
                    isSelected && "font-medium",
                  )}
                >
                  {item?.name}
                </div>
                <div className="text-[10px] text-muted-foreground leading-none">
                  {item?.id.slice(0, 8)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.gpu && (
                <Badge className="text-[10px] px-2 py-0">{item.gpu}</Badge>
              )}
              <MachineStatus machine={item} mini={true} />
              <Button
                variant={"ghost"}
                // disabled={isShareMachine}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open("/machines/" + item.id, "_blank");
                }}
                className="h-6 w-6 p-0 hover:bg-background/80"
              >
                <ExternalLink size={12} />
              </Button>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
}

function LoadingRow() {
  return (
    <div className="flex items-center space-x-4 p-3 text-sm">
      <Skeleton className="h-6 w-6 rounded-full" />
      <div className="flex-grow">
        <Skeleton className="mb-2 h-4 w-20" />
        <Skeleton className="mb-2 h-3 w-full" />
        <div className="flex space-x-2">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-7 w-20" />
        </div>
      </div>
    </div>
  );
}
