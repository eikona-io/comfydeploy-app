import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { LoadingIcon } from "./loading-icon";

export function LoadingWrapper(props: {
  tag: string;
  children?: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex w-full items-center justify-center gap-2 py-4 text-sm">
          Fetching {props.tag} <LoadingIcon />
        </div>
      }
    >
      {props.children}
    </Suspense>
  );
}

export function LoadingPageWrapper(props: {
  tag: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center gap-2 py-4 text-sm",
        props.className,
      )}
    >
      Fetching {props.tag} <LoadingIcon />
    </div>
  );
}
