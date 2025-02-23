import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link2, Globe, Upload } from "lucide-react";

interface AddFileInput {
  url: string;
  filename?: string;
  folder_path: string;
}

interface AddModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFolderPath?: string;
}

export function AddModelDialog({
  open,
  onOpenChange,
  initialFolderPath = "",
}: AddModelDialogProps) {
  const [url, setUrl] = useState("");
  const [filename, setFilename] = useState("");
  const [folderPath, setFolderPath] = useState(initialFolderPath);

  const queryClient = useQueryClient();

  useEffect(() => {
    setFolderPath(initialFolderPath);
  }, [initialFolderPath]);

  const addModelMutation = useMutation({
    mutationFn: async (data: AddFileInput) => {
      await api({
        url: "volume/add-file",
        init: {
          method: "POST",
          body: JSON.stringify(data),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volume"] });
      toast.success("Model added successfully");
      onOpenChange(false);
      // Reset form
      setUrl("");
      setFilename("");
      setFolderPath("");
    },
    onError: () => {
      toast.error("Failed to add model");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addModelMutation.mutate({
      url,
      filename: filename || undefined,
      folder_path: folderPath,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Model</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center gap-4 p-8"
          >
            <Globe className="h-8 w-8" />
            <span>Hugging Face</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center gap-4 p-8"
          >
            <Globe className="h-8 w-8" />
            <span>CivitAI</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center gap-4 p-8"
          >
            <Link2 className="h-8 w-8" />
            <span>Raw Link</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center gap-4 p-8"
          >
            <Upload className="h-8 w-8" />
            <span>Local Upload</span>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="url" className="font-medium text-sm">
              Model URL
            </label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="filename" className="font-medium text-sm">
              Filename (Optional)
            </label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="model.safetensors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="folder" className="font-medium text-sm">
              Folder Path
            </label>
            <Input
              id="folder"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              placeholder="folder/subfolder"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addModelMutation.isPending}>
              {addModelMutation.isPending ? "Adding..." : "Add Model"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
