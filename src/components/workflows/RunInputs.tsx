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
import { ExpandableText } from "../expantable-text";
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
