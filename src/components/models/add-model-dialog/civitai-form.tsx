import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { VerifyCivitAIResponse, AddModelRequest } from "@/types/models";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { FolderPathDisplay } from "./folder-path-display";

interface CivitaiFormProps {
  onSubmit: (request: AddModelRequest) => void;
  folderPath: string;
  className?: string;
}

interface PreviewMediaProps {
  url: string;
}

function PreviewMedia({ url }: PreviewMediaProps) {
  const [isVideo, setIsVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkContentType = async () => {
      try {
        const response = await fetch(url, { method: "HEAD" });
        const contentType = response.headers.get("content-type");
        setIsVideo(contentType?.startsWith("video/") ?? false);
      } catch (error) {
        console.error("Error checking content type:", error);
        setIsVideo(/\.(mp4|webm|mov)$/i.test(url));
      } finally {
        setIsLoading(false);
      }
    };

    checkContentType();
  }, [url]);

  const mediaClasses = cn("max-h-64 w-full rounded-md bg-black object-contain");

  if (isLoading) {
    return <div className={cn(mediaClasses, "h-64 animate-pulse")} />;
  }

  if (isVideo) {
    return (
      <video src={url} controls className={mediaClasses}>
        <track kind="captions" />
      </video>
    );
  }

  return <img src={url} alt="Model preview" className={mediaClasses} />;
}

export function CivitaiForm({
  onSubmit,
  folderPath,
  className,
}: CivitaiFormProps) {
  const [url, setUrl] = useState("");
  const [filename, setFilename] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<VerifyCivitAIResponse | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const debouncedUrl = useDebounce(url, 500);

  useEffect(() => {
    if (!debouncedUrl) {
      setValidation(null);
      return;
    }
    validateUrl(debouncedUrl);
  }, [debouncedUrl]);

  useEffect(() => {
    if (validation?.filename) {
      setFilename(validation.filename);
    }
  }, [validation?.filename]);

  const validateUrl = async (modelUrl: string) => {
    setIsValidating(true);
    setError(null);

    try {
      const response = await api({
        url: "volume/validate/civitai",
        init: {
          method: "POST",
          body: JSON.stringify({ url: modelUrl }),
        },
      });

      console.log("Civitai validation response:", response);
      setValidation(response);
    } catch (err) {
      console.error("Validation error:", err);
      setError("Failed to validate Civitai URL");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = () => {
    if (!validation?.exists || !filename) return;

    onSubmit({
      source: "civitai",
      folderPath,
      filename,
      civitai: {
        url: url,
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <FolderPathDisplay path={folderPath} />

      <div className="relative">
        <Input
          placeholder="Enter Civitai model URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={cn(
            "pr-10",
            validation?.exists && "border-green-500",
            validation && !validation.exists && "border-red-500",
          )}
        />
        <div className="-translate-y-1/2 absolute top-1/2 right-3">
          {isValidating ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : validation?.exists ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : validation ? (
            <XCircle className="h-4 w-4 text-red-500" />
          ) : null}
        </div>
      </div>

      {validation?.exists && (
        <>
          <div className="flex flex-col gap-4 rounded-md border p-4">
            <div className="font-medium">{validation.title}</div>
            {validation.preview_url && (
              <PreviewMedia url={validation.preview_url} />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="filename" className="font-medium text-sm">
              Filename
            </label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename"
            />
          </div>
        </>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!validation?.exists || !filename}
        className="mt-2"
      >
        Add Model
      </Button>
    </div>
  );
}
