import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AddModelRequest } from "@/types/models";
import { FolderPathDisplay } from "./folder-path-display";
import { cn } from "@/lib/utils";

interface LinkFormProps {
  onSubmit: (request: AddModelRequest) => void;
  folderPath: string;
  className?: string;
}

export function LinkForm({ onSubmit, folderPath, className }: LinkFormProps) {
  const [downloadLink, setDownloadLink] = useState("");
  const [filename, setFilename] = useState("");

  const handleSubmit = () => {
    if (!downloadLink || !filename) return;

    onSubmit({
      source: "link",
      folderPath,
      filename,
      downloadLink,
    });
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (downloadLink && filename) {
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className={cn("flex flex-col gap-4", className)}
    >
      <FolderPathDisplay path={folderPath} />

      <div className="flex flex-col gap-2">
        <label htmlFor="downloadLink" className="text-sm font-medium">
          Download URL
        </label>
        <Input
          id="downloadLink"
          placeholder="Enter direct download URL"
          value={downloadLink}
          onChange={(e) => setDownloadLink(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="filename" className="text-sm font-medium">
          Filename
        </label>
        <Input
          id="filename"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="Enter filename"
        />
      </div>

      <Button
        type="submit"
        disabled={!downloadLink || !filename}
        className="mt-2"
      >
        Add Model
      </Button>
    </form>
  );
}
