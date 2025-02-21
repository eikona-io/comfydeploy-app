import { PaddingLayout } from "@/components/PaddingLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { FolderTree } from "@/components/models/folder-tree";

export const Route = createFileRoute("/models")({
  component: StoragePage,
});

export function StoragePage() {
  return (
    <PaddingLayout className="flex h-full w-full gap-2 py-10">
      <div className="flex h-full flex-1 flex-col gap-2 rounded-md border border-gray-200 bg-muted/20 p-4">
        <Suspense
          fallback={
            <div className="flex h-full w-full flex-col gap-3">
              {Array.from({ length: 10 }, (_, i) => (
                <Skeleton
                  key={`skeleton-item-${i}-${Math.random()}`}
                  className="h-[18px] w-full"
                />
              ))}
            </div>
          }
        >
          <FolderTree />
        </Suspense>
      </div>
    </PaddingLayout>
  );
}
