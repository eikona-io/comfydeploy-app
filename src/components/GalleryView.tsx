"use client";

import { FileURLRender } from "@/components/workflows/OutputRender";
import { cn } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { VirtualizedInfiniteGrid } from "./VirtualizedInfiniteGrid";

type GalleryViewProps = {
  workflowID: string;
  className?: string;
  paginationClassName?: string;
};

type setOpenImage = {
  fileURLs: string[];
  runID: string;
  duration: number;
};

const BATCH_SIZE = 20;

export function useGalleryData(workflow_id: string) {
  return useInfiniteQuery<any[]>({
    queryKey: ["workflow", workflow_id, "gallery"],
    meta: {
      limit: BATCH_SIZE,
      offset: 0,
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length === BATCH_SIZE
        ? allPages?.length * BATCH_SIZE
        : undefined;
    },
    initialPageParam: 0,
  });
}

export function GalleryView({
  workflowID,
  className,
  paginationClassName,
}: GalleryViewProps) {
  const query = useGalleryData(workflowID);

  return (
    <VirtualizedInfiniteGrid
      queryResult={query}
      renderItem={(output) => {
        const outputUrl =
          output.data?.images?.[0]?.url ||
          output.data?.gifs?.[0]?.url ||
          output.data?.mesh?.[0]?.url ||
          "";

        return (
          <FileURLRender
            onLoad={output.onLoad}
            url={outputUrl}
            imgClasses="w-full h-full object-contain max-w-full"
          />
        );
      }}
      renderLoading={() => <div>Loading more...</div>}
      estimateSize={200} // Adjust this based on your expected row height
      // className="w-[calc(100%+5rem)] h-full -mx-6 md:-mx-10"
      className={cn("h-full w-full", className)}
    />
  );
}
