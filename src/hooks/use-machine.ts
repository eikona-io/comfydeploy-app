import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { Machine, MachineListItem } from "@/types/machine";

const BATCH_SIZE = 20;

// NOTE: consider refactoring to use options object as input
export function useMachines(
  debouncedSearchValue?: string,
  batchSize: number = BATCH_SIZE,
  limit?: number,
  include_has_workflows?: boolean,
  is_workspace = false,
  is_self_hosted = false,
  is_docker = false,
  include_docker_command_steps = false,
) {
  return useInfiniteQuery<MachineListItem[]>({
    queryKey: ["machines"],
    meta: {
      limit: limit ?? batchSize,
      offset: 0,
      params: {
        search: debouncedSearchValue ?? "",
        is_deleted: false,
        include_has_workflows: include_has_workflows ?? false,
        is_docker,
        is_workspace,
        is_self_hosted,
        include_docker_command_steps,
      },
    },
    queryKeyHashFn: (queryKey) =>
      [
        ...queryKey,
        debouncedSearchValue ?? "",
        batchSize,
        is_workspace,
        is_self_hosted,
        is_docker,
      ].toString(),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length === batchSize
        ? allPages?.length * batchSize
        : undefined;
    },
    initialPageParam: 0,
    refetchInterval: 5000,
  });
}

export function useMachinesAll() {
  return useQuery<MachineListItem[]>({
    queryKey: ["machines", "all"],
    refetchInterval: 5000,
  });
}

export function useMachine(machine_id?: string) {
  return useQuery<Machine>({
    enabled: !!machine_id,
    queryKey: ["machine", machine_id],
  });
}

export function useMachineEvents(machine_id: string) {
  return useQuery<any[]>({
    queryKey: ["machine", machine_id, "events"],
    refetchInterval: 5000,
  });
}

export function useMachineVersions(machine_id: string) {
  return useInfiniteQuery<any[]>({
    queryKey: ["machine", "serverless", machine_id, "versions"],
    meta: {
      limit: BATCH_SIZE,
      offset: 0,
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length === BATCH_SIZE
        ? allPages?.length * BATCH_SIZE
        : undefined;
    },
    enabled: !!machine_id,
    initialPageParam: 0,
    refetchInterval: 5000,
  });
}

export function useMachineVersionsAll(machine_id: string) {
  return useQuery<any[]>({
    queryKey: ["machine", "serverless", machine_id, "versions", "all"],
    refetchInterval: 5000,
    enabled: !!machine_id,
  });
}

export function useMachineVersion(
  machine_id: string,
  machine_version_id: string,
) {
  return useQuery<any>({
    enabled: !!machine_id && !!machine_version_id,
    queryKey: [
      "machine",
      "serverless",
      machine_id,
      "versions",
      machine_version_id,
    ],
    refetchInterval: 5000,
  });
}
