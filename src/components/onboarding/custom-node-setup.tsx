import type { StepValidation } from "@/components/onboarding/workflow-import";
import type { StepComponentProps } from "@/components/step-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getBranchInfo } from "@/hooks/use-github-branch-info";
import { cn } from "@/lib/utils";
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
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type CustomNodeData = {
  title: string;
  author: string;
  reference: string;
  pip: string[];
  files: string[];
  install_type: string;
  description: string;
};

type SelectedNodeData = CustomNodeData & {
  branchInfo?: {
    commit: {
      sha: string;
      commit: {
        message: string;
      };
    };
    stargazers_count: number;
    customHash?: string;
  };
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
}: StepComponentProps<StepValidation>) {
  const { data, isLoading } = useQuery<CustomNodeData[]>({
    queryKey: ["customNodeList"],
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
  const [selectedNodes, setSelectedNodes] = useState<SelectedNodeData[]>([]);

  const handleAddNode = async (node: CustomNodeData) => {
    if (selectedNodes.some((n) => n.reference === node.reference)) {
      return;
    }

    try {
      const branchInfo = await getBranchInfo(node.reference);
      setSelectedNodes([...selectedNodes, { ...node, branchInfo }]);
    } catch (error) {
      console.error("Failed to fetch branch info:", error);
      // Still add the node even if branch info fails
      setSelectedNodes([...selectedNodes, node]);
      toast.error("Failed to fetch repository information");
    }
  };

  const handleRemoveNode = (node: SelectedNodeData) => {
    setSelectedNodes(
      selectedNodes.filter((n) => n.reference !== node.reference),
    );
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

      <div className="flex flex-row gap-2">
        <div className="flex w-1/2 flex-col gap-4 rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
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
                  {rowVirtualizer.getVirtualItems().map((virtualRow, index) => (
                    <div
                      key={virtualRow.index}
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
                          selectedNodes.some(
                            (n) =>
                              n.reference ===
                              filteredNodes[virtualRow.index].reference,
                          ) && "opacity-30",
                        )}
                      >
                        <div className="flex flex-row items-center justify-between">
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate font-medium">
                              {filteredNodes[virtualRow.index].title}
                            </span>
                            <div className="flex items-center">
                              <span className="text-gray-500 text-xs">
                                {filteredNodes[virtualRow.index].author}
                              </span>
                              <Link
                                to={filteredNodes[virtualRow.index].reference}
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
                              disabled={selectedNodes.some(
                                (n) =>
                                  n.reference ===
                                  filteredNodes[virtualRow.index].reference,
                              )}
                            >
                              <ChevronRight size={12} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-1/2">
          <SelectedNodeList
            selectedNodes={selectedNodes}
            setSelectedNodes={setSelectedNodes}
            handleRemoveNode={handleRemoveNode}
          />
        </div>
      </div>
    </div>
  );
}

function SelectedNodeList({
  selectedNodes,
  setSelectedNodes,
  handleRemoveNode,
}: {
  selectedNodes: SelectedNodeData[];
  setSelectedNodes: React.Dispatch<React.SetStateAction<SelectedNodeData[]>>;
  handleRemoveNode: (node: SelectedNodeData) => void;
}) {
  const [editingHash, setEditingHash] = useState<string | null>(null);

  const handleStartEdit = (node: SelectedNodeData) => {
    setEditingHash(node.reference);
  };

  const handleSaveHash = (node: SelectedNodeData, value: string) => {
    const updatedNodes = selectedNodes.map((n) => {
      if (n.reference === node.reference && n.branchInfo) {
        if (!value || value === n.branchInfo.commit.sha) {
          // If empty or same as original, remove custom hash
          const { customHash, ...rest } = n.branchInfo;
          return { ...n, branchInfo: rest };
        }
        // Save custom hash
        return {
          ...n,
          branchInfo: { ...n.branchInfo, customHash: value },
        };
      }
      return n;
    });
    setSelectedNodes(updatedNodes);
    setEditingHash(null);
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="font-medium text-md">
        Selected Nodes ({selectedNodes.length})
      </h2>
      <div className="flex flex-col gap-2">
        {selectedNodes.map((node) => (
          <div
            key={node.reference}
            className="group flex flex-col rounded-[6px] bg-gray-50 p-2 text-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium">{node.title}</span>
                <div className="flex items-center">
                  <span className="text-gray-500 text-xs">{node.author}</span>
                  <Link
                    to={node.reference}
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

            {node.branchInfo && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex w-full flex-col text-gray-500 text-xs leading-snug">
                  <div className="flex w-full items-center gap-2">
                    <span className="whitespace-nowrap font-medium">
                      {node.branchInfo.customHash ||
                      editingHash === node.reference
                        ? "Hash"
                        : "Latest commit"}
                      :
                    </span>
                    {editingHash === node.reference ? (
                      <Input
                        autoFocus
                        defaultValue={
                          node.branchInfo.customHash ||
                          node.branchInfo.commit.sha
                        }
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
                        {node.branchInfo.customHash ? (
                          <span className="text-amber-600">
                            {node.branchInfo.customHash.slice(0, 7)}
                          </span>
                        ) : (
                          node.branchInfo.commit.sha.slice(0, 7)
                        )}
                      </code>
                    )}
                    {editingHash !== node.reference && (
                      <>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1">
                          <Star
                            size={12}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          <span>
                            {node.branchInfo.stargazers_count.toLocaleString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  {!node.branchInfo.customHash &&
                    editingHash !== node.reference && (
                      <div className="line-clamp-1">
                        <span className="font-medium">Message:</span>{" "}
                        {node.branchInfo.commit.commit.message}
                      </div>
                    )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "shrink-0 text-gray-500",
                    editingHash !== node.reference &&
                      "opacity-0 transition-opacity duration-200 hover:text-red-600 group-hover:opacity-100",
                  )}
                  onClick={(e) => {
                    if (editingHash === node.reference) {
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
                  {editingHash === node.reference ? (
                    <Save size={12} />
                  ) : (
                    <Pencil size={12} />
                  )}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
