import { useDebounce } from "@/hooks/use-debounce";
import { type Secret, useUpdateSecrets } from "@/stores/update-secrets";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "./ui/input";
import { ScrollTable } from "./common/scroll-table";
import {
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { getRelativeTime } from "@/lib/get-relative-time";
import { AddSecret } from "./add-secret";

export const SecretsList = () => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 250);
  const { secrets, filteredSecrets, setFilteredSecrets, setSecrets } =
    useUpdateSecrets((state) => state);

  const parentRef = useRef<HTMLDivElement>(null);

  const columns = useMemo<ColumnDef<Secret>[]>(() => {
    return [
      {
        accessorKey: "id",
        header: ({ column }) => {
          return (
            <button type="button" className="flex items-center ">
              Id
            </button>
          );
        },
        cell: ({ row }) => {
          return <span className="ml-3">{row.getValue("id")}</span>;
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
        enableSorting: true,
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
          const secret = row.original;
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
                    // await deleteAPIKey(apiKey.id);
                    const updatedSecrets = secrets.filter(
                      (item) => item.id !== secret.id,
                    );
                    setSecrets(updatedSecrets);
                    setFilteredSecrets(updatedSecrets);
                    toast.success("Secret deleted");
                    // refetch();
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
  }, [secrets, setFilteredSecrets, setSecrets]);

  useEffect(() => {
    if (debouncedSearchValue) {
      const updatedSecrets = secrets.filter((item) =>
        item.key.toLowerCase().includes(debouncedSearchValue.toLowerCase()),
      );
      setFilteredSecrets(updatedSecrets);
    } else {
      setFilteredSecrets(secrets);
    }
  }, [debouncedSearchValue, secrets, setFilteredSecrets]);

  useEffect(() => {
    setFilteredSecrets(secrets);
  }, [setFilteredSecrets, secrets]);

  const table = useReactTable({
    data: filteredSecrets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    state: {
      //   sorting,
    },
  });

  return (
    <div className="h-full w-full px-2 pb-4 md:px-10">
      <div className="mx-auto grid h-full max-h-[90%] grid-rows-[auto,1fr,auto]">
        <div className="flex items-center gap-2 py-4">
          <Input
            placeholder="Filter by key..."
            value={searchValue ?? ""}
            onChange={(event) => {
              if (event.target.value === "") {
                setSearchValue("");
              } else {
                setSearchValue(event.target.value);
              }
            }}
            className="max-w-sm"
          />
          <div className="ml-auto flex gap-2">
            {/* <ApiKeyAdd onKeyCreated={() => refetch()} /> */}
            <AddSecret />
          </div>
        </div>
        <ScrollTable ref={parentRef} colSpan={columns.length} table={table} />
      </div>
    </div>
  );
};
