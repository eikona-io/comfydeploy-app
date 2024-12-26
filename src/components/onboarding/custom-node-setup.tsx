import type {
  DockerCommandStep,
  MachineStepValidation,
} from "@/components/machines/machine-create";
import type { StepValidation } from "@/components/onboarding/workflow-import";
import type { StepComponentProps } from "@/components/step-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getBranchInfo } from "@/hooks/use-github-branch-info";
import { cn } from "@/lib/utils";
import {
  DndContext,
  type DragEndEvent,
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ChevronRight,
  ExternalLink,
  Minus,
  Pencil,
  Save,
  Search,
  Star,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type DefaultCustomNodeData = {
  title: string;
  author: string;
  reference: string;
  pip: string[];
  files: string[];
  install_type: string;
  description: string;
};

const BLACKLIST = [
  "https://github.com/ltdrdata/ComfyUI-Manager",
  "https://github.com/kulsisme/openart-comfyui-deploy",
  // "https://github.com/BennyKok/comfyui-deploy",
  // Add more blacklisted references here
  "https://github.com/mrhan1993/ComfyUI-Fooocus",
];

export function CustomNodeSetup({
  validation,
  setValidation,
}: StepComponentProps<MachineStepValidation>) {
  const { data, isLoading } = useQuery<DefaultCustomNodeData[]>({
    queryKey: ["custom-node-list"],
    queryFn: async () => {
      const response = await fetch(
        "https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/custom-node-list.json",
      );
      const json = await response.json();
      return json.custom_nodes;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null);

  const handleAddNode = async (node: DefaultCustomNodeData) => {
    const nodeRefLower = node.reference.toLowerCase();
    if (
      validation.docker_command_steps.steps.some(
        (step) => step.data.url.toLowerCase() === nodeRefLower,
      )
    ) {
      return;
    }

    try {
      const branchInfo = await getBranchInfo(node.reference);
      setValidation({
        ...validation,
        docker_command_steps: {
          steps: [
            ...validation.docker_command_steps.steps,
            {
              id: crypto.randomUUID().slice(0, 10), // Add unique ID
              type: "custom-node",
              data: {
                name: node.title,
                url: node.reference,
                files: node.files,
                install_type: "git-clone",
                pip: node.pip,
                hash: branchInfo?.commit.sha, // Optional hash
                meta: {
                  message: branchInfo?.commit.commit.message,
                  committer: {
                    name: node.author,
                  },
                  latest_hash: branchInfo?.commit.sha,
                  stargazers_count: branchInfo?.stargazers_count,
                },
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error("Failed to fetch branch info:", error);
      toast.error("Failed to fetch repository information");
    }
  };

  const handleRemoveNode = (node: DockerCommandStep) => {
    const nodeRefLower = node.data.url.toLowerCase();
    setValidation((prev) => ({
      ...prev,
      docker_command_steps: {
        steps: prev.docker_command_steps.steps.filter(
          (step) => step.data.url.toLowerCase() !== nodeRefLower,
        ),
      },
    }));
  };

  const filteredNodes = useMemo(() => {
    if (!data) return [];

    const searchWords = searchTerm
      .toLowerCase()
      .replace(/[^a-z0-9]/g, " ")
      .split(" ")
      .filter(Boolean);

    const lowerCaseBlacklist = new Set(BLACKLIST.map((x) => x.toLowerCase()));

    return data.filter((node) => {
      const nodeText = `${node.title} ${node.author} ${node.reference}`
        .toLowerCase()
        .replace(/[^a-z0-9]/g, " ");

      return (
        searchWords.every((word) => nodeText.includes(word)) &&
        !lowerCaseBlacklist.has(node.reference.toLowerCase())
      );
    });
  }, [data, searchTerm]);

  const rowVirtualizer = useVirtualizer({
    count: filteredNodes.length,
    getScrollElement: () => parentRef,
    estimateSize: () => 50, // Adjust this value based on your row height
    overscan: 30,
  });

  useEffect(() => {
    if (parentRef) {
      rowVirtualizer.measure();
    }
  }, [parentRef, filteredNodes.length]);

  return (
    <div>
      <div className="mb-2">
        <span className="font-medium text-sm">Custom Nodes </span>
      </div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} minSize={40} collapsible>
          <div className="flex w-full flex-col gap-4 rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="font-medium text-md">Custom Node Library</h2>
            <div className="flex flex-row items-center border-gray-300 border-b px-2">
              <Search size={18} className="text-gray-500" />
              <div className="relative flex-1">
                <Input
                  placeholder="Search by author, title, or GitHub url..."
                  value={searchTerm}
                  className="border-none focus-visible:outline-none focus-visible:ring-0"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="-translate-y-1/2 absolute top-1/2 right-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            {isLoading ? (
              <div className="flex max-h-[400px] flex-col gap-1 overflow-y-auto">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="min-h-[50px] w-full animate-pulse rounded-[6px] bg-gray-100"
                  />
                ))}
              </div>
            ) : (
              <div
                ref={setParentRef}
                className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent mx-1 h-[400px] overflow-auto"
              >
                {filteredNodes.length === 0 ? (
                  <div className="flex justify-center text-gray-500 text-sm">
                    No custom nodes found.
                  </div>
                ) : (
                  <div
                    style={{
                      height: `${rowVirtualizer.getTotalSize()}px`,
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    {rowVirtualizer
                      .getVirtualItems()
                      .map((virtualRow, index) => {
                        const node = filteredNodes[virtualRow.index];
                        const nodeRefLower = node.reference.toLowerCase();

                        return (
                          <div
                            key={nodeRefLower}
                            data-index={virtualRow.index}
                            ref={rowVirtualizer.measureElement}
                            className={cn(
                              "flex items-center rounded-[6px] text-sm hover:bg-gray-100",
                              index % 2 === 0 && "bg-gray-50",
                            )}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: `${virtualRow.size}px`,
                              transform: `translateY(${virtualRow.start}px)`,
                            }}
                          >
                            <div
                              className={cn(
                                "w-full px-2",
                                validation.docker_command_steps.steps.some(
                                  (n) =>
                                    n.data.url.toLowerCase() === nodeRefLower,
                                ) && "opacity-30",
                              )}
                            >
                              <div className="flex flex-row items-center justify-between">
                                <div className="flex min-w-0 flex-1 flex-col">
                                  <span className="truncate font-medium">
                                    {node.title}
                                  </span>
                                  <div className="flex items-center">
                                    <span className="text-gray-500 text-xs">
                                      {node.author}
                                    </span>
                                    <Link
                                      to={node.reference}
                                      target="_blank"
                                      className="ml-1 inline-flex items-center text-gray-500 hover:text-gray-700"
                                    >
                                      <ExternalLink size={12} />
                                    </Link>
                                  </div>
                                </div>
                                <div className="flex flex-col">
                                  <Button
                                    variant="ghost"
                                    className="hover:bg-gray-200"
                                    onClick={async () => {
                                      await handleAddNode(
                                        filteredNodes[virtualRow.index],
                                      );
                                    }}
                                    disabled={validation.docker_command_steps.steps.some(
                                      (n) =>
                                        n.data.url.toLowerCase() ===
                                        nodeRefLower,
                                    )}
                                  >
                                    <ChevronRight size={12} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle className="mx-2" withHandle />
        <ResizablePanel defaultSize={50} minSize={40} collapsible>
          <SelectedNodeList
            validation={validation}
            setValidation={setValidation}
            handleRemoveNode={handleRemoveNode}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function SelectedNodeList({
  validation,
  setValidation,
  handleRemoveNode,
}: StepComponentProps<MachineStepValidation> & {
  handleRemoveNode: (node: DockerCommandStep) => void;
}) {
  const [editingHash, setEditingHash] = useState<string | null>(null);
  const [scriptMode, setScriptMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = validation.docker_command_steps.steps.findIndex(
        (step) => step.id === active.id,
      );
      const newIndex = validation.docker_command_steps.steps.findIndex(
        (step) => step.id === over.id,
      );

      setValidation((prev) => {
        const newSteps = [...prev.docker_command_steps.steps];
        const [removed] = newSteps.splice(oldIndex, 1);
        newSteps.splice(newIndex, 0, removed);

        return {
          ...prev,
          docker_command_steps: {
            ...prev.docker_command_steps,
            steps: newSteps,
          },
        };
      });
    }
  };

  const handleStartEdit = (node: DockerCommandStep) => {
    setEditingHash(node.data.url);
  };

  const handleSaveHash = (node: DockerCommandStep, value: string) => {
    // Early return if value is empty or unchanged
    if (value === node.data.hash) {
      setEditingHash(null);
      return;
    }

    setValidation((prev) => ({
      ...prev,
      docker_command_steps: {
        steps: prev.docker_command_steps.steps.map((step) =>
          step.data.url === node.data.url
            ? {
                ...step,
                data: {
                  ...step.data,
                  hash: value || node.data.meta?.latest_hash,
                },
              }
            : step,
        ),
      },
    }));

    setEditingHash(null);
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-row items-center justify-between">
        <h2 className="font-medium text-md">
          Selected Nodes ({validation.docker_command_steps.steps.length})
        </h2>
        <Button
          variant={scriptMode ? "default" : "outline"}
          onClick={() => setScriptMode(!scriptMode)}
        >
          Edit Script
          {scriptMode ? (
            <ToggleRight className="ml-2 h-4 w-4" />
          ) : (
            <ToggleLeft className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>
      {scriptMode ? (
        <Textarea
          placeholder="Enter your script here..."
          value={JSON.stringify(validation.docker_command_steps, null, 4)}
          className="h-[400px]"
          readOnly
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={validation.docker_command_steps.steps.map((node) => node.id)}
            strategy={verticalListSortingStrategy}
          >
            {validation.docker_command_steps.steps.length > 1 && (
              <span className="text-gray-500 text-xs">
                <span className="text-red-500">* </span>Long press and drag to
                reorder the nodes.
              </span>
            )}
            <div className="flex flex-col gap-2">
              {validation.docker_command_steps.steps.length === 0 ? (
                <div className="text-gray-500 text-sm">No nodes selected.</div>
              ) : (
                validation.docker_command_steps.steps.map((node) => (
                  <SortableCustomNodeCard
                    key={node.id}
                    node={node}
                    editingHash={editingHash}
                    handleSaveHash={handleSaveHash}
                    handleStartEdit={handleStartEdit}
                    handleRemoveNode={handleRemoveNode}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function SortableCustomNodeCard(props: {
  node: DockerCommandStep;
  editingHash: string | null;
  handleSaveHash: (node: DockerCommandStep, value: string) => void;
  handleStartEdit: (node: DockerCommandStep) => void;
  handleRemoveNode: (node: DockerCommandStep) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.node.id,
    disabled: props.editingHash === props.node.data.url,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    scale: isDragging ? 1.02 : 1,
    borderRadius: isDragging ? "10px" : "6px",
    boxShadow: isDragging
      ? "rgba(0, 0, 0, 0.15) 0px 10px 20px, rgba(0, 0, 0, 0.1) 0px 3px 6px"
      : "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group cursor-auto active:cursor-grabbing"
    >
      <div onClick={(e) => e.stopPropagation()}>
        <CustomNodeCard {...props} />
      </div>
    </div>
  );
}

function CustomNodeCard({
  node,
  editingHash,
  handleSaveHash,
  handleStartEdit,
  handleRemoveNode,
}: {
  node: DockerCommandStep;
  editingHash: string | null;
  handleSaveHash: (node: DockerCommandStep, value: string) => void;
  handleStartEdit: (node: DockerCommandStep) => void;
  handleRemoveNode: (node: DockerCommandStep) => void;
}) {
  const isHashChanged = node.data.hash !== node.data.meta?.latest_hash;

  return (
    <div
      key={node.data.url}
      className="group flex flex-col rounded-[6px] border border-gray-200 bg-gray-50 p-2 text-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium">{node.data.name}</span>
          <div className="flex items-center">
            <span className="text-gray-500 text-xs">
              {node.data.meta?.committer?.name}
            </span>
            <Link
              to={node.data.url}
              target="_blank"
              className="ml-1 inline-flex items-center text-gray-500 hover:text-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="text-red-500 opacity-0 transition-opacity duration-200 hover:text-red-600 group-hover:opacity-100"
          onClick={() => handleRemoveNode(node)}
        >
          <Minus size={14} />
        </Button>
      </div>

      <Separator className="my-2" />

      {node.data.meta && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex w-full flex-col text-gray-500 text-xs leading-snug">
            <div className="flex w-full items-center gap-2">
              <span className="whitespace-nowrap font-medium">
                {isHashChanged || editingHash === node.data.url
                  ? "Custom hash"
                  : "Latest commit"}
                :
              </span>
              {editingHash === node.data.url ? (
                <Input
                  autoFocus
                  defaultValue={node.data.hash}
                  placeholder="commit hash..."
                  className="h-7 max-w-96 rounded-[6px] px-2 py-0 font-mono text-xs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSaveHash(node, e.currentTarget.value);
                    }
                  }}
                />
              ) : (
                <code className="rounded bg-gray-100 px-1 py-0.5 text-2xs">
                  <span className={cn(isHashChanged && "text-amber-600")}>
                    {node.data.hash?.slice(0, 7)}
                  </span>
                </code>
              )}
              {!isHashChanged && !editingHash && (
                <>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1">
                    <Star
                      size={12}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span>
                      {node.data.meta.stargazers_count?.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
            </div>
            {!isHashChanged && editingHash !== node.data.url ? (
              <div className="line-clamp-1">
                <span className="font-medium">Message:</span>{" "}
                {node.data.meta?.message}
              </div>
            ) : null}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "shrink-0 text-gray-500",
              editingHash !== node.data.url &&
                "opacity-0 transition-opacity duration-200 hover:text-red-600 group-hover:opacity-100",
            )}
            onClick={(e) => {
              if (editingHash === node.data.url) {
                // Find the input element and get its value
                const input =
                  e.currentTarget.parentElement?.querySelector("input");
                if (input) {
                  handleSaveHash(node, input.value);
                }
              } else {
                handleStartEdit(node);
              }
            }}
          >
            {editingHash === node.data.url ? (
              <Save size={12} />
            ) : (
              <Pencil size={12} />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
