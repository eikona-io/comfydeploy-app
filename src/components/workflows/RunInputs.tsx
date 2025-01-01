import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ImageFallback } from "../image-fallback";

export function RunInputs({
  run,
}: {
  run: any;
}) {
  return (
    <>
      {run.workflow_inputs && (
        <Table className="table-fixed">
          <TableHeader className="sticky top-0">
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead className="">Input</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(run.workflow_inputs).map(([key, data]) => {
              return (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>
                    <ImageFallback
                      src={String(data)}
                      alt={key}
                      fallback={<ExpandableText text={String(data)} />}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </>
  );
}

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
        className="absolute right-0 bottom-0 bg-background px-1 text-muted-foreground text-xs hover:text-foreground"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
}
