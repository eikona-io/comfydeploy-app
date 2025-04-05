import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { AddModelRequest, ModelSource } from "@/types/models";
import { FolderPathDisplay } from "./folder-path-display";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, AlertTriangle } from "lucide-react";

interface LinkFormProps {
  onSubmit: (request: AddModelRequest) => void;
  folderPath: string;
  className?: string;
  isSubmitting?: boolean;
}

export function LinkForm({
  onSubmit,
  folderPath,
  className,
  isSubmitting = false,
}: LinkFormProps) {
  const [url, setUrl] = useState("");
  const [filename, setFilename] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlWarning, setUrlWarning] = useState<string | null>(null);
  const [suggestedSource, setSuggestedSource] = useState<ModelSource | null>(
    null,
  );

  useEffect(() => {
    validateUrl(url);
  }, [url]);

  const validateUrl = (inputUrl: string) => {
    // Reset states
    setUrlError(null);
    setUrlWarning(null);
    setSuggestedSource(null);

    if (!inputUrl) return;

    // Check for Civitai URLs
    if (inputUrl.includes("civitai.com")) {
      setUrlWarning(
        "Try using the CivitAI option instead of URL to download the right model.",
      );
      setSuggestedSource("civitai");
      return;
    }

    // Check for Hugging Face URLs
    if (inputUrl.includes("huggingface.co")) {
      // Check for blob URL (incorrect) vs resolve URL (correct)
      if (inputUrl.includes("/blob/")) {
        setUrlWarning(
          `This Hugging Face URL will download the HTML page instead of the model. 
          Use the 'Copy Download Link' button in huggingface to download the model.`,
        );
      } else {
        try {
          // Extract filename from the URL for Hugging Face links
          const url = new URL(inputUrl);
          const pathParts = url.pathname.split("/");
          const lastPart = pathParts[pathParts.length - 1];

          // Set the filename if it has a file extension
          if (lastPart.includes(".")) {
            setFilename(lastPart);
          }
        } catch (e) {
          // If URL parsing fails, we'll catch it in the general validation below
        }
      }
      return;
    }

    // General URL validation
    try {
      new URL(inputUrl);
    } catch (e) {
      setUrlError("Please enter a valid URL");
    }
  };

  const handleSubmit = () => {
    if (!url.trim() || !filename.trim()) return;
    if (urlError) return;

    onSubmit({
      source: "link",
      folderPath,
      filename,
      link: {
        url,
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      !isSubmitting &&
      url.trim() &&
      filename.trim() &&
      !urlError
    ) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className={cn("flex flex-col gap-4", className)}
    >
      <FolderPathDisplay path={folderPath} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/model.safetensors"
          onKeyDown={handleKeyDown}
          className={cn(
            urlError && "border-red-500",
            urlWarning && !urlError && "border-yellow-400",
          )}
        />

        {urlError && (
          <Alert variant="destructive" className="mt-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{urlError}</AlertDescription>
          </Alert>
        )}

        {urlWarning && !urlError && (
          <Alert
            className={cn(
              "mt-2",
              suggestedSource
                ? "border-blue-200 bg-blue-50"
                : "border-yellow-200 bg-yellow-50",
            )}
          >
            <Info className="h-4 w-4" />
            <AlertDescription
              className={suggestedSource ? "text-blue-800" : "text-yellow-800"}
            >
              {urlWarning}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="filename">Filename</Label>
        <Input
          id="filename"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="model.safetensors"
          onKeyDown={handleKeyDown}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !url.trim() || !filename.trim() || !!urlError}
      >
        {isSubmitting ? "Adding Model..." : "Add Model"}
      </Button>
    </form>
  );
}
