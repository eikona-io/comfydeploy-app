import { useInfiniteQuery } from "@tanstack/react-query";

const BATCH_SIZE = 20;

export function useSharedWorkflows(
  debouncedSearchValue: string = "",
  user_id: string = "",
  limit: number = BATCH_SIZE,
) {
  return useInfiniteQuery<any[]>({
    queryKey: ["shared-workflows"],
    queryKeyHashFn: (queryKey) => {
      return [...queryKey, debouncedSearchValue, limit, user_id].join(",");
    },
    meta: {
      limit: limit,
      offset: 0,
      params: {
        search: debouncedSearchValue ?? "",
        user_id: user_id,
      },
    },
    getNextPageParam: (lastPage, allPages) => {
      if (
        lastPage &&
        Array.isArray(lastPage) &&
        lastPage.length === BATCH_SIZE
      ) {
        return allPages.length * BATCH_SIZE;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
}
