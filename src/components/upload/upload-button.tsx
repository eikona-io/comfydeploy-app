import { useUploadStore } from "@/stores/upload-store";
import { Upload } from "lucide-react";
import { Button } from "../ui/button";

interface UploadButtonProps {
  className?: string;
}

export function UploadButton({ className }: UploadButtonProps) {
  const fileInput = useUploadStore((state) => state.fileInput);
  const isUploading = useUploadStore((state) => state.isUploading);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => fileInput?.click()}
      disabled={isUploading}
      className={className}
    >
      <Upload className="mr-2 h-4 w-4" />
      Upload Asset
    </Button>
  );
}
