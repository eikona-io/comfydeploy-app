import { api } from "@/lib/api";
import { queryClient } from "@/lib/providers";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// Helper function for non-hook usage with the dedicated client
export async function getBranchInfo(gitUrl: string): Promise<BranchInfoData> {
  return queryClient.fetchQuery({
    queryKey: ["branch-info"],
    queryKeyHashFn: (queryKey) => [...queryKey, gitUrl].toString(),
    meta: {
      params: { git_url: gitUrl },
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
  });
}

// Hook version
export function useGithubBranchInfo(gitUrl: string) {
  return useQuery({
    queryKey: ["branch-info"],
    queryKeyHashFn: (queryKey) => [...queryKey, gitUrl].toString(),
    meta: {
      params: { git_url: gitUrl },
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
  });
}

const BranchInfoSchema = z.object({
  commit: z.object({
    sha: z.string(),
    commit: z.object({
      message: z.string(),
      // TODO: committer obj: this makes types work in custom-node-setup.tsx but doesn't match the API responsee
      committer: z.object({
        name: z.string(),
        email: z.string(),
        date: z.string(),
      }),
    }),
    html_url: z.string(),
  }),
  stargazers_count: z.number(),
});

export type BranchInfoData = z.infer<typeof BranchInfoSchema>;

type GitUrl<T extends string | string[]> = T;
type BranchInfoResult<T extends string | string[]> = T extends string[]
  ? BranchInfoData[]
  : BranchInfoData;

export function useBranchInfoQuery<T extends string | string[]>(
  gitUrl?: GitUrl<T>,
) {
  const urls = Array.isArray(gitUrl) ? gitUrl : [gitUrl];

  const queries = useQueries({
    queries: [
      ...urls.map((url) => ({
        queryKey: ["branch-info", url],
        queryFn: async () => {
          const result = await api({
            url: "branch-info",
            params: { git_url: url },
          });
          return result;
        },
      })),
    ],
  });

  return {
    data: queries.map((query) => query.data) as BranchInfoResult<T>,
    isLoading: queries.some((query) => query.isLoading),
    error: queries.find((query) => query.error)?.error,
  };
}

interface BranchInfoProps<T extends string | string[]> {
  gitUrl?: GitUrl<T>;
}

export function useBranchInfo<T extends string | string[]>({
  gitUrl,
}: BranchInfoProps<T>) {
  const { data, error, isLoading } = useBranchInfoQuery<T>(gitUrl);
  const [toastId, setToastId] = useState<string | number>();

  useEffect(() => {
    if (isLoading && !toastId) {
      setToastId(toast.loading("Fetching repo info..."));
    }

    if (error) {
      toast.dismiss(toastId);
      toast.error(`Failed to fetch branch info: ${error.message}`);
      console.error(error);
    }

    if (data) {
      toast.dismiss(toastId);
    }

    return () => {
      if (toastId) {
        toast.dismiss(toastId);
        setToastId(undefined);
      }
    };
  }, [data, error, isLoading]);

  if (!gitUrl)
    return {
      data: null,
      error: "No git url provided",
      isLoading: false,
    };

  return {
    data,
    error,
    isLoading,
  };
}

/**
 * Hook to check if a hash is older than another hash
 * @param currentHash - The hash to check
 * @param targetHash - The hash to compare against
 * @param enabled - Whether to run the query
 */
export function useIsHashOlder(
  currentHash?: string,
  targetHash?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["is-hash-older", currentHash, targetHash],
    queryFn: () => isHashOlder(currentHash!, targetHash!),
    enabled: enabled && !!currentHash && !!targetHash,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

/**
 * Check if a commit hash is older than another hash using GitHub API
 * @param currentHash - The hash to check
 * @param targetHash - The hash to compare against
 * @returns Promise<boolean> - true if currentHash is older than targetHash
 */
export async function isHashOlder(
  currentHash: string,
  targetHash: string,
): Promise<boolean> {
  try {
    const compareUrl = `https://api.github.com/repos/comfyanonymous/ComfyUI/compare/${targetHash}...${currentHash}`;

    const response = await fetch(compareUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "ComfyDeploy-App",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data.status === "behind" || data.behind_by > 0;
  } catch (error) {
    console.error("Error comparing git hashes:", error);
    return false; // Default to false on error
  }
}

// ComfyUI version hashes
export const COMFYUI_VERSION_HASHES = {
  "0.3.45": "9a470e073e2742d4edd6e7ea1ce28d861a77d9c4",
} as const;
