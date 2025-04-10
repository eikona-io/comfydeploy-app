import { flexRender, type Table } from "@tanstack/react-table";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import {
  Table as ParentTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { forwardRef } from "react";
import type { Secret } from "@/stores/update-secrets";

interface Props {
  table: Table<Secret>;
  colSpan: number;
  isMachinesPage?: boolean;
  selectedId?: string;
}

export const ScrollTable = forwardRef<HTMLDivElement, Props>(
  ({ table, colSpan, isMachinesPage, selectedId }, ref) => {
    return (
      <ScrollArea
        className="w-full overflow-x-auto rounded-md border"
        ref={ref}
      >
        <ParentTable>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={
                      isMachinesPage && selectedId === row.id
                        ? "bg-muted/50"
                        : ""
                    }
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id}>
                          {cell.getContext().cell.row.original.id &&
                          cell.getContext().cell.row.original.id.length > 0 ? (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )
                          ) : (
                            <Skeleton
                              className="my-2 h-4 w-44"
                              style={{
                                width: cell.column.columnDef.size,
                              }}
                            />
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={colSpan} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ParentTable>
      </ScrollArea>
    );
  },
);
