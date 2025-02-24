import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { FolderPathDisplay } from "./folder-path-display";

interface LinkFormProps {
  onSubmit: (model: {
    source: string;
    folderPath: string;
    filename: string;
    downloadLink: string;
  }) => void;
  folderPath: string;
  className?: string;
}

export function LinkForm({ onSubmit, folderPath, className }: LinkFormProps) {
  const [url, setUrl] = useState("");
  const [filename, setFilename] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!url || !filename) return;

    onSubmit({
      source: "link",
      folderPath,
      filename,
      downloadLink: url,
    });
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <FolderPathDisplay path={folderPath} />

      <Input
        placeholder="Enter model URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

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

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!url || !filename}
        className="mt-2"
      >
        Add Model
      </Button>
    </div>
  );
}
