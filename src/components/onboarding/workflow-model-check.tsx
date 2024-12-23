import type { StepValidation } from "@/components/onboarding/workflow-import";
import type { StepComponentProps } from "@/components/step-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  type VolFSStructure,
  type VolFile,
  type VolFolder,
  useModels,
} from "@/hooks/use-model";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  TriangleAlert,
} from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";

// -----------------------types------------------------

export type WorkflowNode = {
  id: number;
  type: string;
  pos: [number, number];
  widgets_values: string[];
  inputs: {
    name: string;
  }[];
  outputs: {
    name: string;
  }[];
};

export type WorkflowJson = {
  nodes: WorkflowNode[];
};

export type FileList = {
  category: string;
  filePaths: FilePaths[];
};

export type FilePaths = {
  name: string;
  volumeType: "public" | "private";
};

export type NodeCategory = {
  type: string;
  folder: string | string[];
  noOfNodes?: number;
};

export type NodeCategories = {
  [category: string]: NodeCategory;
};

// -----------------------constants------------------------

// TODO:
// StyleModelLoader
// GLIGENLoader
// DiffusersLoader
// HypernetworkLoader
// PhotoMakerLoader

export const NodeToBeFocus: NodeCategories = {
  Image: {
    type: "LoadImage",
    folder: "input",
  },
  Checkpoint: {
    type: "CheckpointLoaderSimple",
    folder: "checkpoints",
  },
  LoRA: {
    type: "LoraLoader",
    folder: "loras",
  },
  VAE: {
    type: "VAELoader",
    folder: "vae",
  },
  "IP-Adapter": {
    type: "IPAdapterModelLoader",
    folder: "ipadapter",
  },
  "Clip Vision": {
    type: "CLIPVisionLoader",
    folder: "clip_vision",
  },
  "Load Diffusion Model": {
    type: "UNETLoader",
    folder: ["unet", "diffusion_models"],
  },
  Clip: {
    type: "CLIPLoader",
    folder: "clip",
  },
  "Dual Clip": {
    type: "DualCLIPLoader",
    folder: "clip",
    noOfNodes: 2,
  },
  unClip: {
    type: "unCLIPCheckpointLoader",
    folder: "checkpoints",
  },
  ControlNet: {
    type: "ControlNetLoader",
    folder: "controlnet",
  },
  DiffControlNet: {
    type: "DiffControlNetLoader",
    folder: "controlnet",
  },
  "LoRA (Model Only)": {
    type: "LoraLoaderModelOnly",
    folder: "loras",
  },
  ImageOnly: {
    type: "ImageOnlyCheckpointLoader",
    folder: "checkpoints",
  },
  ControlNetAdvanced: {
    type: "ControlNetLoaderAdvanced",
    folder: "controlnet",
  },
  ACN_SparseCtrl: {
    type: "ACN_SparseCtrlLoaderAdvanced",
    folder: "controlnet",
  },
  UpScale: {
    type: "UpscaleModelLoader",
    folder: "upscale_models",
  },
  ADE_LoadAnimateDiff: {
    type: "ADE_LoadAnimateDiffModel",
    folder: "animatediff_models",
  },
  ACN_SparseCtrlMerged: {
    type: "ACN_SparseCtrlMergedLoaderAdvanced",
    folder: "controlnet",
    noOfNodes: 2,
  },
};

// -----------------------components------------------------

export function WorkflowModelCheck({
  validation,
  setValidation,
}: StepComponentProps<StepValidation>) {
  const [workflow, setWorkflow] = useState<string>(
    (validation.importOption === "import"
      ? validation.importJson
      : validation.workflowJson) || "",
  );
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isModelBrowserExpanded, setIsModelBrowserExpanded] = useState(false);

  const nodesToFocus = useMemo(
    () =>
      JSON.parse(workflow)?.nodes?.filter((node: any) =>
        Object.values(NodeToBeFocus).some(
          (focusNode) => focusNode.type === node.type,
        ),
      ),
    [JSON.parse(workflow)?.nodes],
  );

  useEffect(() => {
    if (!selectedNode) return;

    // Parse the workflow JSON to get the nodes
    const parsedWorkflow = JSON.parse(workflow);

    // Find the corresponding node in the workflow
    const nodeIndex = parsedWorkflow.nodes.findIndex(
      (node: any) => node.id === selectedNode.id,
    );

    if (nodeIndex !== -1) {
      const node = parsedWorkflow.nodes[nodeIndex];

      // Find the node type configuration to get noOfNodes
      const nodeType = Object.entries(NodeToBeFocus).find(
        ([_, config]) => config.type === selectedNode.type,
      )?.[0];
      const numInputs = nodeType ? NodeToBeFocus[nodeType].noOfNodes || 1 : 1;

      // Check if any of the widget values are different
      let hasChanges = false;
      for (let i = 0; i < numInputs; i++) {
        if (node.widgets_values[i] !== selectedNode.widgets_values[i]) {
          node.widgets_values[i] = selectedNode.widgets_values[i];
          hasChanges = true;
        }
      }

      // Only update if there were changes
      if (hasChanges) {
        const updatedWorkflowJson = JSON.stringify(parsedWorkflow);

        // Update both workflow and validation at once
        setWorkflow(updatedWorkflowJson);
        if (validation.importOption === "import") {
          setValidation({
            ...validation,
            importJson: updatedWorkflowJson,
          });
        } else if (validation.importOption === "default") {
          setValidation({
            ...validation,
            workflowJson: updatedWorkflowJson,
          });
        }
      }
    }
  }, [selectedNode]);

  return (
    <div className="flex h-full gap-4">
      <div className="flex-1">
        <OptionList
          workflowNodeList={nodesToFocus}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          isModelBrowserExpanded={isModelBrowserExpanded}
        />
      </div>
      <div className="relative hidden md:block">
        {isModelBrowserExpanded && (
          <div className="w-[500px] rounded-xl border bg-white p-4 drop-shadow-lg">
            {/* <div className="flex items-center justify-between font-bold">
              <ModelListHeader />
            </div>
            <div className="mt-2">
              <ModelListView className="h-[calc(70vh)]">
                <ModelList
                  apiEndpoint={
                    process.env.NEXT_PUBLIC_COMFY_DEPLOY_SHARED_MACHINE_API_URL!
                  }
                />
              </ModelListView>
            </div> */}
          </div>
        )}
        <div className="-translate-y-1/2 -left-5 absolute top-[50%] hidden md:block">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="rounded-full shadow-md"
                  onClick={() =>
                    setIsModelBrowserExpanded(!isModelBrowserExpanded)
                  }
                >
                  {isModelBrowserExpanded ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isModelBrowserExpanded ? "Hide" : "Show"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

export function getVolumeFileList(
  publicVolume: VolFSStructure | undefined,
  privateVolume: VolFSStructure | undefined,
  nodes: NodeCategories,
): FileList[] {
  const fileList: FileList[] = [];

  function findNodeFolder(
    volume: VolFSStructure,
    nodes: NodeCategories,
    volumeType: "public" | "private",
  ) {
    for (const [category, node] of Object.entries(nodes)) {
      const folders = Array.isArray(node.folder) ? node.folder : [node.folder];

      for (const folderPath of folders) {
        const folder = volume.contents.find(
          (item) => item.type === "folder" && item.path === folderPath,
        ) as VolFolder | undefined;

        if (folder) {
          getFilePaths(folder.contents, category, volumeType);
        }
      }
    }
  }

  function getFilePaths(
    contents: (VolFolder | VolFile)[],
    category: string,
    volumeType: "public" | "private",
  ) {
    for (const item of contents) {
      if (item.type === "file") {
        const currentFile: FilePaths = {
          name: item.path.split("/").slice(1).join("/"),
          volumeType: volumeType,
        };
        const existingCategory = fileList.find((f) => f.category === category);
        if (existingCategory) {
          // If the category exists, add the file to its filePaths
          existingCategory.filePaths.push(currentFile);
        } else {
          // If the category doesn't exist, create a new entry
          fileList.push({ category, filePaths: [currentFile] });
        }
      } else if (item.type === "folder") {
        getFilePaths(item.contents, category, volumeType); // Recursively process sub-folders
      }
    }
  }

  if (publicVolume) {
    findNodeFolder(publicVolume, nodes, "public");
  }
  if (privateVolume) {
    findNodeFolder(privateVolume, nodes, "private");
  }

  return fileList;
}

export const StatusTooltip = ({
  children,
  content,
  variant,
}: {
  children: React.ReactNode;
  content: string | React.ReactNode;
  variant: "destructive" | "yellow" | "success";
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger className="flex items-center">
        <Badge variant={variant}>{children}</Badge>
      </TooltipTrigger>
      <TooltipContent className="max-w-[300px]">
        <p className="break-words">{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const OptionList = memo(
  ({
    workflowNodeList,
    selectedNode,
    setSelectedNode,
    isModelBrowserExpanded,
  }: {
    workflowNodeList: WorkflowNode[] | undefined;
    selectedNode: WorkflowNode | null;
    setSelectedNode: (node: WorkflowNode | null) => void;
    isModelBrowserExpanded: boolean;
  }) => {
    const { public_volume, private_volume } = useModels();
    const [fileList, setFileList] = useState<FileList[]>([]);

    // Get all node types that exist in the workflow
    const defaultExpandedValues = useMemo(
      () =>
        Object.values(NodeToBeFocus)
          .map((node) => node.type)
          .filter((type) =>
            workflowNodeList?.some((wNode) => wNode.type === type),
          ),
      [workflowNodeList],
    );

    // Replace the single accordionValue with an array of values
    const [accordionValues, setAccordionValues] = useState<string[]>(
      defaultExpandedValues,
    );

    useEffect(() => {
      const files = getVolumeFileList(
        public_volume?.structure,
        private_volume?.structure,
        NodeToBeFocus,
      );
      setFileList(files);
    }, [public_volume, private_volume]);

    const isNodeSuccessful = (nodeValue: string, category: string) => {
      return (
        nodeValue &&
        fileList.some((f) => f.category === category) &&
        fileList.some((f) =>
          f.filePaths.some((filePath) => filePath.name === nodeValue),
        )
      );
    };

    const calculateSuccessRatio = (category: string, type: string) => {
      if (!workflowNodeList) return { success: 0, total: 0 };
      const categoryNodes = workflowNodeList.filter(
        (node) => node.type === type,
      );
      const nodeToFocus = NodeToBeFocus[category];
      const numInputs = nodeToFocus.noOfNodes || 1;
      const totalInputs = categoryNodes.length * numInputs;
      const successfulInputs = categoryNodes.reduce((acc, node) => {
        return (
          acc +
          node.widgets_values
            .slice(0, numInputs)
            .filter((value) => isNodeSuccessful(value, category)).length
        );
      }, 0);
      return { success: successfulInputs, total: totalInputs };
    };

    const HandleNodeStatus = memo(
      ({
        category,
        nodeData,
      }: {
        category: string;
        nodeData: WorkflowNode;
      }) => {
        const nodeToFocus = NodeToBeFocus[category];
        const numInputs = nodeToFocus.noOfNodes || 1;
        const nodeValues = nodeData.widgets_values.slice(0, numInputs);

        return (
          <div className="flex flex-row gap-1 whitespace-nowrap">
            {nodeValues.map((value, index) => (
              <StatusBadge
                key={index}
                value={value}
                category={category}
                folder={nodeToFocus.folder}
              />
            ))}
          </div>
        );
      },
    );

    const StatusBadge = memo(
      ({
        value,
        category,
        folder,
      }: {
        value: string;
        category: string;
        folder: string | string[];
      }) => {
        if (!value) {
          return (
            <StatusTooltip
              content={`Please add a ${category} file for it!`}
              variant="destructive"
            >
              Empty
            </StatusTooltip>
          );
        }

        if (!isNodeSuccessful(value, category)) {
          const folders = Array.isArray(folder) ? folder.join(", ") : folder;
          return (
            <StatusTooltip
              content={
                <div>
                  Fail to find the <b>"{value}"</b> file! Please update / add it
                  back to the <b>{folders}</b> folder.
                </div>
              }
              variant="yellow"
            >
              Not Exist
            </StatusTooltip>
          );
        }

        return (
          <StatusTooltip
            content={
              <div>
                File found! [<b>{value}</b>]
              </div>
            }
            variant="success"
          >
            <Check size={18} />
          </StatusTooltip>
        );
      },
    );

    if (!workflowNodeList || workflowNodeList.length === 0)
      return <div>You are all set!</div>;
    if (public_volume === undefined && private_volume === undefined)
      return (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-[60px] w-full" />
          ))}
        </div>
      );

    return (
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="block text-muted-foreground text-sm leading-normal">
            Model Checking helps you verify if any workflow nodes are missing
            models or inputs. You can modify and update them here.
          </span>
          <Button
            variant={"outline"}
            className="shrink-0"
            onClick={() => {
              if (accordionValues.length > 0) {
                setAccordionValues([]);
              } else {
                setAccordionValues(defaultExpandedValues);
              }
            }}
          >
            {accordionValues.length > 0 ? (
              <div className="flex flex-row items-center gap-2">
                <span>Collapse</span>
                <ChevronsDownUp className="h-4 w-4" />
              </div>
            ) : (
              <div className="flex flex-row items-center gap-2">
                <span>Expand</span>
                <ChevronsUpDown className="h-4 w-4" />
              </div>
            )}
          </Button>
        </div>
        <ScrollArea hideHorizontal>
          <div className="max-h-[70vh]">
            <Accordion
              type="multiple"
              value={accordionValues}
              onValueChange={setAccordionValues}
            >
              {Object.entries(NodeToBeFocus)
                .map(([category, node]) => {
                  const matchingNodes = workflowNodeList?.filter(
                    (wNode) => wNode.type === node.type,
                  );
                  const { success, total } = calculateSuccessRatio(
                    category,
                    node.type,
                  );
                  const successPercentage =
                    total > 0 ? (success / total) * 100 : 0;
                  return {
                    category,
                    node,
                    success,
                    total,
                    successPercentage,
                    matchingNodes,
                  };
                })
                .filter((item) => item.matchingNodes?.length > 0)
                .map(
                  ({
                    category,
                    node,
                    success,
                    total,
                    successPercentage,
                    matchingNodes,
                  }) => (
                    <AccordionItem value={node.type} key={node.type}>
                      <AccordionTrigger className="py-3 text-base">
                        <div
                          className={`flex w-full flex-row items-center justify-between ${
                            successPercentage === 100
                              ? "opacity-60"
                              : "opacity-100"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                              {category}
                            </div>
                            {success < total ? (
                              <Badge variant="destructive">
                                {total - success} missing
                              </Badge>
                            ) : (
                              <Badge variant="success">Complete</Badge>
                            )}
                          </div>
                          <div className="flex flex-row items-center gap-2">
                            <Progress
                              value={successPercentage}
                              className="w-24"
                            />
                            <span className="w-12 text-right text-sm">
                              ({success}/{total})
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm">
                        {matchingNodes
                          .sort((a, b) => a.id - b.id)
                          .map((workflowNode, index) => (
                            <div
                              key={workflowNode.id}
                              className={cn(
                                "mb-0.5 flex flex-col items-center gap-2 rounded-[4px] px-2 py-2",
                                index % 2 === 1 ? "bg-gray-100" : "",
                                isModelBrowserExpanded
                                  ? ""
                                  : "md:flex-row md:justify-between",
                              )}
                            >
                              <div
                                className={cn(
                                  "flex w-full flex-row items-center justify-between gap-2",
                                  isModelBrowserExpanded ? "" : "md:w-1/3",
                                )}
                              >
                                <p className="overflow-hidden truncate whitespace-nowrap">
                                  {`${workflowNode.type} #${workflowNode.id}`}
                                </p>
                                <HandleNodeStatus
                                  category={category}
                                  nodeData={workflowNode}
                                />
                              </div>
                              <div
                                className={cn(
                                  "w-full",
                                  isModelBrowserExpanded ? "" : "md:w-1/2",
                                )}
                              >
                                <ModelSelectComboBox
                                  selectedNode={workflowNode}
                                  setSelectedNode={setSelectedNode}
                                  fileList={fileList}
                                />
                              </div>
                            </div>
                          ))}
                      </AccordionContent>
                    </AccordionItem>
                  ),
                )}
            </Accordion>
          </div>
        </ScrollArea>
      </div>
    );
  },
);

export function ModelSelectComboBox({
  selectedNode,
  setSelectedNode,
  fileList,
}: {
  selectedNode: WorkflowNode;
  setSelectedNode: (node: WorkflowNode) => void;
  fileList: FileList[];
}) {
  const [openStates, setOpenStates] = useState<boolean[]>([]);

  const matchCategoryList = useMemo(() => {
    const nodeType = Object.entries(NodeToBeFocus).find(
      ([_, node]) => node.type === selectedNode.type,
    )?.[0];

    if (!nodeType) return null;

    const categoryFiles = fileList.find((file) => file.category === nodeType);
    if (!categoryFiles) return null;

    const uniqueFiles = categoryFiles.filePaths.reduce((acc, file) => {
      if (!acc.has(file.name)) {
        acc.set(file.name, { name: file.name });
      }
      return acc;
    }, new Map());

    return {
      ...categoryFiles,
      filePaths: Array.from(uniqueFiles.values()),
      noOfNodes: NodeToBeFocus[nodeType].noOfNodes || 1,
    };
  }, [fileList, selectedNode.type]);

  const renderComboBox = (index: number) => {
    const currentValue = selectedNode.widgets_values[index];
    const isValid = matchCategoryList?.filePaths.some(
      (file) => file.name === currentValue,
    );

    return (
      <div key={index} className="mb-2 last:mb-0">
        <Popover
          open={openStates[index]}
          onOpenChange={(open) => {
            const newStates = [...openStates];
            newStates[index] = open;
            setOpenStates(newStates);
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              role="combobox"
              aria-expanded={openStates[index]}
              className={cn(
                "w-full justify-between rounded-full bg-neutral-800 text-gray-300 hover:bg-neutral-800 hover:text-gray-300",
                isValid
                  ? "outline outline-neutral-500"
                  : "outline outline-red-500 outline-offset-2",
              )}
            >
              <div className="flex flex-row items-center font-light">
                <ChevronLeft className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                {`model / file ${
                  matchCategoryList?.noOfNodes &&
                  matchCategoryList.noOfNodes > 1
                    ? `(${index + 1})`
                    : ""
                }`}
              </div>
              <div className="flex flex-row items-center">
                {isValid ? (
                  <Check className="mr-2 h-4 w-4 shrink-0 text-green-500 opacity-50" />
                ) : (
                  <TriangleAlert className="mr-2 h-4 w-4 shrink-0 text-red-500 opacity-50" />
                )}
                <span className="max-w-[200px] truncate">
                  {currentValue || "Select file..."}
                </span>
                <ChevronRight className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search files..." />
              <CommandList>
                <CommandEmpty>No files found.</CommandEmpty>
                <CommandGroup>
                  {matchCategoryList?.filePaths
                    .sort((a, b) => {
                      if (a.name === currentValue) return -1;
                      if (b.name === currentValue) return 1;
                      return 0;
                    })
                    .map((file) => (
                      <CommandItem
                        key={file.name}
                        value={file.name.toLowerCase()}
                        onSelect={(selectedValue: string) => {
                          const originalCasedFile =
                            matchCategoryList.filePaths.find(
                              (f) => f.name.toLowerCase() === selectedValue,
                            )?.name || selectedValue;

                          const newWidgetsValues = [
                            ...selectedNode.widgets_values,
                          ];
                          newWidgetsValues[index] = originalCasedFile;

                          const updatedNode = {
                            ...selectedNode,
                            widgets_values: newWidgetsValues,
                          };
                          setSelectedNode(updatedNode);

                          const newStates = [...openStates];
                          newStates[index] = false;
                          setOpenStates(newStates);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            currentValue === file.name
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {file.name}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-0.5">
      {Array.from({ length: matchCategoryList?.noOfNodes || 1 }, (_, index) =>
        renderComboBox(index),
      )}
    </div>
  );
}

// ---------------deprecated----------------
function NodeDisplay({
  selectedNode,
  setSelectedNode,
  fileList,
}: {
  selectedNode: WorkflowNode;
  setSelectedNode: (node: WorkflowNode) => void;
  fileList: FileList[];
}) {
  return (
    <div className="relative p-4 md:p-10">
      <div
        className="-z-[1] absolute inset-0 min-h-[100px] overflow-hidden border border-neutral-600 bg-[#212121] shadow-lg"
        style={{
          backgroundImage: `
              linear-gradient(to right, #1B1B1B 1px, transparent 1px),
              linear-gradient(to bottom, #1B1B1B 1px, transparent 1px)
            `,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="flex justify-end px-2 py-1">
        <h3 className="rounded-[8px] bg-green-950 px-2 text-white text-xs">
          #{selectedNode.id}
        </h3>
      </div>
      <div className="min-h-[100px] rounded-xl border border-neutral-600 bg-neutral-700 shadow-lg outline outline-gray-400 outline-offset-4">
        {/* Header */}
        <div className="flex items-center gap-3 border-neutral-800 border-b px-4 py-2">
          <div className="h-3 w-3 rounded-full bg-neutral-600" />
          <h3 className="text-gray-300">{selectedNode.type}</h3>
        </div>

        {/* Inputs and Outputs */}
        <div className="flex flex-row justify-between px-4 py-2">
          {/* Inputs */}
          <div className="flex flex-col gap-1">
            {selectedNode.inputs?.map((input, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-400" />
                <span className="text-gray-300 text-sm">{input.name}</span>
              </div>
            ))}
          </div>

          {/* Outputs */}
          <div className="flex flex-col items-end gap-1">
            {selectedNode.outputs?.map((output, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-gray-300 text-sm">{output.name}</span>
                <div className="h-2 w-2 rounded-full bg-pink-400" />
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 pb-4">
          <ModelSelectComboBox
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            fileList={fileList}
          />
        </div>
      </div>
    </div>
  );
}
