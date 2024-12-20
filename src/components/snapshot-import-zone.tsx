import { RefreshCw, Replace, Upload } from "lucide-react";
import { type ReactNode, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export type SnapshotImportData = {
  comfyui: string;
  git_custom_nodes: Record<string, any>;
};

interface SnapshotImportZoneProps {
  children: ReactNode;
  currentMachineState: any;
  onMachineStateChange: (newState: any) => void;
  className?: string;
  showImportButton?: boolean;
}

interface SnapshotImportZoneLiteProps {
  children: ReactNode;
  onSnapshotImport: (snapshotData: any) => void;
  className?: string;
  showImportButton?: boolean;
}

export function SnapshotImportZone({
  children,
  currentMachineState: currentState,
  onMachineStateChange: onStateChange,
  className = "",
  showImportButton = true,
}: SnapshotImportZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [snapshotContent, setSnapshotContent] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (
      x <= rect.left ||
      x >= rect.right ||
      y <= rect.top ||
      y >= rect.bottom
    ) {
      setIsDragging(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleFileImport = (file: File) => {
    if (!file.name.toLowerCase().includes("snapshot.json")) {
      toast.error("Please select a snapshot.json file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = JSON.parse(event.target?.result as string);
        setSnapshotContent(content);
        setShowDialog(true);
      } catch (e) {
        toast.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileImport(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileImport(file);
      e.target.value = ""; // Reset input
    }
  };

  const handleUpdateExisting = () => {
    if (!snapshotContent) return;

    const currentSteps = [...currentState.docker_command_steps.steps];
    let updatedCount = 0;
    const updated = currentSteps.map((step) => {
      if (step.type === "custom-node") {
        const url = step.data.url;
        const matchingNode = Object.entries(
          snapshotContent.git_custom_nodes,
        ).find(([nodeUrl]) => nodeUrl === url);

        if (matchingNode) {
          const hash = (matchingNode[1] as { hash: string }).hash;
          if (hash !== step.data.hash) {
            updatedCount++;
          }
          return {
            ...step,
            data: {
              ...step.data,
              meta: {
                message: `Updated to ${hash.substring(0, 7)}`,
                committer: {
                  name: "Snapshot Import",
                  date: new Date().toISOString(),
                },
              },
              hash: hash,
            },
          };
        }
      }
      return step;
    });

    const newState = {
      ...currentState,
      docker_command_steps: {
        ...currentState.docker_command_steps,
        steps: updated,
      },
    };

    if (snapshotContent.comfyui) {
      newState.comfyui_version = snapshotContent.comfyui;
    }

    onStateChange(newState);
    setShowDialog(false);
    toast.success(
      `Updated ${updatedCount} custom node${
        updatedCount !== 1 ? "s" : ""
      } and ComfyUI version`,
    );
  };

  const handleImportAll = () => {
    if (!snapshotContent?.git_custom_nodes) return;

    const newSteps = Object.entries(snapshotContent.git_custom_nodes).map(
      ([url, data]: [string, any]) => ({
        id: Math.random().toString(36).substr(2, 9),
        type: "custom-node" as const,
        data: {
          url,
          hash: data.hash,
          name: url.split("/").pop(),
          files: [url],
          install_type: "git-clone",
        },
      }),
    );

    const newState = {
      ...currentState,
      docker_command_steps: {
        ...currentState.docker_command_steps,
        steps: newSteps,
      },
    };

    if (snapshotContent.comfyui) {
      newState.comfyui_version = snapshotContent.comfyui;
    }

    onStateChange(newState);
    setShowDialog(false);
    toast.success("Imported all custom nodes and ComfyUI version");
  };

  return (
    <div
      className={`relative ${className}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleFileDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".json"
        onChange={handleFileSelect}
      />

      {showImportButton && (
        <div className="px-4 pt-1 pb-3">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-fit"
          >
            Import Snapshot
            <Upload className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Drag overlay */}
      <div
        className={`absolute inset-0 z-[9999] transition-all duration-300 ${
          isDragging
            ? "rounded-sm border-2 border-blue-500 border-dashed bg-blue-500/10 opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-lg bg-white p-6 text-center shadow-lg">
              <p className="font-medium text-gray-700 text-lg">
                Drop snapshot.json file here
              </p>
              <p className="mt-1 text-gray-500 text-sm">
                Release to import custom nodes
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Import dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Snapshot</DialogTitle>
            <DialogDescription>
              Choose how to import the custom nodes from your snapshot.json
              file.
              {snapshotContent?.comfyui && (
                <p className="mt-2">
                  ComfyUI Version: <Badge>{snapshotContent.comfyui}</Badge>
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Button
              onClick={handleUpdateExisting}
              className="flex h-auto w-full justify-start bg-black px-6 py-4 text-white hover:bg-black/90"
            >
              <RefreshCw className="mt-0.5 mr-2 h-5 w-5" />
              <div className="flex flex-col items-start">
                <span className="text-base">Update Existing Nodes</span>
                <span className="text-gray-400 text-xs">
                  Keeps current nodes, updates matching hashes
                </span>
              </div>
            </Button>
            <Button
              onClick={handleImportAll}
              className="flex h-auto w-full justify-start bg-black px-6 py-4 text-white hover:bg-black/90"
            >
              <Replace className="mt-0.5 mr-2 h-5 w-5" />
              <div className="flex flex-col items-start">
                <span className="text-base">Import All Nodes</span>
                <span className="text-gray-400 text-xs">
                  Replaces all current nodes
                </span>
              </div>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {children}
    </div>
  );
}

export function SnapshotImportZoneLite({
  children,
  onSnapshotImport,
  className = "",
  showImportButton = true,
}: SnapshotImportZoneLiteProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (
      x <= rect.left ||
      x >= rect.right ||
      y <= rect.top ||
      y >= rect.bottom
    ) {
      setIsDragging(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleFileImport = (file: File) => {
    if (!file.name.toLowerCase().includes("snapshot.json")) {
      toast.error("Please select a snapshot.json file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = JSON.parse(event.target?.result as string);
        onSnapshotImport(content);
      } catch (e) {
        toast.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileImport(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileImport(file);
      e.target.value = ""; // Reset input
    }
  };

  return (
    <div
      className={`relative ${className}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleFileDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".json"
        onChange={handleFileSelect}
      />

      {showImportButton && (
        <div className="pt-1 pb-3">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-fit"
          >
            Import Snapshot
            <Upload className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Drag overlay */}
      <div
        className={`absolute inset-0 z-[9999] transition-all duration-300 ${
          isDragging
            ? "rounded-sm border-2 border-blue-500 border-dashed bg-blue-500/10 opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-lg bg-white p-6 text-center shadow-lg">
              <p className="font-medium text-gray-700 text-lg">
                Drop snapshot.json file here
              </p>
              <p className="mt-1 text-gray-500 text-sm">
                Release to import snapshot
              </p>
            </div>
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
