import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { X, Plus, FolderOpen } from "lucide-react";
import { toast } from "sonner";

interface ModelPathSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

interface FileEntry {
  path: string;
  type: 1 | 2;
  mtime: number;
  size: number;
}

function flattenFiles(files: FileEntry[]): string[] {
  const result: string[] = [];

  function traverse(files: FileEntry[]) {
    for (const file of files) {
      if (file.type === 1) {
        // File
        result.push(file.path);
      }
    }
  }

  traverse(files);
  return result;
}

export function ModelPathSelector({
  value,
  onChange,
  disabled = false,
}: ModelPathSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch available model files
  const { data: privateFiles, isLoading: isLoadingPrivate } = useQuery<
    FileEntry[]
  >({
    queryKey: ["volume", "private-models"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: publicFiles, isLoading: isLoadingPublic } = useQuery<
    FileEntry[]
  >({
    queryKey: ["volume", "public-models"],
    refetchInterval: 30000,
  });

  // Flatten all available files
  const allFiles = [
    ...(privateFiles ? flattenFiles(privateFiles) : []),
    ...(publicFiles ? flattenFiles(publicFiles) : []),
  ];

  // Filter to common model file extensions
  const modelFiles = allFiles.filter((path) =>
    /\.(safetensors|ckpt|pt|pth|bin|onnx|pb)$/i.test(path),
  );

  // Filter by search term
  const filteredModelFiles = searchTerm
    ? modelFiles.filter((path) =>
        path.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : modelFiles;

  const handleAddPath = () => {
    if (!selectedPath) return;

    if (value.includes(selectedPath)) {
      toast.error("This model path is already selected");
      return;
    }

    onChange([...value, selectedPath]);
    setSelectedPath("");
    setIsDialogOpen(false);
    toast.success("Model path added");
  };

  const handleRemovePath = (pathToRemove: string) => {
    onChange(value.filter((path) => path !== pathToRemove));
    toast.success("Model path removed");
  };

  const handleManualAdd = (manualPath: string) => {
    if (!manualPath.trim()) return;

    if (value.includes(manualPath.trim())) {
      toast.error("This model path is already selected");
      return;
    }

    onChange([...value, manualPath.trim()]);
    setSelectedPath("");
    setIsDialogOpen(false);
    toast.success("Model path added");
  };

  return (
    <div className="space-y-3">
      {/* Display selected paths */}
      <div
        className={`flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md bg-muted/20 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        {value.length === 0 ? (
          <div className="flex items-center justify-center w-full text-sm text-muted-foreground">
            {disabled
              ? "Enable GPU memory snapshot to select models"
              : "No models selected"}
          </div>
        ) : (
          value.map((path) => (
            <Badge
              key={path}
              variant="secondary"
              className="flex items-center gap-1 max-w-xs"
            >
              <span className="truncate text-xs">{path}</span>
              <button
                type="button"
                onClick={() => handleRemovePath(path)}
                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>

      {/* Add new path button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Model Path
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Model Path</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Quick select from available models */}
            {modelFiles.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Select from available models
                </label>
                <Input
                  placeholder="Search models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-2"
                />
                <Select value={selectedPath} onValueChange={setSelectedPath}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a model file" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {filteredModelFiles.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        {searchTerm
                          ? "No models match your search"
                          : "No models found"}
                      </div>
                    ) : (
                      filteredModelFiles.map((path) => (
                        <SelectItem key={path} value={path}>
                          <div className="flex flex-col">
                            <span className="font-mono text-xs">{path}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddPath}
                  disabled={!selectedPath}
                  className="w-full"
                >
                  Add Selected Model
                </Button>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            {/* Manual input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter path manually</label>
              <Input
                placeholder="e.g., checkpoints/my-model.safetensors"
                value={selectedPath}
                onChange={(e) => setSelectedPath(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleManualAdd(selectedPath);
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                onClick={() => handleManualAdd(selectedPath)}
                disabled={!selectedPath.trim()}
                className="w-full"
              >
                Add Custom Path
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
