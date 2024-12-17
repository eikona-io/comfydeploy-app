import { useEffect, type RefObject } from "react";

export function useInfiniteScroll(
    ref: RefObject<HTMLElement | null>,
    fetchNextPage: () => void,
    hasNextPage: boolean | undefined,
    isFetchingNextPage: boolean,
) {
    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const { scrollTop, scrollHeight, clientHeight } = ref.current;
                if (scrollHeight - scrollTop <= clientHeight * 1.5) {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }
            }
        };

        const currentRef = ref.current;
        if (currentRef) {
            currentRef.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener("scroll", handleScroll);
            }
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, ref]);
}