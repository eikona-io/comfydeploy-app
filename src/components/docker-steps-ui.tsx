import { getBranchInfo } from "@/hooks/use-github-branch-info";
import { generateDockerCommandsForCustomNode } from "@/lib/generate-docker-def";
import { getRelativeTime } from "@/lib/get-relative-time";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  AlertTriangle,
  Edit,
  FileWarning,
  MoreVertical,
  Plus,
  Terminal,
} from "lucide-react";
import { customAlphabet } from "nanoid";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { InsertModal } from "./auto-form/auto-form-dialog";
import { CopyButton } from "./copy-button";
import { CustomNodeItem } from "./custom-node-item";
import { useCustomNodeSelector } from "./custom-nodes-selector-legacy";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { CodeBlock } from "./ui/code-blocks";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const id = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-",
);

export function DockerStepsUI({
  data: _data,
  onEdit,
}: {
  data: any;
  onEdit?: (data: any) => void;
}) {
  if (!_data)
    _data = {
      steps: [],
    };

  const data = _data;

  const { steps } = data;

  const items = useMemo(() => {
    return data.steps.map((step: any, index: number) => {
      return step.id;
    });
  }, [data.steps]);

  const canEdit = !!onEdit;

  const [tempEdit, setTempEdit] = useState<string>(
    JSON.stringify(data, null, 2),
  );
  const [tempEditParseError, setTempEditParseError] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [addCustomNodeDialogOpen, setAddCustomNodeDialogOpen] =
    useState<boolean>(false);
  const [customDockerCommandsOpen, setCustomDockerCommandsOpen] =
    useState<boolean>(false);
  const [editingCustomCommands, setEditingCustomCommands] = useState<string>();
  const [editingStepIndex, setEditingStepIndex] = useState<number>();

  useEffect(() => {
    setTempEdit(JSON.stringify(data, null, 2));
  }, [data]);

  const customNodes = useMemo(() => {
    const customNodes = data.steps
      .filter((x: any) => x.type === "custom-node")
      .map((x: any) => ({ data: x.data }));
    return Object.fromEntries(
      customNodes.map((x: any, i: number) => {
        if (typeof x.data === "object") return [x.data.name as string, x.data];
        return [(x.data as any).name as string, x.data];
      }),
    );
  }, [data]);

  const { selector } = useCustomNodeSelector({
    value: customNodes,
    commandListClassName: "max-h-fit",
    onEdit: (value) => {
      const newValue = {
        ...data,
        steps: [
          ...steps.filter((x: any) => x.type === "commands"),
          ...Object.values(value).map((v: any) => ({
            id: id(10),
            type: "custom-node" as const,
            data: v,
          })),
        ],
      };
      onEdit?.(newValue);
      setAddCustomNodeDialogOpen(false);
    },
    open: addCustomNodeDialogOpen,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [editHashStep, setEditingNode] = useState<string>();

  return (
    <>
      <div className="flex items-center justify-between font-bold">
        {/* Docker Build Steps{" "} */}
        {canEdit && (
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2" variant="outline">
                  Add <Plus size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem
                  onClick={async () => {
                    setAddCustomNodeDialogOpen(true);
                  }}
                >
                  Add Custom Node
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    setCustomDockerCommandsOpen(true);
                  }}
                >
                  Add Docker Commands
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
              open={addCustomNodeDialogOpen}
              onOpenChange={setAddCustomNodeDialogOpen}
            >
              <DialogContent className="grid h-full max-h-[600px] grid-rows-[auto,1fr,auto] sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add Custom Node</DialogTitle>
                  <DialogDescription className="flex justify-between gap-2">
                    <div>Add a custom node to the build steps</div>
                  </DialogDescription>
                </DialogHeader>
                {selector}
              </DialogContent>
            </Dialog>

            <Dialog
              open={customDockerCommandsOpen}
              onOpenChange={setCustomDockerCommandsOpen}
            >
              <DialogContent className="grid h-full max-h-[400px] grid-rows-[auto,auto,1fr,auto] sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add Docker Commands</DialogTitle>
                  <DialogDescription className="flex justify-between gap-2">
                    <div>Add custom docker commands to the build steps</div>
                  </DialogDescription>
                </DialogHeader>
                <Alert>
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Tips</AlertTitle>
                  <AlertDescription>
                    To run <code>cd</code> command, use{" "}
                    <CopyButton
                      variant={"outline"}
                      hideLabel
                      className="inline-flex h-fit min-h-0 py-0 font-mono font-xs"
                      text="RUN cd some_folder"
                    >
                      RUN cd some_folder
                    </CopyButton>
                    , you can also do multi line commands.
                  </AlertDescription>
                </Alert>
                <Textarea
                  value={editingCustomCommands}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setEditingCustomCommands(e.target.value)
                  }
                  placeholder="Enter Docker command"
                />
                <DialogFooter>
                  <DialogClose>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setEditingCustomCommands("");
                        setEditingStepIndex(undefined);
                      }}
                    >
                      Close
                    </Button>
                  </DialogClose>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      if (!editingCustomCommands) return;

                      let newValue: any;
                      if (typeof editingStepIndex === "number") {
                        // Update the existing command at the specific index
                        newValue = {
                          ...data,
                          steps: data.steps.map((step: any, index: number) => {
                            if (
                              index === editingStepIndex &&
                              step.type === "commands"
                            ) {
                              return { ...step, data: editingCustomCommands };
                            }
                            return step;
                          }),
                        };
                      } else {
                        // Add a new command
                        newValue = {
                          ...data,
                          steps: [
                            ...data.steps,
                            {
                              id: id(10),
                              type: "commands" as const,
                              data: editingCustomCommands,
                            },
                          ],
                        };
                      }

                      onEdit?.(newValue);
                      setCustomDockerCommandsOpen(false);
                      setEditingStepIndex(undefined);
                      setEditingCustomCommands("");
                    }}
                  >
                    Add
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
                <Button iconPlacement="right" variant="secondary" Icon={Edit}>
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="grid h-full max-h-[600px] grid-rows-[auto,1fr,auto] sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Edit custom nodes</DialogTitle>
                  <DialogDescription className="flex justify-between gap-2">
                    <div>Make advance changes to the snapshots</div>{" "}
                    {tempEditParseError && (
                      <FileWarning size={14} color="red" />
                    )}
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  className="h-full max-h-[600px] w-full rounded-md p-2 text-xs"
                  value={tempEdit}
                  onChange={(e) => {
                    setTempEdit(e.target.value);
                  }}
                />
                <DialogFooter>
                  <DialogClose>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      try {
                        onEdit?.(JSON.parse(tempEdit));
                        setEditDialogOpen(false);
                        setTempEditParseError(false);
                      } catch (e) {
                        setTempEditParseError(true);
                        toast.error("Invalid JSON");
                      }
                    }}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <Card className="!p-0 overflow-hidden">
        <ScrollArea className="h-full py-4">
          <DndContext
            modifiers={[restrictToVerticalAxis]}
            collisionDetection={closestCenter}
            sensors={sensors}
            onDragEnd={(event) => {
              const { active, over } = event;

              if (over) {
                const oldIndex = steps.findIndex(
                  (step: any) => step.id === active.id,
                );
                const newIndex = steps.findIndex(
                  (step: any) => step.id === over.id,
                );

                if (newIndex !== oldIndex) {
                  const newSteps = [...steps];
                  const [movedItem] = newSteps.splice(oldIndex, 1);
                  newSteps.splice(newIndex, 0, movedItem);

                  const newValue = {
                    ...data,
                    steps: newSteps,
                  };
                  onEdit?.(newValue);
                }
              }
            }}
          >
            <SortableContext items={items}>
              {steps.length <= 0 && (
                // <div className="w-full h-[1px] bg-slate-200 dark:bg-primary">
                <div className="px-6 text-sm">No dependencies</div>
                // </div>
              )}
              {steps.map((step: any, index: number) => (
                <>
                  {step.type === "custom-node" && (
                    <CustomNodeItem
                      id={step.id}
                      description={
                        <Collapsible className="w-full">
                          <CollapsibleTrigger className="max-w-[400px] truncate text-ellipsis hover:underline">
                            {(step.data as any).meta ? (
                              <>
                                {(step.data as any)?.meta?.committer?.date && (
                                  <>
                                    {getRelativeTime(
                                      new Date(
                                        (step.data as any).meta.committer.date,
                                      ),
                                    )}
                                  </>
                                )}
                                {(step.data as any)?.meta?.committer?.name && (
                                  <>
                                    {" | " +
                                      (step.data as any).meta.committer.name}
                                  </>
                                )}
                                {(step.data as any)?.meta?.message && (
                                  <>{" | " + (step.data as any).meta.message}</>
                                )}
                              </>
                            ) : (
                              step.data.hash
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent className="w-full overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                            <div className="flex w-full max-w-lg flex-col gap-2">
                              {(step.data as any)?.meta?.commit_url && (
                                <Button
                                  variant={"link"}
                                  className="w-fit"
                                  target="_blank"
                                  href={(step.data as any)?.meta?.commit_url}
                                >
                                  View commit
                                </Button>
                              )}
                              <CodeBlock
                                lang={"docker"}
                                code={generateDockerCommandsForCustomNode({
                                  custom_node: step.data,
                                }).join("\n")}
                              />
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      }
                      title={step.data.name}
                      url={step.data.url}
                      index={index + 1}
                      key={step.data.url}
                      actions={
                        <div className="flex items-center gap-2">
                          {step.data.warning && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button type="button">
                                  <AlertTriangle
                                    className="text-yellow-600"
                                    size={16}
                                  />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm text-yellow-600">
                                  {step.data.warning}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {canEdit && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild type="button">
                                <Button type="button" variant={"ghost"}>
                                  <MoreVertical size={12} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  className="text-red-500"
                                  onClick={() => {
                                    const newSteps = data.steps.filter(
                                      (s: any) => {
                                        if (s.type === "custom-node") {
                                          return s.data.url !== step.data.url;
                                        }
                                        return true;
                                      },
                                    );
                                    const newValue = {
                                      ...data,
                                      steps: newSteps,
                                    };
                                    onEdit?.(newValue);
                                  }}
                                >
                                  Delete
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  // className="opacity-50"
                                  onClick={async () => {
                                    const branchInfo = await getBranchInfo(
                                      step.data.url,
                                    );
                                    if (!branchInfo) return;

                                    console.log(branchInfo);

                                    if (
                                      step.data.hash !== branchInfo?.commit.sha
                                    ) {
                                      toast.success(
                                        `Updated hash to latest: ${branchInfo?.commit.commit.message}`,
                                      );
                                    } else {
                                      toast(
                                        `At latest: ${branchInfo?.commit.commit.message}`,
                                      );
                                    }

                                    step.data.hash = branchInfo?.commit.sha;

                                    const newValue = {
                                      ...data,
                                      steps: steps,
                                    };
                                    onEdit?.(newValue);
                                  }}
                                >
                                  Update
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setEditingNode(step.id);
                                  }}
                                >
                                  Set Hash
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      }
                    />
                  )}

                  {step.type === "commands" && (
                    <CustomNodeItem
                      id={step.id}
                      description={
                        <div className="whitespace-pre-wrap">
                          <CodeBlock
                            hideCopy
                            className="[&>pre]:!py-0 [&>pre]:!px-4 w-fit text-xs"
                            lang={"docker"}
                            code={
                              step.data.length > 50
                                ? `${step.data.substring(0, 50)} ...`
                                : step.data
                            }
                          />
                        </div>
                      }
                      title={"Custom Command"}
                      // url={step.data.url}
                      index={index + 1}
                      key={step.data}
                      actions={
                        <>
                          {canEdit && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild type="button">
                                <Button type="button" variant={"ghost"}>
                                  <MoreVertical size={12} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => {
                                    console.log("delete");
                                    const updatedSteps = steps.filter(
                                      (_: any, idx: number) => idx !== index,
                                    );
                                    const newValue = {
                                      ...data,
                                      steps: updatedSteps,
                                    };
                                    onEdit?.(newValue);
                                  }}
                                >
                                  Delete
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={async () => {
                                    setEditingStepIndex(index);
                                    setEditingCustomCommands(step.data ?? "");
                                    setCustomDockerCommandsOpen(true);
                                  }}
                                >
                                  Edit
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </>
                      }
                    />
                  )}
                </>
              ))}
            </SortableContext>
          </DndContext>
        </ScrollArea>
      </Card>

      <InsertModal
        trigger={<></>}
        open={!!editHashStep}
        setOpen={() => {
          setEditingNode(undefined);
        }}
        data={{
          hash: editHashStep
            ? ((
                steps.find(
                  (x) => x.id === editHashStep && x.type === "custom-node",
                ) as { data: { hash: string } }
              )?.data.hash ?? "")
            : "",
        }}
        dialogClassName="sm:max-w-[600px]"
        title="Configure Custom Node"
        description="Configure the custom node"
        serverAction={async (_data) => {
          const step = steps.find((x) => x.id === editHashStep);

          if (!step) return;
          if (step.type !== "custom-node") return;

          step.data.hash = _data.hash;

          const newValue = {
            ...data,
            steps: steps,
          };
          onEdit?.(newValue);
        }}
        formSchema={z.object({
          hash: z.string().min(1),
        })}
      />
    </>
  );
}
