"use client";

import { InputWithAddons } from "@/components/custom/input-with-addons";
import { Label } from "@/components/ui/label";
import type { Table } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { DataTableInputFilterField } from "./types";

type DataTableFilterInputProps<TData> = DataTableInputFilterField<TData> & {
  table: Table<TData>;
};

export function DataTableFilterInput<TData>({
  table,
  value: _value,
}: DataTableFilterInputProps<TData>) {
  const value = _value as string;
  const column = table.getColumn(value);
  const filterValue = column?.getFilterValue();
  const [inputValue, setInputValue] = useState((filterValue as string) ?? "");

  // Update local state when filter value changes externally
  useEffect(() => {
    setInputValue((filterValue as string) ?? "");
  }, [filterValue]);

  const debouncedSetFilter = useDebouncedCallback((value: string | null) => {
    column?.setFilterValue(value);
  }, 300);

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor={value} className="sr-only px-2 text-muted-foreground">
        {value}
      </Label>
      <InputWithAddons
        placeholder="Search"
        leading={<Search className="mt-0.5 h-4 w-4" />}
        containerClassName="h-9 rounded-lg"
        name={value}
        id={value}
        value={inputValue}
        onChange={(e) => {
          const val = e.target.value;
          setInputValue(val); // Update input immediately
          const newValue = val.trim() === "" ? null : val;
          debouncedSetFilter(newValue);
        }}
      />
    </div>
  );
}
