import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VirtualizedInfiniteList } from "@/components/virtualized-infinite-list";
import { useMachines } from "@/hooks/use-machine";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { MachineListItem } from "./machine-list-item";
export function MachineList() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 250);
  const [expandedMachineId, setExpandedMachineId] = useState<string | null>(
    null,
  );

  const query = useMachines(debouncedSearchValue);

  return (
    <div className="mx-auto h-[calc(100vh-60px)] max-h-full w-full max-w-[1500px] px-2 py-4 md:px-10">
      <div className="flex items-center gap-2 pb-4">
        <Input
          placeholder="Filter machines..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <VirtualizedInfiniteList
        className="!h-full w-full"
        queryResult={query}
        renderItem={(machine) => (
          <MachineListItem
            key={machine.id}
            machine={machine}
            isExpanded={expandedMachineId === machine.id}
            setIsExpanded={(expanded) =>
              setExpandedMachineId(expanded ? machine.id : null)
            }
            machineActionItemList={<></>}
          />
        )}
        renderItemClassName={(machine) =>
          cn(
            "z-0 transition-all duration-200",
            machine &&
              expandedMachineId === machine.id &&
              "z-10 drop-shadow-md",
          )
        }
        renderLoading={() => {
          return [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="mb-2 flex h-[80px] w-full animate-pulse items-center justify-between rounded-md border bg-white p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row items-center gap-2">
                    <div className="h-[10px] w-[10px] rounded-full bg-gray-200" />
                    <div className="h-4 w-60 rounded bg-gray-200" />
                  </div>
                  <div className="h-3 w-32 rounded bg-gray-200" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-12 rounded-md bg-gray-200" />
                <div className="h-5 w-20 rounded-md bg-gray-200" />
                <div className="h-5 w-12 rounded-md bg-gray-200" />
                <Button variant="ghost" size="icon">
                  <ChevronDown className={"h-4 w-4"} />
                </Button>
              </div>
            </div>
          ));
        }}
        estimateSize={90}
      />
    </div>
  );
}
