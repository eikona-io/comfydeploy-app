import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FolderPathDisplay } from "./folder-path-display";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { uploadFileToVolume } from "@/components/files-api";
import { api } from "@/lib/api";
import type { AddModelRequest } from "@/types/models";
import { formatBytes, formatTime } from "@/lib/utils";

interface LocalUploadFormProps {
  onSubmit: (request: AddModelRequest) => void;
  folderPath: string;
  className?: string;
  isSubmitting: boolean;
}

export function LocalUploadForm({
  onSubmit,
  folderPath,
  className,
  isSubmitting,
}: LocalUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [volumeName, setVolumeName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadStats, setUploadStats] = useState<{
    uploadedSize: number;
    totalSize: number;
    estimatedTime: number;
  } | null>(null);

  useEffect(() => {
    async function fetchVolumeName() {
      try {
        setIsLoading(true);
        const response = await api({
          url: "volume/name",
          init: { method: "GET" },
        });

        if (response?.volume_name) {
          setVolumeName(response.volume_name);
        } else {
          setError("Could not determine volume name for models");
        }
      } catch (err) {
        console.error("Error fetching volume name:", err);
        setError("Failed to get volume information");
      } finally {
        setIsLoading(false);
      }
    }

    fetchVolumeName();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setFilename(selectedFile.name);
    } else {
      setFilename("");
    }
  };

  const handleSubmit = async () => {
    if (!file || isSubmitting || !volumeName) return;

    try {
      setError(null);
      setUploadProgress(0);
      setUploadStats(null);

      // Use the uploadFileToVolume function to upload the file
      await uploadFileToVolume({
        volumeName,
        file,
        targetPath: `${folderPath}/${filename}`,
        apiEndpoint: process.env.COMFY_DEPLOY_SHARED_MACHINE_API_URL || "",
        onProgress: (progress, uploadedSize, totalSize, estimatedTime) => {
          setUploadProgress(progress);
          setUploadStats({ uploadedSize, totalSize, estimatedTime });
        },
      });

      // After successful upload, notify parent component
      onSubmit({
        source: "local",
        folderPath,
        filename,
        local: {
          originalFilename: file.name,
        },
      });
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload file");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <FolderPathDisplay path={folderPath} />

      {isLoading ? (
        <div className="text-center py-4">Loading volume information...</div>
      ) : error && !file ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="file-upload">Select Model File</Label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              disabled={isSubmitting}
              accept=".safetensors,.ckpt,.pt,.bin,.pth,.gguf"
            />
          </div>

          {file && (
            <div className="space-y-2">
              <Label htmlFor="filename">Save As</Label>
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter filename"
                disabled={isSubmitting}
              />
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              {uploadStats && (
                <div className="text-xs text-muted-foreground">
                  {formatBytes(uploadStats.uploadedSize)} of{" "}
                  {formatBytes(uploadStats.totalSize)} uploaded
                  {uploadStats.estimatedTime > 0 && (
                    <span>
                      {" "}
                      • {formatTime(uploadStats.estimatedTime)} remaining
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !file || !filename.trim() || !volumeName}
          >
            {isSubmitting ? "Uploading..." : "Upload"}
          </Button>
        </>
      )}
    </div>
  );
}
