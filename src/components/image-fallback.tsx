import { cn } from "@/lib/utils";
import { useState } from "react";

type ImageFallbackProps = {
  src: string;
  fallback: React.ReactNode;
  className?: string;
  alt?: string;
  onError?: (e: Error) => void;
};

export function ImageFallback({
  src,
  fallback,
  className,
  alt,
  onError,
}: ImageFallbackProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  if (error) {
    return fallback;
  }

  return (
    <img
      style={{
        display: loading ? "none" : "block",
      }}
      src={src}
      onError={() => {
        if (onError) {
          onError(new Error("Image failed to load"));
        }
        setError(true);
      }}
      onLoad={() => {
        setLoading(false);
      }}
      className={cn("aspect-square w-[200px] object-contain", className)}
      alt={alt || "image"}
    />
  );
}
