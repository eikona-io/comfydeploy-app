import { api } from "@/lib/api";
import { queryClient } from "@/lib/providers";
import { QueryClient, useQueries, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// const githubQueryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 1000 * 60 * 60, // 1 hour
//       gcTime: 1000 * 60 * 60 * 24, // 24 hours
//       retry: 2,
//     },
//   },
// });

// function fetchBranchInfo(gitUrl: string) {
//   return api({
//     url: "branch-info",
//     params: { git_url: gitUrl },
//   });
// }

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
