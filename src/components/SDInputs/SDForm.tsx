"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { type FormEvent, type ReactNode } from "react";

type SDFormProps = {
  actionArea?: any;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  children?: ReactNode;
  hideChildren?: boolean;
  scrollAreaClassName?: string;
};

// To make the scrollArea work, the parent should be a display flex;
export const SDForm = React.forwardRef(
  (
    {
      actionArea,
      onSubmit,
      children,
      scrollAreaClassName,
      hideChildren,
    }: SDFormProps,
    ref,
  ) => {
    return (
      <form className="flex w-full flex-col gap-2" onSubmit={onSubmit}>
        {!hideChildren && (
          <ScrollArea className={scrollAreaClassName || "max-h-[400px]"}>
            <div className="flex w-full flex-col gap-2 px-1 pb-2">
              {children}
            </div>
          </ScrollArea>
        )}
        {actionArea}
      </form>
    );
  },
);
