import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useAPIKeyList } from "@/hooks/use-user-settings";
import { getRelativeTime } from "@/lib/get-relative-time";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { ApiKeyAdd } from "./api-key-add";
import { deleteAPIKey } from "./api-key-api";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export type APIKey = {
  id: string;
  key: string;
  name: string;
  user_id: string;
  org_id: string | null;
  revoked: boolean;
  created_at: Date;
  updated_at: Date;
};

export function APIKeyList() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [debouncedSearchValue] = useDebounce(searchValue, 250);

  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAPIKeyList(debouncedSearchValue ?? "");

  const parentRef = useRef<HTMLDivElement>(null);
  useInfiniteScroll(parentRef, fetchNextPage, hasNextPage, isFetchingNextPage);

  const flatData = useMemo(() => data?.pages.flat() ?? [], [data]);
  console.log(flatData);

  useEffect(() => {
    refetch();
  }, [debouncedSearchValue]);

  const columns = useMemo<ColumnDef<APIKey>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <button type="button" className="flex items-center ">
              Name
            </button>
          );
        },
        cell: ({ row }) => {
          return <span className="ml-3">{row.getValue("name")}</span>;
        },
        enableSorting: false,
      },
      {
        accessorKey: "endpoint",
        header: () => <div className="text-left">Key</div>,
        cell: ({ row }) => {
          return (
            <div className="text-left font-medium">{row.original.key}</div>
          );
        },
      },
      {
        accessorKey: "date",
        enableSorting: false,
        header: ({ column }) => {
          return (
            <button
              type="button"
              className="flex w-full items-center justify-end "
            >
              Update Date
            </button>
          );
        },
        cell: ({ row }) => (
          <div className="text-right capitalize">
            {getRelativeTime(row.original.updated_at)}
          </div>
        ),
      },

      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const apiKey = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={async () => {
                    await deleteAPIKey(apiKey.id);
                    toast.success("API Key deleted");
                    refetch();
                  }}
                >
                  Delete API Key
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];
  }, [refetch]);

  console.log(data);
  const table = useReactTable({
    data: flatData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    state: {
      sorting,
    },
  });

  return (
    <div className="h-full w-full px-2 pb-4 md:px-10">
      <div className="mx-auto grid h-full max-h-[90%] grid-rows-[auto,1fr,auto]">
        <div className="flex items-center gap-2 py-4">
          <Input
            placeholder="Filter API keys..."
            value={searchValue ?? ""}
            onChange={(event) => {
              if (event.target.value === "") {
                setSearchValue(null);
              } else {
                setSearchValue(event.target.value);
              }
            }}
            className="max-w-sm"
          />
          <div className="ml-auto flex gap-2">
            <ApiKeyAdd onKeyCreated={() => refetch()} />
          </div>
        </div>
        <ScrollArea
          className="w-full overflow-x-auto rounded-md border"
          ref={parentRef}
        >
          <Table>
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
                  console.log(row.getVisibleCells());
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell key={cell.id}>
                            {cell.getContext().cell.row.original.id &&
                            cell.getContext().cell.row.original.id.length >
                              0 ? (
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
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
