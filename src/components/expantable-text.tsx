import { cn } from "@/lib/utils";
import { Clipboard } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
    <div className="relative max-w-full pb-6">
      <div
        className={cn(isExpanded ? undefined : "line-clamp-3", "break-words")}
      >
        {text}
      </div>
      <div className="absolute right-0 bottom-0 flex gap-1">
        <button
          type="button"
          className="bg-background px-1 text-muted-foreground text-xs hover:text-foreground"
          onClick={() => {
            navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard", { duration: 1000 });
          }}
        >
          <Clipboard className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="bg-background px-1 text-muted-foreground text-xs hover:text-foreground"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      </div>
    </div>
  );
}
