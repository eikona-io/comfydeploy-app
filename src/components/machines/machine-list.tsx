import { MachineListItem } from "@/components/machines/machine-list-item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VirtualizedInfiniteList } from "@/components/virtualized-infinite-list";
import { useCurrentPlan, useCurrentPlanQuery } from "@/hooks/use-current-plan";
import { useMachines } from "@/hooks/use-machine";
import { api } from "@/lib/api";
import { callServerPromise } from "@/lib/call-server-promise";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, Copy, RefreshCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { InsertModal } from "../auto-form/auto-form-dialog";
import {
  serverlessFormSchema,
  sharedMachineConfig,
} from "../machine/machine-schema";

export function MachineList() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 250);
  const [expandedMachineId, setExpandedMachineId] = useState<string | null>(
    null,
  );
  const sub = useCurrentPlan();

  const query = useMachines(debouncedSearchValue);

  return (
    <div className="mx-auto h-[calc(100vh-60px)] max-h-full w-full max-w-[1500px] px-2 py-4 md:px-10">
      <div className="flex items-center justify-between gap-2 pb-4">
        <Input
          placeholder="Filter machines..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="max-w-sm"
        />
        <Tooltip>
          <TooltipTrigger>
            {sub && (
              <Badge
                className={cn(
                  sub?.features.workflowLimited
                    ? "border-gray-400 text-gray-500"
                    : "",
                )}
              >
                <div className="flex items-center gap-2 px-2 text-xs">
                  {sub?.features.currentMachineCount}/
                  {sub?.features.machineLimit}
                </div>
              </Badge>
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Current Machines: {sub?.features.currentMachineCount} / Limit:{" "}
              {sub?.features.machineLimit}
            </p>
          </TooltipContent>
        </Tooltip>
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
            machineActionItemList={
              <MachineItemActionList
                machine={machine}
                sub={sub}
                refetch={async () => {
                  await query.refetch();
                }}
              />
            }
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

function MachineItemActionList({
  machine,
  refetch,
  sub,
}: {
  machine: any;
  refetch: () => void;
  sub: any;
}) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cloneModalOpen, setCloneModalOpen] = useState(false);

  const { refetch: refetchPlan } = useCurrentPlanQuery();
  const isDockerCommandStepsNull =
    machine.docker_command_steps === null &&
    machine.type === "comfy-deploy-serverless";

  return (
    <div className="flex flex-row">
      {machine.type === "comfy-deploy-serverless" && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isDockerCommandStepsNull}
                // onClick={() => setOpen2(true)}
              >
                <RefreshCcw className="h-[14px] w-[14px]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rebuild</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isDockerCommandStepsNull}
                onClick={() => setCloneModalOpen(true)}
              >
                <Copy className="h-[14px] w-[14px]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clone</TooltipContent>
          </Tooltip>
        </>
      )}

      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500"
            onClick={() => setDeleteModalOpen(true)}
          >
            <Trash2 className="h-[14px] w-[14px]" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>

      <DeleteMachineDialog
        machine={machine}
        refetch={refetch}
        planRefetch={refetchPlan}
        dialogOpen={deleteModalOpen}
        setDialogOpen={setDeleteModalOpen}
      />
      <CloneMachineDialog
        machine={machine}
        refetch={refetch}
        dialogOpen={cloneModalOpen}
        setDialogOpen={setCloneModalOpen}
        sub={sub}
      />
    </div>
  );
}

interface MachineDialogProps {
  machine: any;
  refetch: () => void;
  dialogOpen: boolean;
  setDialogOpen: (dialogOpen: boolean) => void;
}

function DeleteMachineDialog({
  machine,
  refetch,
  planRefetch,
  dialogOpen,
  setDialogOpen,
}: MachineDialogProps & { planRefetch?: () => void }) {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className={cn("sm:max-w-[425px]")}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {"Delete"} <Badge variant={"secondary"}>{machine.name}</Badge>
          </DialogTitle>
          <DialogDescription className="text-primary">
            Careful this is destructive and cannot be undone.
            {machine.type === "workspace" && (
              <>
                <br />
                <br />
                Deleting Workspaces will remove all outputs, contact us if you
                want to save your configuration
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full justify-end gap-2">
          <Button
            className="w-fit"
            variant={"outline"}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();

              setDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="w-fit"
            variant="destructive"
            onClick={async (e) => {
              e.stopPropagation();
              e.preventDefault();

              if (machine?.keep_warm !== undefined && machine.keep_warm > 0) {
                toast.error(
                  "Please set keep warm to 0 before deleting the machine.",
                );
                return;
              }

              await callServerPromise(
                api({
                  url: `machine/${machine.id}`,
                  init: {
                    method: "DELETE",
                  },
                }),
                {
                  loadingText: "Deleting machine",
                  errorAction: {
                    name: "Force delete",
                    action: async () => {
                      await callServerPromise(
                        api({
                          url: `machine/${machine.id}`,
                          init: {
                            method: "DELETE",
                          },
                          params: {
                            force: true,
                          },
                        }),
                        {
                          loadingText: "Deleting machine",
                        },
                      );
                      await planRefetch();
                    },
                  },
                },
              );

              await refetch();
              setDialogOpen(false);
            }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CloneMachineDialog({
  machine,
  refetch,
  dialogOpen,
  setDialogOpen,
  sub,
}: MachineDialogProps & { sub: any }) {
  const navigate = useNavigate();

  return (
    <InsertModal
      hideButton
      keepDialogWhenSubmit={true}
      open={dialogOpen && !sub?.features.machineLimited}
      setOpen={setDialogOpen}
      disabled={sub?.features.machineLimited}
      dialogClassName="!max-w-[1200px] !max-h-[calc(90vh-10rem)]"
      containerClassName="lg:flex-row lg:gap-14"
      tooltip={
        sub?.features.machineLimited
          ? `Max ${sub?.features.machineLimit} ComfyUI machine for your account, upgrade to unlock more configuration.`
          : `Max ${sub?.features.machineLimit} ComfyUI machine for your account`
      }
      data={{
        name: `${machine.name} (Clone)`,
        extra_docker_commands: machine.extra_docker_commands,
        gpu: machine.gpu,
        allow_concurrent_inputs: machine.allow_concurrent_inputs,
        docker_command_steps: machine.docker_command_steps,
        run_timeout: machine.run_timeout,
        concurrency_limit: machine.concurrency_limit,
        idle_timeout: machine.idle_timeout,
        comfyui_version: machine.comfyui_version,
        install_custom_node_with_gpu: machine.install_custom_node_with_gpu,
        ws_timeout: machine.ws_timeout,
        machine_builder_version: machine.machine_builder_version,
        base_docker_image: machine.base_docker_image,
        extra_args: machine.extra_args,
        prestart_command: machine.prestart_command,
        python_version: machine.python_version,
      }}
      title="Clone Machine"
      description="Clone the selected machine with the same configuration."
      serverAction={async (data) => {
        if (data.docker_command_steps?.steps) {
          const duplicateNode = hasDuplicateCustomNodeURLs(
            data.docker_command_steps.steps,
          );
          if (duplicateNode) {
            toast.error(
              `Duplicate custom-node (${duplicateNode}) is found. Please check your dependencies.`,
            );
            return;
          }
        }
        setDialogOpen(false);

        try {
          const res = await callServerPromise(
            api({
              url: "machine/serverless",
              init: {
                method: "POST",
                body: JSON.stringify(data),
              },
            }),
            {
              loadingText: "Cloning machine",
            },
          );

          if (!res) {
            throw new Error("Failed to clone machine");
          }

          await refetch();
          setDialogOpen(false);

          toast.success("Cloned successfully!", {
            action: {
              label: "Checkout",
              onClick: () => {
                navigate({
                  to: "/machines/$machineId",
                  params: {
                    machineId: res.id,
                  },
                  search: {
                    view: "logs",
                  },
                });
              },
            },
          });
        } catch (error) {
          console.error("Clone error:", error);
          throw error;
        }
      }}
      formSchema={serverlessFormSchema}
      fieldConfig={sharedMachineConfig}
    />
  );
}

// Helper function to check for duplicate URLs in docker_command_steps for custom-node types
function hasDuplicateCustomNodeURLs(
  steps: Array<{ type: string; data: { url: string; name: string } }>,
): string | null {
  const urlMap = new Map<string, string>(); // Map to store url -> node name
  for (const step of steps) {
    if (step.type === "custom-node") {
      const url = step.data.url.toLowerCase();
      if (urlMap.has(url)) {
        return step.data.name;
      }
      urlMap.set(url, step.data.name);
    }
  }
  return null; // No duplicates
}
