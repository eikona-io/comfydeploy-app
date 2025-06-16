import { useInfiniteQuery } from "@tanstack/react-query";

const BATCH_SIZE = 20;

export function useSharedWorkflowList(
  debouncedSearchValue: string,
  user_ids: string = "", // format: "user_xxxxxx,user_yyyyyy"
  limit: number = BATCH_SIZE,
) {
  return useInfiniteQuery<any[]>({
    queryKey: ["shared-workflows"],
    queryKeyHashFn: (queryKey) => {
      return [...queryKey, debouncedSearchValue, limit, user_ids].join(",");
    },
    meta: {
      limit: limit,
      offset: 0,
      params: {
        search: debouncedSearchValue ?? "",
        user_ids: user_ids,
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
