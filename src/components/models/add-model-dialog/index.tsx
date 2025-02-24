import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ModelSource, AddModelRequest } from "@/types/models";
import { SourceSelector } from "./source-selector";
import { HuggingfaceForm } from "./huggingface-form";
import { CivitaiForm } from "./civitai-form";
import { LinkForm } from "./link-form";

interface AddModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFolderPath: string;
}

export function AddModelDialog({
  open,
  onOpenChange,
  initialFolderPath,
}: AddModelDialogProps) {
  const [selectedSource, setSelectedSource] = useState<ModelSource | null>(
    null,
  );

  const handleSourceSelect = (source: ModelSource) => {
    setSelectedSource(source);
  };

  const handleSubmit = (request: AddModelRequest) => {
    // TODO: Handle the model addition
    console.log("Adding model:", request);
  };

  const renderForm = () => {
    switch (selectedSource) {
      case "huggingface":
        return (
          <HuggingfaceForm
            onSubmit={handleSubmit}
            folderPath={initialFolderPath}
          />
        );
      case "civitai":
        return (
          <CivitaiForm onSubmit={handleSubmit} folderPath={initialFolderPath} />
        );
      case "link":
        return (
          <LinkForm onSubmit={handleSubmit} folderPath={initialFolderPath} />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Model</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <SourceSelector
            selected={selectedSource}
            onSelect={handleSourceSelect}
          />
          {renderForm()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
