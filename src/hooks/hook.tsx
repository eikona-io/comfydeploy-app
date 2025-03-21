"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useMatch, useMatchRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { getOrgPathInfo } from "@/utils/org-path";
import { useAuth } from "@clerk/clerk-react";
import { useClerk } from "@clerk/clerk-react";
import { useSearch } from "@tanstack/react-router";
import { parseAsString } from "nuqs";
import { useQueryState } from "nuqs";

export function useWorkflowIdInSessionView() {
  const match = useMatch({
    from: "/workflows/$workflowId/$view",
    shouldThrow: false,
  });
  const match2 = useMatch({
    from: "/sessions/$sessionId/",
    shouldThrow: false,
  });
  if (match) {
    return match.params.workflowId;
  }
  return match2?.search.workflowId;
}

export function useSessionIdInSessionView() {
  const match = useMatch({
    from: "/sessions/$sessionId/",
    shouldThrow: false,
  });
  const [sessionId] = useQueryState("sessionId", parseAsString);

  if (sessionId) {
    return sessionId;
  }
  return match?.params.sessionId;
}

export function useWorkflowIdInWorkflowPage() {
  const location = useLocation();
  const pathname = location.pathname;
  const chunks = pathname.split("/").filter(Boolean);
  const { orgId, orgSlug } = useAuth();

  const { case1Match, case2Match, pathParts, pathWithoutOrg } = getOrgPathInfo(
    orgSlug ?? null,
    pathname.replace("//", "/"),
  );

  let parentPath = chunks[0];

  const clerk = useClerk();
  const personalOrg = clerk.user?.username ?? "personal";

  let workflowId = null;

  if (case2Match) {
    parentPath = chunks[2];
    if (parentPath === "workflows") {
      workflowId = chunks[3];
    }
  } else {
    parentPath = chunks[0];
    if (parentPath === "workflows") {
      workflowId = chunks[1];
    }
  }

  return workflowId;

  // const matchRoute = useMatchRoute();
  // const params = matchRoute({
  //   to: "/$type/$orgId/workflows/$workflowId/$view",
  // });
  // if (!params) {
  //   return null;
  // }
  // return params.workflowId;
}

export function useAssetList(path = "/") {
  return useQuery({
    queryKey: ["assets", path],
    queryFn: async () => {
      const response = await api({
        url: "assets",
        params: { path },
      });
      return response;
    },
  });
}

export function useAssetUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      parent_path = "/",
      onProgress,
    }: {
      file: File;
      parent_path?: string;
      onProgress?: (progress: number) => void;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("parent_path", parent_path);

      return await api({
        url: "assets/upload",
        skipDefaultHeaders: true,
        init: {
          method: "POST",
          body: formData,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable && onProgress) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            onProgress(progress);
          }
        },
      });
    },
    onSuccess: (data, variables) => {
      // Update the asset list query data
      queryClient.setQueryData<any[]>(
        ["assets", variables.parent_path],
        (old) => {
          if (!old) return [data];
          return [...old, data];
        },
      );

      // Also invalidate the query to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      parent_path = "/",
    }: {
      name: string;
      parent_path?: string;
    }) => {
      return await api({
        url: "assets/folder",
        init: {
          method: "POST",
          body: JSON.stringify({ name, parent_path }),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assetId: string) => {
      return await api({
        url: `assets/${assetId}`,
        init: {
          method: "DELETE",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}
