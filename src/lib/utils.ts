import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getOptimizedImageUrl, extractS3Key } from "./image-optimization";
import { useAuthStore } from "./auth-store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the resolved theme (actual dark/light theme)
 * Handles "system" theme by checking the user's system preference
 * @param theme - The theme value from useTheme hook ("dark" | "light" | "system")
 * @returns "dark" | "light" - The actual resolved theme
 */
export function getResolvedTheme(
  theme: "dark" | "light" | "system",
): "dark" | "light" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

/**
 * Check if the current theme should use dark mode
 * @param theme - The theme value from useTheme hook
 * @returns boolean - true if dark theme should be used
 */
export function isDarkTheme(theme: "dark" | "light" | "system"): boolean {
  return getResolvedTheme(theme) === "dark";
}

export function formatFileSize(fileSize: number) {
  let sizeString: string;
  if (fileSize >= 1073741824) {
    sizeString = `${(fileSize / 1073741824).toFixed(2)} GB`;
  } else if (fileSize >= 1048576) {
    sizeString = `${(fileSize / 1048576).toFixed(2)} MB`;
  } else if (fileSize >= 1024) {
    sizeString = `${(fileSize / 1024).toFixed(2)} KB`;
  } else {
    sizeString = `${fileSize} bytes`;
  }
  return sizeString;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / k ** i).toFixed(dm)} ${sizes[i]}`;
}

export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  }
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

export function isCustomBucket(url: string) {
  return url.includes("X-Amz-Algorithm");
}

export function isGif(url: string) {
  return url.toLowerCase().endsWith(".gif");
}

export const getOptimizedImage = (
  url: string,
  isSmallView = false,
  authToken?: string | null,
) => {
  // Skip if the url is from custom bucket or is a GIF file
  if (isGif(url)) return url;

  // Use new image optimization system
  const s3Key = extractS3Key(url);
  const quality = isSmallView ? 30 : 75;
  const transformations = `q_${quality},f_webp`;
  const optimizedUrl = getOptimizedImageUrl(s3Key, transformations);

  // Include auth token for private/custom buckets so optional-auth route can authenticate
  if (authToken) {
    const separator = optimizedUrl.includes("?") ? "&" : "?";
    return `${optimizedUrl}${separator}cd_token=${encodeURIComponent(authToken)}`;
  }

  return optimizedUrl;
};
