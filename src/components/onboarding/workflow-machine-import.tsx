import { InsertModal } from "@/components/auto-form/auto-form-dialog";
import {
  serverlessFormSchema,
  sharedMachineConfig,
} from "@/components/machine/machine-schema";
import { CustomNodeList } from "@/components/machines/custom-node-list";
import {
  type ConflictingNodeInfo,
  analyzeWorkflowJson,
} from "@/components/onboarding/workflow-analyze";
import {
  useImportWorkflowStore,
  type StepValidation,
} from "@/components/onboarding/workflow-import";

// Local type definitions
interface CustomNodeData {
  name: string;
  hash?: string;
  url: string;
  files: string[];
}

interface DockerCommandStep {
  id: string;
  type: "custom-node" | "commands";
  data: CustomNodeData | string;
}
import {
  type SnapshotImportData,
  SnapshotImportZoneLite,
} from "@/components/snapshot-import-zone";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VirtualizedInfiniteList } from "@/components/virtualized-infinite-list";
import { useCurrentPlan } from "@/hooks/use-current-plan";
import {
  getBranchInfo,
  useGithubBranchInfo,
} from "@/hooks/use-github-branch-info";
import { useMachines } from "@/hooks/use-machine";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useLatestHashes } from "@/utils/comfydeploy-hash";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  Loader2,
  Lock,
  Package,
  Pencil,
  Plus,
  Search,
  Server,
  Settings,
  Settings2,
  Star,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { MachineSettingsWrapper } from "../machine/machine-settings";

// Add this type
export type ComfyUIOption = {
  id: "recommended" | "latest" | "custom";
  name: string;
  hash: string | null;
};

export type GpuTypes =
  | "CPU"
  | "T4"
  | "A10G"
  | "L40S"
  | "L4"
  | "A100"
  | "A100-80GB"
  | "H100";

// Helper type for node metadata
type NodeMeta = {
  message: string;
  committer: {
    date: string;
    name: string;
    email: string;
  };
  commit_url: string;
  latest_hash: string;
  stargazers_count: number;
};

// Helper type for node data
export type NodeData = {
  name: string;
  hash?: string;
  url: string;
  pip?: string[];
  meta?: NodeMeta;
};

// Helper function to get unique URLs map
function mergeCustomNodes(
  customNodes: Record<string, any> = {},
  selectedConflictingNodes: Record<string, any[]> = {},
): Map<string, NodeData> {
  const uniqueUrls = new Map<string, NodeData>();

  // Add custom nodes first
  for (const [url, node] of Object.entries(customNodes)) {
    const lowerUrl = url.toLowerCase();
    uniqueUrls.set(lowerUrl, {
      name: node.name,
      hash: node.hash || undefined,
      url: url,
      pip: node.pip || undefined,
      meta: node.meta || undefined,
    });
  }

  // Add selected conflicting nodes, only if URL isn't already present
  for (const nodes of Object.values(selectedConflictingNodes)) {
    for (const node of nodes) {
      const lowerUrl = node.url.toLowerCase();
      if (!uniqueUrls.has(lowerUrl)) {
        uniqueUrls.set(lowerUrl, {
          name: node.name,
          hash: node.hash || undefined,
          url: node.url,
          pip: node.pip || undefined,
          meta: node.meta || undefined,
        });
      }
    }
  }

  return uniqueUrls;
}



export function WorkflowImportSelectedMachine() {
  const validation = useImportWorkflowStore();
  const setValidation = validation.setValidation;

  const sub = useCurrentPlan();
  const MACHINE_LIMIT_REACHED = sub?.features.machineLimited;

  // Clear machine config when switching between new/existing machine
  const prevMachineOption = React.useRef(validation.machineOption);
  const prevSelectedMachineId = React.useRef(validation.selectedMachineId);

  useEffect(() => {
    // Only clear if actually switching between options or changing selected machine
    if (
      prevMachineOption.current !== validation.machineOption ||
      (validation.machineOption === "existing" && prevSelectedMachineId.current !== validation.selectedMachineId)
    ) {
      setValidation({
        machineConfig: undefined,
        existingMachine: undefined,
        existingMachineMissingNodes: [],
      });
    }

    prevMachineOption.current = validation.machineOption;
    prevSelectedMachineId.current = validation.selectedMachineId;
  }, [validation.machineOption, validation.selectedMachineId]);

  // Render different UI based on environment status
  const hasEnvironment = validation.hasEnvironment;
  const skipCustomNodeCheck = validation.hasEnvironment;


  const json =
    validation.importOption === "default"
      ? validation.workflowJson
      : validation.importJson;

  const { data: dependencies, error: dependenciesError, isLoading: dependenciesLoading } = useQuery({
    queryKey: ["analyzeWorkflowJson", json],
    queryFn: () => (json ? analyzeWorkflowJson(json) : null),
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    enabled: !!json && !skipCustomNodeCheck,
  });

  // Initialize dependencies for validation purposes only
  useEffect(() => {
    if (dependencies && !validation.dependencies && !skipCustomNodeCheck) {
      // Auto-select the most popular implementation for each conflicting node
      const autoSelectedConflictingNodes: Record<string, any[]> = {};

      if (dependencies.conflicting_nodes) {
        for (const [nodeName, conflicts] of Object.entries(dependencies.conflicting_nodes)) {
          if (conflicts.length > 0) {
            // Sort by star count (descending) to get most popular
            const sortedConflicts = [...conflicts].sort(
              (a, b) => (b.meta?.stargazers_count || 0) - (a.meta?.stargazers_count || 0)
            );
            autoSelectedConflictingNodes[nodeName] = [sortedConflicts[0]];
          }
        }
      }

      // Get all custom nodes and auto-select them all by default
      const allCustomNodeUrls = Object.keys(dependencies.custom_nodes || {});
      const initialSelectedNodes = new Set(allCustomNodeUrls);

      // Initialize state - docker steps will be built by the central useEffect below
      setValidation({
        ...validation,
        dependencies: dependencies,
        selectedConflictingNodes: autoSelectedConflictingNodes,
        selectedCustomNodesToApply: initialSelectedNodes,
      });
    }
  }, [dependencies, validation.dependencies, skipCustomNodeCheck]);

  // 🎯 SINGLE SOURCE OF TRUTH: Central docker steps rebuilding
  useEffect(() => {


    if (!validation.dependencies?.custom_nodes) return;

    const newDockerSteps = buildDockerStepsFromNodes(
      validation.dependencies.custom_nodes,
      validation.selectedConflictingNodes || {},
      validation.selectedCustomNodesToApply
    );

    // Only update if there's actually a change to prevent loops
    const currentStepsJson = JSON.stringify(validation.docker_command_steps?.steps || []);
    const newStepsJson = JSON.stringify(newDockerSteps.steps);



    if (currentStepsJson !== newStepsJson) {

      setValidation(
        { docker_command_steps: newDockerSteps, }
      );
    }
  }, [
    validation.dependencies?.custom_nodes,
    validation.selectedCustomNodesToApply,
    validation.selectedConflictingNodes,
  ]);

  if (!validation.workflowJson) {
    return null;
  }

  return hasEnvironment ? (
    <div className="mt-4 flex items-center gap-2 text-green-600 text-xs">
      <CheckCircle className="h-3 w-3" />
      Environment configured
    </div>
  ) : (
    <div className="space-y-4">
      {/* Machine Selection Toggle */}
      <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-lg w-fit">
        <Button
          variant={validation.machineOption === "new" ? "default" : "ghost"}
          size="sm"
          onClick={() => setValidation({
            machineOption: "new",
            selectedMachineId: "",
          })}
          className="h-8"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Machine
        </Button>
        <Button
          variant={validation.machineOption === "existing" ? "default" : "ghost"}
          size="sm"
          onClick={() => setValidation({
            machineOption: "existing",
            selectedMachineId: "",
          })}
          className="h-8"
        >
          <Server className="h-4 w-4 mr-1" />
          Use Existing
        </Button>
      </div>

      {/* New Machine Content */}
      {validation.machineOption === "new" && !MACHINE_LIMIT_REACHED && (
        <div className="space-y-6">
          {/* Custom Nodes Section */}
          <DetectedCustomNodesSection
            validation={validation}
            setValidation={setValidation}
          />
        </div>
      )}

      {/* Machine Limit Warning */}
      {validation.machineOption === "new" && MACHINE_LIMIT_REACHED && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 flex items-center gap-2">
          <Lock className="h-4 w-4 text-yellow-600" />
          <span className="text-sm text-yellow-800">
            Machine limit reached. <Link href="/settings/billing" className="underline">Upgrade</Link> to create more.
          </span>
        </div>
      )}

      {/* Existing Machine Content */}
      {validation.machineOption === "existing" && (
        <div className="space-y-3">
          <ExistingMachineSelector
            validation={validation}
            setValidation={setValidation}
          />

          {/* Simple info note */}
          {validation.selectedMachineId && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="h-3 w-3" />
              Workflow custom nodes won't be added to existing machines
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ExistingMachineDialog({
  validation,
  setValidation,
  open,
  onOpenChange,
}: {
  validation: StepValidation;
  setValidation: (validation: Partial<StepValidation>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchValue] = useDebounce(searchTerm, 250);
  const query = useMachines(
    debouncedSearchValue,
    20,
    undefined,
    undefined,
    false,
    false,
    false,
    true,
  );

  useEffect(() => {
    query.refetch();
  }, [debouncedSearchValue]);

  // Helper function to compare nodes
  const compareNodes = (
    machineDockerSteps: any,
    validation: StepValidation,
  ) => {
    const matchingNodes: NodeData[] = [];
    const missingNodes: NodeData[] = [];
    const machineNodeUrls = machineDockerSteps?.steps?.map((node: any) =>
      node?.data?.url?.toLowerCase(),
    );

    const uniqueUrls = mergeCustomNodes(
      validation.dependencies?.custom_nodes,
      validation.selectedConflictingNodes,
    );

    for (const [url, nodeData] of uniqueUrls) {
      const isMatched = machineNodeUrls?.some(
        (mnUrl: string) => mnUrl === url.toLowerCase(),
      );
      if (isMatched) {
        matchingNodes.push(nodeData);
      } else {
        missingNodes.push(nodeData);
      }
    }

    return {
      matchingCount: matchingNodes.length,
      totalRequired: uniqueUrls.size,
      missingNodes,
    };
  };

  const handleMachineSelect = (
    machineId: string,
    checked: boolean,
    missingNodes: NodeData[]
  ) => {
    setValidation({
      ...validation,
      selectedMachineId: checked ? machineId : "",
      existingMachineMissingNodes: missingNodes,
    });

    if (checked) {
      // Close dialog when a machine is selected
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Select Existing Machine</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search machines..."
                className="focus-visible:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {query.isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, index) => (
                  <div
                    className={cn(
                      "flex items-center space-x-4 border-gray-200 border-r border-b border-l p-2.5",
                      index === 4 && "rounded-b-[8px]",
                      index === 0 && "rounded-t-[8px] border-t",
                    )}
                    key={index}
                  >
                    <Checkbox className="rounded-[4px] border-gray-500" disabled />
                    <Skeleton className="h-6 w-[200px]" />
                  </div>
                ))}
              </div>
            ) : (
              <VirtualizedInfiniteList
                queryResult={query}
                renderItem={(item, index) => {
                  const isSelected = validation.selectedMachineId === item.id;
                  const nodeComparison = compareNodes(
                    (item as any).docker_command_steps,
                    validation,
                  );

                  return (
                    <div
                      className={cn(
                        "flex h-[72px] flex-col items-center justify-center border-gray-200 border-r border-b border-l p-2.5",
                        index === 0 && "rounded-t-[8px] border-t",
                      )}
                    >
                      <div className="group flex w-full items-center gap-3">
                        <Checkbox
                          id={item.id}
                          className="data-[state=checked]:!bg-primary rounded-[4px] border-gray-500 group-hover:bg-gray-100"
                          checked={isSelected}
                          onCheckedChange={(checked: boolean) => {
                            handleMachineSelect(
                              item.id,
                              checked,
                              nodeComparison.missingNodes
                            );
                          }}
                        />
                        <label
                          htmlFor={item.id}
                          className="flex min-w-0 flex-1 items-center gap-4"
                        >
                          <span className="flex-1 truncate whitespace-nowrap">
                            {item.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px]">
                              {item.gpu}
                            </Badge>
                            <Badge
                              variant={
                                nodeComparison.missingNodes.length === 0
                                  ? "success"
                                  : "secondary"
                              }
                              className="text-[10px]"
                            >
                              {nodeComparison.matchingCount}/{nodeComparison.totalRequired} nodes
                            </Badge>
                          </div>
                        </label>

                        {nodeComparison.missingNodes.length > 0 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="text-yellow-500">
                                  <Settings2 className="h-4 w-4" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-medium">Missing Custom Nodes:</p>
                                <ul className="text-xs">
                                  {nodeComparison.missingNodes.map((node, i) => (
                                    <li
                                      key={node.url}
                                      className="text-muted-foreground"
                                    >
                                      • {node.url.split("/").pop()}
                                    </li>
                                  ))}
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                        <Link
                          href={`/machines/${item.id}`}
                          target="_blank"
                          className="shrink-0 text-muted-foreground transition-colors hover:text-gray-600"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>

                      <CustomNodeList machine={item} />
                    </div>
                  );
                }}
                estimateSize={72}
                renderLoading={() => {
                  return (
                    <>
                      {[...Array(4)].map((_, index) => (
                        <div
                          className={cn(
                            "flex items-center space-x-4 border-gray-200 border-r border-b border-l p-2.5",
                            index === 3 && "rounded-b-[8px]",
                          )}
                          key={index}
                        >
                          <Checkbox className="rounded-[4px] border-gray-500" disabled />
                          <Skeleton className="h-6 w-[200px]" />
                        </div>
                      ))}
                    </>
                  );
                }}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetectedCustomNodesSection({
  validation,
  setValidation,
  existingMachineSteps = [],
}: {
  validation: StepValidation;
  setValidation: (validation: Partial<StepValidation>) => void;
  existingMachineSteps?: DockerCommandStep[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showAdvancedView, setShowAdvancedView] = useState(false);
  const { data: latestHashes } = useLatestHashes();

  // Auto-generate machine name and set default GPU if not set
  useEffect(() => {
    const updates: Partial<StepValidation> = {};
    if (!validation.machineName && validation.workflowName) {
      updates.machineName = `${validation.workflowName}'s Machine`;
    }
    if (!validation.gpuType) {
      updates.gpuType = 'T4';
    }
    if (Object.keys(updates).length > 0) {
      setValidation(updates);
    }
  }, [validation.workflowName, validation.machineName, validation.gpuType]);

  // All validation checks at the beginning to avoid hook inconsistencies
  const customNodes = validation.dependencies?.custom_nodes;
  const conflictingNodes = validation.dependencies?.conflicting_nodes || {};
  const selectedConflictingNodes = validation.selectedConflictingNodes || {};

  if (!customNodes && Object.keys(conflictingNodes).length === 0) {
    return (
      <div className="space-y-3 pt-3 border-t">
        <div className="text-muted-foreground text-sm">
          {!validation.dependencies
            ? "⏳ Analyzing workflow for custom nodes..."
            : "No custom nodes detected in this workflow."}
        </div>
      </div>
    );
  }

  // Build a map of which URLs provide which conflicting nodes
  const urlToConflictingNodes = new Map<string, Set<string>>();
  Object.entries(conflictingNodes).forEach(([nodeName, implementations]) => {
    (implementations as any[]).forEach((impl: any) => {
      const url = impl.url.toLowerCase();
      if (!urlToConflictingNodes.has(url)) {
        urlToConflictingNodes.set(url, new Set());
      }
      urlToConflictingNodes.get(url)!.add(nodeName);
    });
  });

  // Get nodes that don't have conflicts
  const nonConflictingCustomNodes = Object.entries(customNodes || {}).filter(([url]) => {
    return !urlToConflictingNodes.has(url.toLowerCase());
  });

  // Get unique URLs from conflicting nodes
  const conflictingNodeUrls = new Set<string>();
  Object.values(selectedConflictingNodes).forEach((nodes) => {
    (nodes as any[]).forEach(node => conflictingNodeUrls.add(node.url));
  });



  if (nonConflictingCustomNodes.length === 0 && conflictingNodeUrls.size === 0) {
    return null;
  }

  // Check for duplicates against existing machine steps
  const checkIsDuplicate = (url: string) => {
    return existingMachineSteps.some((step: any) =>
      step.type === "custom-node" &&
      (step.data as CustomNodeData)?.url?.toLowerCase() === url.toLowerCase()
    );
  };

  // Initialize selected custom nodes
  const selectedCustomNodes = validation.selectedCustomNodesToApply || new Set(
    nonConflictingCustomNodes.map(([url]) => url)
  );

  const handleNodeToggle = (url: string, checked: boolean) => {
    const newSelected = new Set(selectedCustomNodes);
    if (checked) {
      newSelected.add(url);
    } else {
      newSelected.delete(url);
    }
    setValidation({
      ...validation,
      selectedCustomNodesToApply: newSelected,
    });
  };

  const handleConflictingNodeChange = (nodeName: string, selectedImpl: any | null) => {
    const newSelectedConflicting = { ...selectedConflictingNodes };
    if (selectedImpl) {
      newSelectedConflicting[nodeName] = [selectedImpl];
    } else {
      delete newSelectedConflicting[nodeName];
    }
    setValidation({
      ...validation,
      selectedConflictingNodes: newSelectedConflicting,
    });
  };

  // Count total selected
  const totalSelected = selectedCustomNodes.size + Object.keys(selectedConflictingNodes).length;
  const totalNodes = nonConflictingCustomNodes.length + Object.keys(conflictingNodes).length;

  // Get preview items for compact view
  const previewNodes = [...nonConflictingCustomNodes.slice(0, 3)];
  const remainingCount = Math.max(0, totalNodes - 3);

  // Check if machine is configured
  const isConfigured = validation.machineName && validation.gpuType;

  return (
    <>
      {isConfigured ? (
        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="font-medium text-sm">{validation.machineName || "New Machine"}</span>
            <Badge variant="secondary" className="text-[10px]">
              {validation.gpuType || "T4"}
            </Badge>
            {totalNodes > 0 && (
              <Badge variant={totalSelected === totalNodes ? "success" : "secondary"} className="text-[10px]">
                {totalSelected}/{totalNodes} nodes
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="h-7 text-xs"
          >
            Change
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => setDialogOpen(true)}
          className="w-full justify-start"
        >
          <Settings className="h-4 w-4 mr-2" />
          Configure Machine
        </Button>
      )}

      {/* Detailed Configuration Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle>Configure Machine</DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={showAdvancedView ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowAdvancedView(!showAdvancedView)}
                  className="text-xs"
                >
                  {showAdvancedView ? "Simplified View" : "Advanced View"}
                </Button>
                <DialogClose />
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {!showAdvancedView ? (
              // Simplified View - Custom Nodes Configuration
              <div className="space-y-4">
                {/* GPU Selection */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    GPU Type
                  </label>
                  <Select
                    value={validation.gpuType || 'T4'}
                    onValueChange={(value) => setValidation({ gpuType: value as GpuTypes })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select GPU type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CPU">CPU</SelectItem>
                      <SelectItem value="T4">T4</SelectItem>
                      <SelectItem value="A10G">A10G</SelectItem>
                      <SelectItem value="L40S">L40S</SelectItem>
                      <SelectItem value="L4">L4</SelectItem>
                      <SelectItem value="A100">A100</SelectItem>
                      <SelectItem value="A100-80GB">A100-80GB</SelectItem>
                      <SelectItem value="H100">H100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Nodes Section */}
                {totalNodes > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">
                        Custom Nodes
                      </label>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {totalSelected}/{totalNodes} selected
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {/* Non-conflicting nodes */}
                      {nonConflictingCustomNodes.map(([url, nodeData]: [string, any]) => {
                        const isDuplicate = checkIsDuplicate(url);
                        const isSelected = selectedCustomNodes.has(url);
                        const author = url.split("/")[3];

                        return (
                          <div
                            key={url}
                            className={cn(
                              "flex items-center space-x-2 rounded border p-2",
                              isDuplicate && "bg-gray-50 border-gray-200"
                            )}
                          >
                            <Checkbox
                              id={`node-${url}`}
                              className="data-[state=checked]:!bg-primary rounded-[4px] border-gray-500 shrink-0"
                              checked={isSelected}
                              disabled={isDuplicate}
                              onCheckedChange={(checked: boolean) => handleNodeToggle(url, checked)}
                            />

                            <div className="flex-1 min-w-0 flex items-center gap-2">
                              <span className={cn(
                                "font-medium text-sm truncate",
                                isDuplicate && "text-gray-500"
                              )}>
                                {nodeData.name}
                              </span>
                              <Badge variant="secondary" className="text-[10px] px-1 py-0 shrink-0">
                                {author}
                              </Badge>
                              {nodeData.meta?.stargazers_count && (
                                <Badge variant="outline" className="text-[10px] px-1 py-0 shrink-0">
                                  <Star className="h-2 w-2 mr-0.5 fill-current" />
                                  {nodeData.meta.stargazers_count}
                                </Badge>
                              )}
                              <div className="ml-auto shrink-0">
                                {isDuplicate ? (
                                  <Badge variant="secondary" className="text-[10px] px-1 py-0">
                                    Installed
                                  </Badge>
                                ) : isSelected ? (
                                  <Badge variant="success" className="text-[10px] px-1 py-0">
                                    Will add
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                                    Skipped
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Conflicting nodes */}
                      {Object.entries(conflictingNodes).map(([nodeName, implementations]: [string, any]) => {
                        const selectedImpl = selectedConflictingNodes[nodeName]?.[0];
                        const hasSelection = !!selectedImpl;

                        return (
                          <div key={nodeName} className="space-y-1">
                            <div className="flex items-center gap-2 px-2 py-1">
                              <span className="text-sm font-medium text-yellow-600">{nodeName}</span>
                              <Badge variant="yellow" className="text-[10px] px-1 py-0">
                                {implementations.length} options
                              </Badge>
                            </div>
                            <div className="ml-4 space-y-1">
                              {implementations.map((impl: any) => {
                                const isSelected = selectedImpl?.url === impl.url;
                                const author = impl.url.split("/")[3];
                                const isDuplicate = checkIsDuplicate(impl.url);

                                return (
                                  <div
                                    key={impl.url}
                                    className={cn(
                                      "flex items-center space-x-2 rounded border p-2",
                                      isDuplicate && "bg-gray-50 border-gray-200",
                                      isSelected && "border-primary bg-primary/5"
                                    )}
                                  >
                                    <Checkbox
                                      id={`${nodeName}-${impl.url}`}
                                      className="data-[state=checked]:!bg-primary rounded-[4px] border-gray-500 shrink-0"
                                      checked={isSelected}
                                      disabled={isDuplicate}
                                      onCheckedChange={(checked: boolean) =>
                                        handleConflictingNodeChange(nodeName, checked ? impl : null)
                                      }
                                    />
                                    <label
                                      htmlFor={`${nodeName}-${impl.url}`}
                                      className="flex-1 min-w-0 flex items-center gap-2 cursor-pointer"
                                    >
                                      <span className={cn(
                                        "font-medium text-sm truncate",
                                        isDuplicate && "text-gray-500"
                                      )}>
                                        {impl.name}
                                      </span>
                                      <Badge variant="secondary" className="text-[10px] px-1 py-0 shrink-0">
                                        {author}
                                      </Badge>
                                      {impl.meta?.stargazers_count && (
                                        <Badge variant="outline" className="text-[10px] px-1 py-0 shrink-0">
                                          <Star className="h-2 w-2 mr-0.5 fill-current" />
                                          {impl.meta.stargazers_count}
                                        </Badge>
                                      )}
                                    </label>
                                    <Link
                                      href={impl.url}
                                      target="_blank"
                                      className="shrink-0 text-muted-foreground hover:text-gray-600 transition-colors"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </Link>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Advanced View - Full Machine Settings
              <div className="space-y-6">
                <div className="rounded-md border border-muted bg-muted/20 p-2 flex items-center gap-2 mb-4">
                  <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Configure GPU, ComfyUI version, and advanced settings</span>
                </div>

                <MachineSettingsWrapper
                  onValueChange={(key, value) => {
                    const updates: Partial<StepValidation> = {};
                    if (key === "comfyui_version") {
                      updates.comfyUiHash = value;
                    } else if (key === "gpu") {
                      updates.gpuType = value;
                    } else if (key === "docker_command_steps") {
                      updates.docker_command_steps = value;
                    } else if (key === "install_custom_node_with_gpu") {
                      updates.install_custom_node_with_gpu = value;
                    } else if (key === "base_docker_image") {
                      updates.base_docker_image = value;
                    } else if (key === "python_version") {
                      updates.python_version = value;
                    }
                    setValidation(updates);
                  }}
                  machine={{
                    id: "new",
                    type: "comfy-deploy-serverless",
                    comfyui_version: validation.comfyUiHash || latestHashes?.comfyui_hash || "158419f3a0017c2ce123484b14b6c527716d6ec8",
                    name: validation.machineName || `${validation.workflowName}'s Machine`,
                    gpu: validation.gpuType || "T4",
                    docker_command_steps: validation.docker_command_steps,
                    install_custom_node_with_gpu: validation.install_custom_node_with_gpu,
                    base_docker_image: validation.base_docker_image,
                    python_version: validation.python_version || "3.11",
                  }}
                  disableUnsavedChangesWarningServerless={true}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Clean function to merge all nodes without duplicates
export function buildDockerStepsFromNodes(
  customNodes: Record<string, any> = {},
  conflictingNodes: Record<string, any[]> = {},
  selectedCustomNodesToApply?: Set<string>
): { steps: any[] } {
  const uniqueNodes = new Map<string, any>();

  // Add custom nodes (detected from workflow)
  // If selectedCustomNodesToApply is not set, include all detected nodes by default
  // If it is set, only include explicitly selected ones
  if (customNodes) {
    Object.entries(customNodes).forEach(([url, nodeData]) => {
      const shouldInclude = selectedCustomNodesToApply === undefined || selectedCustomNodesToApply.has(url);
      if (shouldInclude) {
        const lowerUrl = url.toLowerCase();
        if (!uniqueNodes.has(lowerUrl)) {
          uniqueNodes.set(lowerUrl, {
            name: nodeData.name,
            hash: nodeData.hash,
            url: url,
            files: [url],
            install_type: "git-clone",
            pip: nodeData.pip,
            meta: nodeData.meta,
          });
        }
      }
    });
  }

  // Add selected conflicting nodes (these override custom nodes if same URL)
  Object.values(conflictingNodes).forEach(nodes => {
    nodes.forEach(node => {
      const lowerUrl = node.url.toLowerCase();
      uniqueNodes.set(lowerUrl, {
        name: node.name,
        hash: node.hash,
        url: node.url,
        files: [node.url],
        install_type: "git-clone",
        pip: node.pip,
        meta: node.meta,
      });
    });
  });

  const finalSteps = Array.from(uniqueNodes.values()).map(node => ({
    id: crypto.randomUUID().slice(0, 10),
    type: "custom-node" as const,
    data: node,
  }));



  return { steps: finalSteps };
}

/* DEPRECATED: Conflicts are now handled in DetectedCustomNodesSection
function CustomNodeConflictResolution({
  validation,
  setValidation,
}: {
  validation: StepValidation;
  setValidation: (validation: Partial<StepValidation>) => void;
}) {
  if (
    !validation.dependencies?.conflicting_nodes ||
    Object.keys(validation.dependencies?.conflicting_nodes).length === 0
  ) {
    return null;
  }



  const duplicateNode = findFirstDuplicateNode(
    validation.dependencies?.custom_nodes,
    validation.selectedConflictingNodes,
  );

  const isUrlDuplicate = (url: string) => {
    if (!duplicateNode) return false;
    return (
      url.toLowerCase() === duplicateNode.url.toLowerCase() ||
      url.toLowerCase() === duplicateNode.conflictWith.url.toLowerCase()
    );
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <h3 className="bold font-medium text-md">
            Conflicting Nodes
          </h3>
          <span className="text-sm text-yellow-600">
            (
            {
              Object.keys(
                validation.dependencies?.conflicting_nodes || {},
              ).length
            }
            )
          </span>
        </div>
        <span className="block text-muted-foreground text-sm leading-normal">
          Multiple repos found with the same node name. Select your preferred implementation.
        </span>
      </div>

      <div className="space-y-4">
        {Object.entries(
          validation.dependencies?.conflicting_nodes || {},
        ).map(([nodeName, conflicts]) => (
          <div key={nodeName} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{nodeName}</span>
              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
                {conflicts.length} option{conflicts.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-1">
              {conflicts.map((conflict, index) => {
                const author = conflict.url.split("/")[3];
                return (
                  <NodeListItem
                    key={conflict.url}
                    name={conflict.name}
                    author={author}
                    url={conflict.url}
                    starCount={conflict.meta?.stargazers_count}
                    hasHash={!!conflict.hash}
                    isUrlDuplicate={isUrlDuplicate(conflict.url)}
                    checkbox={
                      <Checkbox
                        id={`${nodeName}-${index}`}
                        className="data-[state=checked]:!bg-primary rounded-[4px] border-gray-500 group-hover:bg-gray-100"
                        checked={validation.selectedConflictingNodes?.[
                          nodeName
                        ]?.some((node) => node.url === conflict.url)}
                        onCheckedChange={(checked: boolean) => {
                          setValidation((prev) => {
                            const newSelectedNodes = {
                              ...prev.selectedConflictingNodes,
                            };
                            // Find all node names that have this same URL
                            for (const [
                              currentNodeName,
                              conflicts,
                            ] of Object.entries(
                              validation.dependencies
                                ?.conflicting_nodes || {},
                            )) {
                              const matchingConflict = conflicts.find(
                                (c) =>
                                  c.url.toLowerCase() ===
                                  conflict.url.toLowerCase(),
                              );

                              if (matchingConflict) {
                                if (checked) {
                                  // Add this implementation to all relevant nodes
                                  newSelectedNodes[currentNodeName] = [
                                    ...(newSelectedNodes[
                                      currentNodeName
                                    ] || []),
                                    matchingConflict,
                                  ];
                                } else {
                                  // Remove this implementation from all relevant nodes
                                  newSelectedNodes[currentNodeName] = (
                                    newSelectedNodes[currentNodeName] ||
                                    []
                                  ).filter(
                                    (node) =>
                                      node.url.toLowerCase() !==
                                      conflict.url.toLowerCase(),
                                  );
                                }
                              }
                            }

                            return {
                              ...prev,
                              selectedConflictingNodes: newSelectedNodes,
                            };
                          });
                        }}
                      />
                    }
                  />
                );
              })}
            </div>

            {conflicts.length === 0 && (
              <div className="text-muted-foreground text-xs">
                Node type "{nodeName}" is missing but no known
                implementations found.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
*/

function ExistingMachineSelector({
  validation,
  setValidation,
}: {
  validation: StepValidation;
  setValidation: (validation: Partial<StepValidation>) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: machines } = useMachines("", 1, undefined, undefined, false, false, false, true);

  // Find selected machine details
  const selectedMachine = machines?.pages?.[0]?.find((m: any) => m.id === validation.selectedMachineId);

  // Auto-open dialog when switching to existing machine mode
  useEffect(() => {
    if (validation.machineOption === "existing" && !validation.selectedMachineId) {
      setDialogOpen(true);
    }
  }, [validation.machineOption]);

  return (
    <>
      {validation.selectedMachineId && selectedMachine ? (
        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="font-medium text-sm">{selectedMachine.name}</span>
            <Badge variant="secondary" className="text-[10px]">
              {selectedMachine.gpu}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="h-7 text-xs"
          >
            Change
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => setDialogOpen(true)}
          className="w-full justify-start"
        >
          <Search className="h-4 w-4 mr-2" />
          Select Machine
        </Button>
      )}

      <ExistingMachineDialog
        validation={validation}
        setValidation={setValidation}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}



// Add this helper function to merge docker command steps without duplicates
function mergeDockerCommandSteps(
  existingSteps: DockerCommandStep[],
  newSteps: DockerCommandStep[],
): DockerCommandStep[] {
  if (!existingSteps) return newSteps || [];
  if (!newSteps || newSteps.length === 0) return existingSteps || [];

  // Create a map of existing URLs in lowercase for case-insensitive comparison
  const existingUrls = new Map<string, boolean>();

  for (const step of existingSteps) {
    if (step.type === "custom-node" && (step.data as CustomNodeData)?.url) {
      existingUrls.set((step.data as CustomNodeData).url.toLowerCase(), true);
    }
  }

  // Filter out new steps that have URLs already in existing steps
  const uniqueNewSteps = newSteps.filter((step) => {
    if (step.type !== "custom-node" || !(step.data as CustomNodeData)?.url)
      return true;
    return !existingUrls.has((step.data as CustomNodeData).url.toLowerCase());
  });

  return [...existingSteps, ...uniqueNewSteps];
}

export function WorkflowImportCustomNodeSetup() {
  const validation = useImportWorkflowStore();
  const setValidation = validation.setValidation;

  const skipCustomNodeCheck = validation.hasEnvironment;


  const json =
    validation.importOption === "default"
      ? validation.workflowJson
      : validation.importJson;

  const { data: dependencies, error: dependenciesError, isLoading: dependenciesLoading } = useQuery({
    queryKey: ["analyzeWorkflowJson", json],
    queryFn: () => (json ? analyzeWorkflowJson(json) : null),
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    enabled: !!json && !skipCustomNodeCheck,
  });

  // Initialize dependencies for validation purposes only
  useEffect(() => {
    if (dependencies && !validation.dependencies && !skipCustomNodeCheck) {
      // Auto-select the most popular implementation for each conflicting node
      const autoSelectedConflictingNodes: Record<string, any[]> = {};

      if (dependencies.conflicting_nodes) {
        for (const [nodeName, conflicts] of Object.entries(dependencies.conflicting_nodes)) {
          if (conflicts.length > 0) {
            // Sort by star count (descending) to get most popular
            const sortedConflicts = [...conflicts].sort(
              (a, b) => (b.meta?.stargazers_count || 0) - (a.meta?.stargazers_count || 0)
            );
            autoSelectedConflictingNodes[nodeName] = [sortedConflicts[0]];
          }
        }
      }

      // Get all custom nodes and auto-select them all by default
      const allCustomNodeUrls = Object.keys(dependencies.custom_nodes || {});
      const initialSelectedNodes = new Set(allCustomNodeUrls);

      // Initialize state - docker steps will be built by the central useEffect below
      setValidation({
        ...validation,
        dependencies: dependencies,
        selectedConflictingNodes: autoSelectedConflictingNodes,
        selectedCustomNodesToApply: initialSelectedNodes,
      });
    }
  }, [dependencies, validation.dependencies, skipCustomNodeCheck]);

  // 🎯 SINGLE SOURCE OF TRUTH: Central docker steps rebuilding
  useEffect(() => {


    if (!validation.dependencies?.custom_nodes) return;

    const newDockerSteps = buildDockerStepsFromNodes(
      validation.dependencies.custom_nodes,
      validation.selectedConflictingNodes || {},
      validation.selectedCustomNodesToApply
    );

    // Only update if there's actually a change to prevent loops
    const currentStepsJson = JSON.stringify(validation.docker_command_steps?.steps || []);
    const newStepsJson = JSON.stringify(newDockerSteps.steps);



    if (currentStepsJson !== newStepsJson) {

      setValidation(
        { docker_command_steps: newDockerSteps, }
      );
    }
  }, [
    validation.dependencies?.custom_nodes,
    validation.selectedCustomNodesToApply,
    validation.selectedConflictingNodes,
  ]);

  // Always show simplified version since custom nodes are handled in machine options
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-green-600 text-xs">
        <CheckCircle className="h-3 w-3" />
        {skipCustomNodeCheck
          ? "Environment ready"
          : validation.dependencies?.custom_nodes
            ? `${Object.keys(validation.dependencies.custom_nodes).length} custom nodes detected`
            : "Analyzing custom nodes..."
        }
      </div>

      {validation.dependencies?.conflicting_nodes && Object.keys(validation.dependencies.conflicting_nodes).length > 0 && (
        <div className="flex items-center gap-2 text-yellow-600 text-xs">
          <Info className="h-3 w-3" />
          {Object.keys(validation.dependencies.conflicting_nodes).length} nodes have multiple implementations
        </div>
      )}
    </div>
  );
}

function AdvanceSettings({ validation }: { validation: StepValidation }) {
  const [openAdvanceSettings, setOpenAdvanceSettings] = useState(false);
  const navigate = useNavigate();
  const query = useMachines();
  const sub = useCurrentPlan();
  const [missingDockerSteps, setMissingDockerSteps] = useState<any>({
    steps: [],
  });

  const createWorkflow = async (machineId?: string) => {
    const requestBody = {
      name: validation.workflowName,
      workflow_json:
        validation.importOption === "import"
          ? validation.importJson
          : validation.workflowJson,
      ...(validation.workflowApi && { workflow_api: validation.workflowApi }),
      ...(machineId && { machine_id: machineId }),
    };

    const result = await api({
      url: "workflow",
      init: {
        method: "POST",
        body: JSON.stringify(requestBody),
      },
    });

    return result;
  };

  // Use the centralized docker_command_steps instead of rebuilding
  useEffect(() => {
    if (validation.docker_command_steps) {
      setMissingDockerSteps(validation.docker_command_steps);
    }
  }, [validation.docker_command_steps]);

  return (
    <>
      <div className="-top-10 absolute right-0 hidden md:block">
        <Button
          variant={"expandIcon"}
          iconPlacement="right"
          Icon={Settings2}
          className={`${sub?.plans?.plans ? "" : "cursor-not-allowed opacity-70"
            }`}
          onClick={() => {
            if (sub?.plans?.plans) {
              setOpenAdvanceSettings(true);
            }
          }}
        >
          Advance Settings
        </Button>
      </div>
      <div className="-top-10 absolute right-0 block md:hidden">
        <Button
          size={"icon"}
          variant={"outline"}
          className={`${sub?.plans?.plans ? "" : "cursor-not-allowed opacity-70"
            }`}
          onClick={() => {
            if (sub?.plans?.plans) {
              setOpenAdvanceSettings(true);
            }
          }}
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>

      <InsertModal
        hideButton
        open={openAdvanceSettings && !sub?.features.machineLimited}
        mutateFn={query.refetch}
        setOpen={setOpenAdvanceSettings}
        disabled={sub?.features.machineLimited}
        dialogClassName="!max-w-[1200px] !max-h-[calc(90vh-10rem)]"
        containerClassName="flex-col"
        tooltip={
          sub?.features.machineLimited
            ? `Max ${sub?.features.machineLimit} ComfyUI machine for your account, upgrade to unlock more configuration.`
            : `Max ${sub?.features.machineLimit} ComfyUI machine for your account`
        }
        title="Create New Machine"
        description="Create a new serverless ComfyUI machine based on the analyzed workflow."
        serverAction={async (data: any) => {
          try {
            const machine = await api({
              url: "machine/serverless",
              init: {
                method: "POST",
                body: JSON.stringify(data),
              },
            });

            toast.success(`${data.name} created successfully!`);
            const workflowResult = await createWorkflow(machine.id);
            toast.success(
              `Workflow "${validation.workflowName}" created successfully!`,
            );
            window.open(
              `/workflows/${workflowResult.data.workflow_id}?view=workspace`,
              "_blank",
            );
            // toast.info("Redirecting to machine page...");
            navigate({
              to: "/machines/$machineId",
              params: { machineId: machine.id },
              search: { view: "deployments" },
            });

            return {}; // Return empty object since we're handling navigation manually
          } catch (error) {
            toast.error(`Failed to create: ${error}`);
            throw error;
          }
        }}
        formSchema={serverlessFormSchema}
        fieldConfig={sharedMachineConfig}
        // dependencies={sharedMachineConfigDeps}
        data={{
          name: validation.machineName || "",
          gpu: validation.gpuType?.toUpperCase() as "T4" | "A10G" | "A100",
          comfyui_version: validation.comfyUiHash || "",
          machine_builder_version: "4",
          docker_command_steps: missingDockerSteps,

          // default values
          allow_concurrent_inputs: 1,
          concurrency_limit: 2,
          run_timeout: 300,
          idle_timeout: 60,
          ws_timeout: 2,
          python_version: "3.11",
        }}
      />
    </>
  );
}

interface NodeConflict {
  url: string;
  name: string;
  conflictWith: {
    url: string;
    name: string;
    source: string;
  };
}

export function findFirstDuplicateNode(
  customNodes: Record<string, any> = {},
  selectedConflictingNodes: Record<string, any[]> = {},
): NodeConflict | null {
  const urlMap = new Map<
    string,
    { url: string; source: string; name: string }
  >();

  // Check custom nodes
  for (const [url, node] of Object.entries(customNodes)) {
    const lowerUrl = url.toLowerCase();
    if (urlMap.has(lowerUrl)) {
      const existing = urlMap.get(lowerUrl);
      if (existing) {
        return {
          url: url,
          name: node.name,
          conflictWith: {
            url: existing.url,
            name: existing.name,
            source: existing.source,
          },
        };
      }
    }
    urlMap.set(lowerUrl, { url, source: "custom nodes", name: node.name });
  }

  // Create a map to track URLs that are already selected in conflicting nodes
  const selectedUrlsMap = new Map<string, string>();

  // Check conflicting nodes
  for (const [nodeName, nodes] of Object.entries(selectedConflictingNodes)) {
    for (const node of nodes) {
      const lowerUrl = node.url.toLowerCase();

      // If URL exists in custom nodes, that's still a conflict
      if (urlMap.has(lowerUrl)) {
        const existing = urlMap.get(lowerUrl);
        if (existing) {
          return {
            url: node.url,
            name: nodeName,
            conflictWith: {
              url: existing.url,
              name: existing.name,
              source: existing.source,
            },
          };
        }
      }

      // Don't consider it a conflict if the same URL is selected for different nodes
      if (!selectedUrlsMap.has(lowerUrl)) {
        selectedUrlsMap.set(lowerUrl, nodeName);
      }
    }
  }

  return null;
}

// New reusable components
function NodeListItem({
  name,
  author,
  url,
  starCount,
  hasHash,
  isUrlDuplicate,
  checkbox = null,
}: {
  name: string;
  author: string;
  url: string;
  starCount?: number;
  hasHash: boolean;
  isUrlDuplicate: boolean;
  checkbox?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-sm border px-3 py-2 hover:bg-gray-50",
        !hasHash &&
        "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
        isUrlDuplicate &&
        "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800",
      )}
    >
      {checkbox}
      <label
        htmlFor={`${url}`}
        className="flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-3 text-sm"
      >
        <div className="flex min-w-0 flex-col">
          <span className="font-medium truncate">{name}</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>by {author}</span>
            {starCount && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" />
                  <span>{starCount.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </label>
      <Link
        href={url}
        target="_blank"
        className="shrink-0 text-muted-foreground hover:text-gray-600 transition-colors"
      >
        <ExternalLink className="h-3 w-3" />
      </Link>
    </div>
  );
}

function ShowMoreButton({
  showAll,
  setShowAll,
  totalCount,
  previewCount
}: {
  showAll: boolean;
  setShowAll: (show: boolean) => void;
  totalCount: number;
  previewCount: number;
}) {
  return totalCount > previewCount ? (
    <Button
      variant="ghost"
      className="mt-2 w-full text-muted-foreground text-xs hover:text-primary"
      onClick={() => setShowAll(!showAll)}
    >
      <div className="flex items-center gap-2">
        {showAll ? (
          <>
            Show Less <ChevronUp className="h-3 w-3" />
          </>
        ) : (
          <>
            Show {totalCount - previewCount} More{" "}
            <ChevronDown className="h-3 w-3" />
          </>
        )}
      </div>
    </Button>
  ) : null;
}


