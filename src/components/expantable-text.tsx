import { cn } from "@/lib/utils";
import { useState } from "react";

interface ExpandableTextProps {
  text: string;
  threshold?: number;
}

export function ExpandableText({ text, threshold = 100 }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= threshold) {
    return <div className="break-words">{text}</div>;
  }

  return (
    <div className="relative max-w-full">
      <div
        className={cn(isExpanded ? undefined : "line-clamp-3", "break-words")}
      >
        {text}
      </div>
      <button
        type="button"
        className="absolute right-0 bottom-0 bg-background px-1 text-muted-foreground text-xs hover:text-foreground"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
}
