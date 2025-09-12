"use client";

import { File as FileIcon, Paperclip, Trash } from "lucide-react";
import React, {
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type SDFileInputProps = {
  label?: string;
  className?: string;
  inputClasses?: string;
  file: File | string | undefined;
  multiple?: boolean;
  accept?: string;
  onChange: (file: File | string | undefined | FileList) => void;
  header?: ReactNode;
};

export function SDFileInput({
  label,
  className,
  inputClasses,
  file,
  onChange,
  accept = "*/*",
  header,
}: SDFileInputProps) {
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dropElement = dropRef.current;
    if (!dropElement) {
      return;
    }

    const handleDrop = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      const dragEvent = e as unknown as DragEvent;
      const files = dragEvent.dataTransfer?.files;
      if (files?.length) {
        onChange(files[0]);
      }
    };

    const handleDragOver = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    dropElement.addEventListener("dragover", handleDragOver);
    dropElement.addEventListener("drop", handleDrop);

    return () => {
      dropElement.removeEventListener("dragover", handleDragOver);
      dropElement.removeEventListener("drop", handleDrop);
    };
  }, [onChange]);

  function onDelete() {
    if (!file) {
      return;
    }
    onChange(undefined);
  }

  // Check if there's a file selected
  const hasFileInput =
    file &&
    typeof file === "object" &&
    "name" in file &&
    "size" in file &&
    "type" in file;

  return (
    <div className={className} ref={dropRef}>
      {header}
      <div className={`${inputClasses} flex gap-1`}>
        {!hasFileInput && (
          <div className="flex w-full flex-col gap-2">
            <div className="flex gap-1">
              <Input
                className="rounded-[8px]"
                placeholder="Type your URL or drop a file"
                value={String(file || "")}
                onChange={(e) => onChange(e.target.value)}
              />

              <Label
                htmlFor={`file-input-${label}`}
                className="flex items-center justify-center"
              >
                <div
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      className:
                        "cursor-pointer rounded-[8px] transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50",
                    }),
                  )}
                >
                  <Paperclip size={18} />
                </div>
              </Label>
              <Input
                id={`file-input-${label}`}
                accept={accept}
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (!e?.target.files) {
                    return;
                  }
                  onChange(e.target.files[0]);
                }}
                type="file"
              />
            </div>
          </div>
        )}

        {hasFileInput && (
          <div className="flex w-full items-center justify-between rounded-[8px] border border-gray-200 px-2 py-1 dark:border-gray-700">
            <div className="flex flex-auto items-center gap-2">
              <FileIcon className="h-4 w-4 text-gray-400 shrink-0" />
              <p className="line-clamp-1 font-medium text-xs">
                {(file as File).name}
              </p>
              <span className="text-gray-500 text-xs whitespace-nowrap">
                ({Math.round(((file as File).size || 0) / 1024)} KB)
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={onDelete}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onDelete();
                  }
                }}
              >
                <Trash className="text-red-700 hover:text-red-600" size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
