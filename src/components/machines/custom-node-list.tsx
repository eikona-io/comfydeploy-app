import { ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function CustomNodeList({ machine }: { machine: any }) {
  return (
    <>
      {machine.docker_command_steps?.steps?.length > 0 && (
        <ScrollArea className="flex w-full justify-start mt-1" hideVertical>
          <span className="text-xs text-gray-400 whitespace-nowrap flex items-center">
            <>
              {machine.docker_command_steps.steps
                .filter((node: any) => node.type === "custom-node")
                .slice(0, 3)
                .map((node: any) => (
                  <a
                    key={node.id}
                    href={node.data?.url ?? "#"}
                    target="_blank"
                    className="text-[11px] text-muted-foreground hover:text-primary inline-flex items-center gap-1 bg-secondary/50 px-1.5 rounded-sm mr-1"
                  >
                    <span className="max-w-[100px] truncate inline-block">
                      {node.data?.name}
                    </span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                ))}

              {machine.docker_command_steps.steps.length > 3 && (
                <Popover>
                  <PopoverTrigger>
                    <span className="text-2xs flex text-gray-400 whitespace-nowrap items-center leading-none">
                      +{machine.docker_command_steps.steps.length - 3} more
                    </span>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="flex flex-col gap-2">
                      <div className="text-sm font-medium">All Nodes</div>
                      {machine.docker_command_steps.steps
                        .filter((node: any) => node.type === "custom-node")
                        .map((node: any) => (
                          <a
                            key={node.id}
                            href={node.data?.url ?? "#"}
                            target="_blank"
                            className="text-[11px] text-muted-foreground hover:text-primary flex items-center justify-between w-full"
                          >
                            <span className="truncate flex-1">
                              {node.data?.name}
                            </span>
                            <ExternalLink className="h-2.5 w-2.5 flex-shrink-0 ml-2" />
                          </a>
                        ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </>
          </span>
        </ScrollArea>
      )}
    </>
  );
}
