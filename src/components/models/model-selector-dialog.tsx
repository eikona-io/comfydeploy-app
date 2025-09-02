import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FolderTree } from "./folder-tree";
import { AddModelDialog } from "./add-model-dialog";
import { toast } from "sonner";

interface ModelSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onModelSelect: (modelPath: string) => void;
  currentValue?: string;
  category?: string;
  title?: string;
  description?: string;
}

export function ModelSelectorDialog({
  open,
  onOpenChange,
  onModelSelect,
  currentValue,
  category,
  title = "Select a Model",
  description = "Browse and select a model from your library, or add new models",
}: ModelSelectorDialogProps) {
  const [selectedPath, setSelectedPath] = useState<string>(currentValue || "");
  const [showAddModelDialog, setShowAddModelDialog] = useState(false);
  const [selectedFolderPath, setSelectedFolderPath] = useState("");

  const handleModelClick = (path: string) => {
    // When a model is clicked in the FolderTree, set it as selected
    setSelectedPath(path);
  };

  const handleAddModel = (folderPath: string) => {
    setSelectedFolderPath(folderPath);
    setShowAddModelDialog(true);
  };

  const handleConfirm = () => {
    if (!selectedPath) {
      toast.error("Please select a model");
      return;
    }

    onModelSelect(selectedPath);
    onOpenChange(false);
    toast.success("Model selected");
  };

  const handleCancel = () => {
    setSelectedPath(currentValue || "");
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-auto">
              <FolderTree
                onAddModel={handleAddModel}
                onModelSelect={handleModelClick}
                selectorMode={true}
                selectedPath={selectedPath}
                filterByCategory={category}
                className="h-full p-1"
              />
            </div>
          </div>

          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-muted-foreground">
                {selectedPath ? (
                  <span>Selected: <code className="bg-muted px-1 py-0.5 rounded">{selectedPath}</code></span>
                ) : (
                  <span>No model selected</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleConfirm} disabled={!selectedPath}>
                  Select Model
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddModelDialog
        open={showAddModelDialog}
        onOpenChange={setShowAddModelDialog}
        initialFolderPath={selectedFolderPath}
      />
    </>
  );
}
