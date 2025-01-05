import { useAssetUpload } from "@/hooks/hook";
import { Upload } from "lucide-react";
import { type ReactNode, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface AssetDropZoneProps {
  children: ReactNode;
  className?: string;
  showImportButton?: boolean;
  parentPath?: string;
  renderUploadButton?: (props: {
    onClick: () => void;
    disabled: boolean;
  }) => ReactNode;
}

export function AssetDropZone({
  children,
  className = "",
  showImportButton = true,
  parentPath = "/",
  renderUploadButton,
}: AssetDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: uploadAsset } = useAssetUpload();

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

  const handleFileImport = async (file: File) => {
    try {
      setUploadProgress(0);
      await uploadAsset({
        file,
        parent_path: parentPath,
        onProgress: (progress) => {
          setUploadProgress(progress);
        },
      });
      toast.success("File uploaded successfully");
    } catch (e) {
      toast.error("Error uploading file");
    } finally {
      setUploadProgress(null);
    }
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

  const defaultUploadButton = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => fileInputRef.current?.click()}
      disabled={uploadProgress !== null}
    >
      <Upload className="mr-2 h-4 w-4" />
      Upload Asset
    </Button>
  );

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
        onChange={handleFileSelect}
      />

      {showImportButton && (
        <>
          {renderUploadButton
            ? renderUploadButton({
                onClick: () => fileInputRef.current?.click(),
                disabled: uploadProgress !== null,
              })
            : defaultUploadButton}
          {uploadProgress !== null && (
            <div className="absolute top-4 right-4 w-[200px] rounded-md border bg-white p-2 shadow-sm">
              <Progress value={uploadProgress} className="h-2" />
              <p className="mt-1 text-xs text-gray-500">
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}
        </>
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
                Drop file here
              </p>
              <p className="mt-1 text-gray-500 text-sm">
                Release to upload asset
              </p>
            </div>
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
