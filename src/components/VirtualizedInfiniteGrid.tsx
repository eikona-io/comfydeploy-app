import { cn } from "@/lib/utils";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import type React from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useResizeObserver from "use-resize-observer";

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), wait);
  };
}

interface VirtualizedInfiniteGridProps<T> {
  queryResult: UseInfiniteQueryResult<InfiniteData<T[], unknown>, unknown>;
  renderItem: (item: T) => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  estimateSize?: number;
  className?: string;
  blurDuringResize?: boolean;
  minColumnWidth?: number; // New prop for minimum column width
}

export function VirtualizedInfiniteGrid<T extends { output_id: string }>({
  queryResult,
  renderItem,
  renderLoading = () => <div>Loading...</div>,
  estimateSize = 200,
  className,
  blurDuringResize = true,
  minColumnWidth = 250, // Default minimum column width
}: VirtualizedInfiniteGridProps<T>) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = queryResult;
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [itemHeights, setItemHeights] = useState<{ [key: string]: number }>({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [measuredItems, setMeasuredItems] = useState<Set<string>>(new Set());

  const parentOffsetRef = useRef(0);

  const [columnCount, setColumnCount] = useState(1);

  const columnVirtualizer = useVirtualizer({
    count: columnCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => parentOffsetRef.current / columnCount,
    horizontal: true,
  });

  const [columnHeights, setColumnHeights] = useState<number[]>(
    Array(columnCount).fill(0),
  );

  const [containerWidth, setContainerWidth] = useState(0);

  const { ref: resizeRef } = useResizeObserver<HTMLDivElement>({
    onResize: ({ width }) => {
      if (width) {
        setIsResizing(true);
        parentOffsetRef.current = width;
        setContainerWidth(width);

        // Calculate new column count
        const newColumnCount = Math.max(1, Math.floor(width / minColumnWidth));
        setColumnCount(newColumnCount);

        // Clear any existing timeout
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }

        // Set a new timeout
        const newTimeout = setTimeout(() => {
          setIsResizing(false);
          columnVirtualizer.measure();
          rowVirtualizer.measure();
          debouncedMeasureAllItems();
        }, 200); // Adjust this delay as needed

        setResizeTimeout(newTimeout);
      }
    },
  });

  const [isResizing, setIsResizing] = useState(false);
  const [resizeTimeout, setResizeTimeout] = useState<Timer | null>(null);

  useEffect(() => {
    if (isResizing) {
      const timer = setTimeout(() => {
        setIsResizing(false);
      }, 200); // Adjust this delay as needed

      return () => clearTimeout(timer);
    }
  }, [containerWidth, isResizing]);

  const setItemHeight = useCallback(
    (id: string, height: number, columnIndex: number) => {
      setItemHeights((prev) => {
        if (prev[id] === height) return prev;
        return { ...prev, [id]: height };
      });
      setColumnHeights((prev) => {
        const newHeights = [...prev];
        newHeights[columnIndex] += height;
        return newHeights;
      });
    },
    [],
  );

  const measureItem = useCallback(
    (id: string, columnIndex: number) => {
      const el = itemRefs.current[id];
      if (el) {
        const height = el.getBoundingClientRect().height;
        setItemHeight(id, height, columnIndex);
        setMeasuredItems((prev) => new Set(prev).add(id));
      }
    },
    [setItemHeight],
  );

  const flatData = useMemo(() => data?.pages.flat() ?? [], [data]);

  const rowCount = Math.ceil(flatData.length / columnCount);

  const rowVirtualizer = useVirtualizer({
    count: rowCount + (hasNextPage ? 1 : 0),
    getScrollElement: () => parentRef.current,
    overscan: 5,
    getItemKey: (index) => {
      const itemIndex = index * columnCount;
      return flatData[itemIndex]?.output_id ?? `loading-${index}`;
    },
    estimateSize: (index) => {
      const itemIndex = index * columnCount;
      const item = flatData[itemIndex];
      const height = item
        ? itemHeights[item.output_id] || estimateSize
        : estimateSize;
      return height;
    },
  });

  const debouncedMeasureAllItems = useMemo(
    () =>
      debounce(() => {
        Object.entries(itemRefs.current).forEach(([id, el], index) => {
          if (el) {
            const columnIndex = index % columnCount;
            measureItem(id, columnIndex);
          }
        });
        rowVirtualizer.measure();
      }, 100),
    [measureItem, rowVirtualizer, columnCount],
  );

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.clientWidth ?? 0;
    columnVirtualizer.measure();
    rowVirtualizer.measure();
  }, []);

  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useLayoutEffect(() => {
    if (measuredItems.size > 0) {
      rowVirtualizer.measure();
      setMeasuredItems(new Set());
    }
  }, [measuredItems, rowVirtualizer]);

  useEffect(() => {
    const lastItem = rowVirtualizer.getVirtualItems().at(-1);
    if (!lastItem) return;

    if (
      lastItem.index >= rowCount - 1 &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isLoadingMore
    ) {
      setIsLoadingMore(true);
      fetchNextPage().finally(() => setIsLoadingMore(false));
    }
  }, [
    hasNextPage,
    fetchNextPage,
    rowCount,
    isFetchingNextPage,
    rowVirtualizer,
    isLoadingMore,
  ]);

  useEffect(() => {
    debouncedMeasureAllItems();
  }, [containerWidth, debouncedMeasureAllItems]);

  // Add this condition to check if there's no data
  if (flatData.length === 0) {
    return (
      <div className={cn(className, "flex h-full items-center justify-center")}>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div
      ref={(el) => {
        parentRef.current = el;
        resizeRef(el);
      }}
      className={cn(
        className,
        "overflow-y-auto",
        blurDuringResize &&
          isResizing &&
          "blur-3xl transition-all duration-100",
      )}
      style={{ height: "100%", width: "100%" }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: `${columnVirtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {columnVirtualizer.getVirtualItems().map((virtualColumn) => (
          <div
            key={virtualColumn.index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${virtualColumn.size}px`,
              height: "100%",
              transform: `translateX(${virtualColumn.start}px)`,
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const itemIndex =
                virtualRow.index * columnCount + virtualColumn.index;
              const item = flatData[itemIndex];

              if (!item && virtualRow.index === rowCount) {
                return hasNextPage && renderLoading();
              }
              if (!item) return null;

              // Calculate the Y offset for the cell
              const cellYOffset = flatData
                .slice(0, itemIndex)
                .filter(
                  (_, index) => index % columnCount === virtualColumn.index,
                )
                .reduce(
                  (sum, item) =>
                    sum + (itemHeights[item.output_id] || estimateSize),
                  0,
                );

              return (
                <div
                  key={(item as any).output_id}
                  ref={(el) => {
                    itemRefs.current[(item as any).output_id] = el;
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "auto",
                    transform: `translateY(${cellYOffset}px)`, // Use the calculated cellYOffset
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  {renderItem({
                    ...item,
                    onLoad: () => {
                      measureItem((item as any).output_id, virtualColumn.index);
                    },
                    containerWidth,
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
