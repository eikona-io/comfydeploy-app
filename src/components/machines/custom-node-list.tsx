import { ExternalLink, Star } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CustomNodeList({
  machine,
  numOfNodes = 3,
}: {
  machine: any;
  numOfNodes?: number;
}) {
  return (
    <>
      {machine.docker_command_steps?.steps?.length > 0 && (
        <ScrollArea className="flex w-full justify-start" hideVertical>
          <span className="text-xs text-gray-400 whitespace-nowrap flex items-center">
            {machine.docker_command_steps.steps
              .slice(0, numOfNodes)
              .map((node: any) =>
                node.type === "custom-node" ? (
                  <a
                    key={node.id}
                    href={node.data?.url ?? "#"}
                    target="_blank"
                    className="text-[11px] text-muted-foreground hover:text-primary inline-flex items-center gap-1 bg-secondary/50 px-1.5 rounded-sm mr-1"
                    rel="noreferrer"
                  >
                    <span className="max-w-[100px] truncate inline-block">
                      {node.data?.name}
                    </span>
                    {node.data?.meta?.stargazers_count !== undefined && (
                      <span className="inline-flex items-center gap-0.5">
                        <Star className="h-2.5 w-2.5" />
                        {node.data.meta.stargazers_count.toLocaleString()}
                      </span>
                    )}
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                ) : node.type === "custom-node-manager" ? (
                  <span
                    key={node.id}
                    className="text-[11px] text-muted-foreground inline-flex items-center gap-1 bg-secondary/50 px-1.5 rounded-sm mr-1"
                    title={`${node.data.node_id} (${node.data.version})`}
                  >
                    <span className="max-w-[150px] truncate inline-block">
                      {node.data.node_id}
                    </span>
                  </span>
                ) : (
                  <span
                    key={node.id}
                    className="text-[11px] text-muted-foreground inline-flex items-center gap-1 bg-secondary/50 px-1.5 rounded-sm mr-1"
                    title={node.data}
                  >
                    <span className="max-w-[150px] truncate inline-block">
                      {node.data}
                    </span>
                  </span>
                ),
              )}

            {machine.docker_command_steps.steps.length > numOfNodes && (
              <Popover>
                <PopoverTrigger>
                  <span className="text-2xs flex text-gray-400 whitespace-nowrap items-center leading-none">
                    +{machine.docker_command_steps.steps.length - numOfNodes}{" "}
                    more
                  </span>
                </PopoverTrigger>
                <PopoverContent className="w-[300px]">
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-medium">All Nodes</div>
                    {machine.docker_command_steps.steps.map((node: any) =>
                      node.type === "custom-node" ? (
                        <a
                          key={node.id}
                          href={node.data?.url ?? "#"}
                          target="_blank"
                          className="text-[11px] text-muted-foreground hover:text-primary flex items-center justify-between w-full"
                          rel="noreferrer"
                        >
                          <span className="truncate flex-1">
                            {node.data?.name}
                          </span>
                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            {node.data?.meta?.stargazers_count !== undefined && (
                              <span className="inline-flex items-center gap-0.5">
                                <Star className="h-2.5 w-2.5" />
                                {node.data.meta.stargazers_count.toLocaleString()}
                              </span>
                            )}
                            <ExternalLink className="h-2.5 w-2.5" />
                          </div>
                        </a>
                      ) : node.type === "custom-node-manager" ? (
                        <span
                          key={node.id}
                          className="text-[11px] text-muted-foreground flex items-center w-full"
                          title={`${node.data.node_id} (${node.data.version})`}
                        >
                          <span className="truncate">{node.data.node_id}</span>
                        </span>
                      ) : (
                        <span
                          key={node.id}
                          className="text-[11px] text-muted-foreground flex items-center w-full"
                          title={node.data}
                        >
                          <span className="truncate">{node.data}</span>
                        </span>
                      ),
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </span>
        </ScrollArea>
      )}
    </>
  );
}
