import { useUploadStore } from "@/stores/upload-store";
import { Progress } from "../ui/progress";

interface UploadProgressProps {
  className?: string;
}

export function UploadProgress({ className }: UploadProgressProps) {
  const progress = useUploadStore((state) => state.progress);

  if (progress === null) return null;

  return (
    <div
      className={`w-[200px] rounded-md border bg-white p-2 shadow-sm ${className}`}
    >
      <Progress value={progress} className="h-2" />
      <p className="mt-1 text-xs text-gray-500">
        Uploading... {Math.round(progress)}%
      </p>
    </div>
  );
}
