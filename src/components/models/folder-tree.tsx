import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  FolderIcon,
  FileIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  RefreshCcw,
  MoreHorizontal,
  Trash2,
  Search,
  FolderPlus,
  Upload,
} from "lucide-react";
import { api } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface FileEntry {
  path: string;
  type: 1 | 2;
  mtime: number;
  size: number;
}

interface FolderTreeProps {
  className?: string;
  onAddModel?: (folderPath: string) => void;
}

interface TreeNode {
  name: string;
  path: string;
  type: 1 | 2;
  children: TreeNode[];
  mtime: number;
  size: number;
  isPrivate: boolean;
}

type ModelFilter = "private" | "public" | "all";

function buildTree(files: FileEntry[], isPrivate: boolean): TreeNode[] {
  const root: TreeNode[] = [];

  for (const file of files) {
    const parts = file.path.split("/");
    let currentLevel = root;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      const existingNode = currentLevel.find((node) => node.name === part);

      if (existingNode) {
        if (isLast) {
          // If this is a file and it already exists, create a new node
          const newNode: TreeNode = {
            name: part,
            path: parts.slice(0, index + 1).join("/"),
            type: file.type,
            children: [],
            mtime: file.mtime,
            size: file.size,
            isPrivate,
          };
          currentLevel.push(newNode);
        } else {
          currentLevel = existingNode.children;
        }
      } else {
        const newNode: TreeNode = {
          name: part,
          path: parts.slice(0, index + 1).join("/"),
          type: isLast ? file.type : 2,
          children: [],
          mtime: file.mtime,
          size: file.size,
          isPrivate,
        };
        currentLevel.push(newNode);
        currentLevel = newNode.children;
      }
    });
  }

  return root;
}

interface CreateFolderData {
  parentPath: string;
  folderName: string;
}

interface FileOperations {
  createFolder: (data: CreateFolderData) => Promise<void>;
  deleteFile: (path: string) => Promise<void>;
  moveFile: (from: string, to: string) => Promise<void>;
}

function TreeNode({
  node,
  search,
  parentMatched = false,
  operations,
  onAddModel,
}: {
  node: TreeNode;
  search: string;
  parentMatched?: boolean;
  operations: FileOperations;
  onAddModel: (folderPath: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(!!search);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Check if this node or any of its children match
  const nodeMatches = node.name.toLowerCase().includes(search.toLowerCase());
  const childrenMatch = node.children.some((child) =>
    child.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Show if:
  // 1. Not searching
  // 2. This node matches
  // 3. Any parent matched
  // 4. Any children match
  const shouldShow = !search || nodeMatches || parentMatched || childrenMatch;

  // Keep folder open if user has explicitly interacted with it
  const shouldBeOpen = isOpen;

  if (!shouldShow) {
    return null;
  }

  const handleCreateFolder = async () => {
    try {
      await operations.createFolder({
        parentPath: node.path,
        folderName: newFolderName,
      });
      setShowNewFolderDialog(false);
      setNewFolderName("");
      toast.success("Folder created successfully");
    } catch (error) {
      toast.error("Failed to create folder");
    }
  };

  return (
    <div>
      <div className="group flex items-center gap-2">
        <button
          type="button"
          className="flex flex-1 items-center gap-2 rounded px-2 py-1 hover:bg-accent"
          onClick={() => setIsOpen(!isOpen)}
        >
          {node.type === 2 ? (
            <>
              {shouldBeOpen ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
              <FolderIcon className="h-4 w-4" />
            </>
          ) : (
            <>
              <span className="w-4" />
              <FileIcon className="h-4 w-4" />
            </>
          )}
          <span>{node.name}</span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {node.type === 2 ? (
              <>
                <DropdownMenuItem onClick={() => setShowNewFolderDialog(true)}>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  New Folder
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddModel(node.path)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Model
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => operations.deleteFile(node.path)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowNewFolderDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateFolder}>Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {shouldBeOpen && node.children.length > 0 && (
        <div className="ml-6">
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              search={search}
              parentMatched={nodeMatches || parentMatched}
              operations={operations}
              onAddModel={onAddModel}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function mergeNodes(
  privateNodes: TreeNode[],
  publicNodes: TreeNode[],
  showPrivate: boolean,
  showPublic: boolean,
): TreeNode[] {
  const result: TreeNode[] = [];
  const seenPaths = new Set<string>();

  // Helper to check if a node should be included based on its privacy
  const shouldIncludeNode = (node: TreeNode) =>
    (node.isPrivate && showPrivate) || (!node.isPrivate && showPublic);

  // Add private nodes if showing private
  if (showPrivate) {
    for (const node of privateNodes) {
      if (shouldIncludeNode(node)) {
        result.push(node);
        seenPaths.add(node.path);
      }
    }
  }

  // Add or merge public nodes if showing public
  if (showPublic) {
    for (const publicNode of publicNodes) {
      const existingNodeIndex = result.findIndex(
        (node) => node.name === publicNode.name,
      );

      if (existingNodeIndex === -1) {
        // No existing node with this name, add if we haven't seen this path
        if (!seenPaths.has(publicNode.path) && shouldIncludeNode(publicNode)) {
          result.push(publicNode);
          seenPaths.add(publicNode.path);
        }
      } else {
        const existingNode = result[existingNodeIndex];
        // If both are folders, merge their children
        if (existingNode.type === 2 && publicNode.type === 2) {
          const mergedChildren = mergeNodes(
            existingNode.children,
            publicNode.children,
            showPrivate,
            showPublic,
          );
          if (mergedChildren.length > 0) {
            existingNode.children = mergedChildren;
          }
        }
      }
    }
  }

  return result;
}

export function FolderTree({ className, onAddModel }: FolderTreeProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ModelFilter>("private");
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [frontendFolderPaths, setFrontendFolderPaths] = useState<string[]>([]);
  const [showAddModelDialog, setShowAddModelDialog] = useState(false);

  const { data: privateFiles, isLoading: isLoadingPrivate } = useQuery({
    queryKey: ["volume", "private-models"],
    queryFn: async ({ queryKey }) => {
      const response = await api({
        url: queryKey.join("/"),
      });
      return response as Promise<FileEntry[]>;
    },
  });

  const { data: publicFiles, isLoading: isLoadingPublic } = useQuery({
    queryKey: ["volume", "public-models"],
    queryFn: async ({ queryKey }) => {
      const response = await api({
        url: queryKey.join("/"),
      });
      return response as Promise<FileEntry[]>;
    },
  });

  const privateTree = privateFiles ? buildTree(privateFiles, true) : [];
  const publicTree = publicFiles ? buildTree(publicFiles, false) : [];

  // Inject frontend folders into the tree
  const injectFrontendFolders = (tree: TreeNode[]): TreeNode[] => {
    const result = [...tree];

    for (const path of frontendFolderPaths) {
      const parts = path.split("/");
      let currentLevel = result;

      for (const [index, part] of parts.entries()) {
        const isLast = index === parts.length - 1;
        const existingNode = currentLevel.find((node) => node.name === part);

        if (existingNode) {
          if (!isLast) {
            currentLevel = existingNode.children;
          }
        } else {
          const newNode: TreeNode = {
            name: part,
            path: parts.slice(0, index + 1).join("/"),
            type: 2,
            children: [],
            mtime: Date.now(),
            size: 0,
            isPrivate: true,
          };
          currentLevel.push(newNode);
          currentLevel = newNode.children;
        }
      }
    }

    return result;
  };

  const mergedTree = mergeNodes(
    injectFrontendFolders(privateTree),
    publicTree,
    filter === "private" || filter === "all",
    filter === "public" || filter === "all",
  );

  const createFolderMutation = useMutation({
    mutationFn: async (data: CreateFolderData) => {
      await api({
        url: "volume/create-folder",
        init: {
          method: "POST",
          body: JSON.stringify(data),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volume"] });
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (path: string) => {
      await api({
        url: "volume/delete",
        init: {
          method: "DELETE",
          body: JSON.stringify({ path }),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volume"] });
    },
  });

  const operations: FileOperations = {
    createFolder: async (data: CreateFolderData) => {
      const newPath = data.parentPath
        ? `${data.parentPath}/${data.folderName}`
        : data.folderName;

      setFrontendFolderPaths((prev) => [...prev, newPath]);
    },
    deleteFile: deleteFileMutation.mutateAsync,
    moveFile: async (from, to) => {
      // To be implemented
    },
  };

  const handleCreateFolder = async () => {
    try {
      await operations.createFolder({
        parentPath: "", // Empty string for root level
        folderName: newFolderName,
      });
      setShowNewFolderDialog(false);
      setNewFolderName("");
      toast.success("Folder created successfully");
    } catch (error) {
      toast.error("Failed to create folder");
    }
  };

  return (
    <div className={cn("flex h-full flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">Models</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["volume"] })
            }
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNewFolderDialog(true)}
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search models..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={filter} onValueChange={(v) => setFilter(v as ModelFilter)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="private">Private</SelectItem>
          <SelectItem value="public">Public</SelectItem>
          <SelectItem value="all">All</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex-1 overflow-auto">
        {isLoadingPrivate || isLoadingPublic ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-col">
            {mergedTree.map((node) => (
              <TreeNode
                key={node.path}
                node={node}
                search={search}
                operations={operations}
                onAddModel={onAddModel}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowNewFolderDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateFolder}>Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
