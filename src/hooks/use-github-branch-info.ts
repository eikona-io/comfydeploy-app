import { api } from "@/lib/api";
import { QueryClient, useQuery } from "@tanstack/react-query";

const githubQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: 2,
    },
  },
});

function fetchBranchInfo(gitUrl: string) {
  return api({
    url: "branch-info",
    params: { git_url: gitUrl },
  });
}

// Helper function for non-hook usage with the dedicated client
export async function getBranchInfo(gitUrl: string) {
  return githubQueryClient.fetchQuery({
    queryKey: ["branch-info", gitUrl],
    queryFn: () => fetchBranchInfo(gitUrl),
  });
}
