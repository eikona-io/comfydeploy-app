import { useMachines } from "@/hooks/use-machine";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { VirtualizedInfiniteList } from "@/components/virtualized-infinite-list";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MachineListItem } from "./machine-list-item";
export function MachineList() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 250);
  const [expandedMachineId, setExpandedMachineId] = useState<string | null>(
    null
  );

  const query = useMachines(debouncedSearchValue);

  return (
    <div className="h-[calc(100vh-60px)] max-h-full w-full max-w-[1500px] mx-auto py-4 px-2 md:px-10">
      <div className="flex items-center pb-4 gap-2">
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
            machine && expandedMachineId === machine.id && "z-10 drop-shadow-md"
          )
        }
        renderLoading={() => {
          return [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-[80px] w-full border rounded-md bg-white p-4 flex items-center justify-between animate-pulse mb-2"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-row">
                    <div className="w-[10px] h-[10px] bg-gray-200 rounded-full"></div>
                    <div className="h-4 w-60 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-12 bg-gray-200 rounded-md"></div>
                <div className="h-5 w-20 bg-gray-200 rounded-md"></div>
                <div className="h-5 w-12 bg-gray-200 rounded-md"></div>
                <Button variant="ghost" size="icon">
                  <ChevronDown className={"w-4 h-4"} />
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
