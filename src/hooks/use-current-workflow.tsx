"use client";

import { useQuery } from "@tanstack/react-query";

export function useCurrentWorkflow(workflow_id: string | null) {
  const {
    data: workflow,
    isLoading,
    refetch: mutate,
    status,
  } = useQuery<any>({
    enabled: !!workflow_id,
    queryKey: ["workflow", workflow_id],
  });

  return {
    workflow,
    mutateWorkflow: mutate,
    isValidating: status === "pending",
    isLoading: isLoading,
  };
}
