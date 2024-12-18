import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const BATCH_SIZE = 20;

export function useMachines(debouncedSearchValue?: string) {
  return useInfiniteQuery<any[]>({
    queryKey: ["machines"],
    meta: {
      limit: BATCH_SIZE,
      offset: 0,
      params: {
        search: debouncedSearchValue ?? "",
        is_deleted: false,
      },
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length === BATCH_SIZE
        ? allPages?.length * BATCH_SIZE
        : undefined;
    },
    initialPageParam: 0,
    refetchInterval: 5000,
  });
}

export function useMachinesAll() {
  return useQuery<any[]>({
    queryKey: ["machines", "all"],
    refetchInterval: 5000,
  });
}

export function useMachineEvents(machine_id: string) {
  return useQuery<any[]>({
    queryKey: ["machine", machine_id, "events"],
    refetchInterval: 5000,
  });
}
