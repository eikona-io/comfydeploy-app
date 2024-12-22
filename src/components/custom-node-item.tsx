"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ExternalLink, GripHorizontal } from "lucide-react";
import type * as React from "react";

export function CustomNodeItem(props: {
  id?: string;
  index?: number;
  title: string;
  description?: React.ReactNode;
  url?: string;
  actions?: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id ? `${props.id}` : "" });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="grid w-full grid-cols-[1fr,auto] items-center gap-4 px-4"
      ref={setNodeRef}
      style={style}
    >
      <div className="flex items-center gap-4">
        {props.id && (
          <div {...attributes} {...listeners}>
            <GripHorizontal size={14} />
          </div>
        )}
        {props.index !== undefined && (
          <div className="aspect-square h-6 w-6 rounded-full bg-gray-200 text-center dark:bg-primary-foreground">
            {props.index}
          </div>
        )}
        <div className="flex w-full flex-col">
          {props.url ? (
            <a
              target="_blank"
              href={props.url}
              className="flex items-center gap-2 truncate font-bold hover:underline"
              rel="noreferrer"
            >
              <ExternalLink size={12} /> {props.title}
            </a>
          ) : (
            <div className="truncate font-bold">{props.title}</div>
          )}
          <div className="text-2xs text-primary/50">{props.description}</div>
        </div>
      </div>

      {props.actions}
    </div>
  );
}
