import { QueryClient, useQuery } from "@tanstack/react-query";

// Create a dedicated QueryClient for GitHub API calls
const githubQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: 2,
    },
  },
});

interface RepoResponse {
  default_branch: string;
}

interface BranchInfoResponse {
  commit: {
    sha: string;
    commit: {
      message: string;
    };
  };
}

export const branchInfoKeys = {
  all: ["branchInfo"] as const,
  detail: (gitUrl: string) => [...branchInfoKeys.all, gitUrl] as const,
};

function extractRepoName(repoUrl: string) {
  const url = new URL(repoUrl);
  const pathParts = url.pathname.split("/");
  const repoName = pathParts[2].replace(".git", "");
  const author = pathParts[1];
  return `${author}/${repoName}`;
}

async function fetchBranchInfo(gitUrl: string) {
  const repoName = extractRepoName(gitUrl);

  const response = await fetch(`https://api.github.com/repos/${repoName}`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "User-Agent": "request",
    },
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  if (!data || typeof data.default_branch !== "string") {
    throw new Error("Invalid repo data format");
  }

  const repo = data as RepoResponse;

  const branchResponse = await fetch(
    `https://api.github.com/repos/${repoName}/branches/${repo.default_branch}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "User-Agent": "request",
      },
    },
  );

  if (!branchResponse.ok) {
    throw new Error(
      `GitHub API error: ${branchResponse.status} ${branchResponse.statusText}`,
    );
  }

  const branchData = await branchResponse.json();
  if (!branchData?.commit?.sha || !branchData?.commit?.commit?.message) {
    throw new Error("Invalid branch data format");
  }

  return branchData as BranchInfoResponse;
}

// Helper function for non-hook usage with the dedicated client
export async function getBranchInfo(gitUrl: string) {
  return githubQueryClient.fetchQuery({
    queryKey: branchInfoKeys.detail(gitUrl),
    queryFn: () => fetchBranchInfo(gitUrl),
  });
}

// Hook version if needed
export function useGithubBranchInfo(gitUrl: string) {
  return useQuery({
    queryKey: branchInfoKeys.detail(gitUrl),
    queryFn: () => fetchBranchInfo(gitUrl),
  });
}
