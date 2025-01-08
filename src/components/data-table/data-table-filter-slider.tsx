"use client";

import { InputWithAddons } from "@/components/custom/input-with-addons";
import { Slider } from "@/components/custom/slider";
import { Label } from "@/components/ui/label";
import { isArrayOfNumbers } from "@/lib/is-array";
import type { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { DataTableSliderFilterField } from "./types";

type DataTableFilterSliderProps<TData> = DataTableSliderFilterField<TData> & {
  table: Table<TData>;
};

export function DataTableFilterSlider<TData>({
  table,
  value: _value,
  min,
  max,
}: DataTableFilterSliderProps<TData>) {
  const [localValue, setLocalValue] = useState<number[]>([min, max]);
  const value = _value as string;
  const column = table.getColumn(value);
  const filterValue = column?.getFilterValue();

  useEffect(() => {
    const filters =
      typeof filterValue === "number"
        ? [filterValue, filterValue]
        : Array.isArray(filterValue) && isArrayOfNumbers(filterValue)
          ? filterValue.length === 1
            ? [filterValue[0], filterValue[0]]
            : filterValue
          : [min, max];

    setLocalValue(filters);
  }, [filterValue, min, max]);

  const debouncedSetFilter = useDebouncedCallback((value: number[]) => {
    column?.setFilterValue(value);
  }, 300);

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-4">
        <div className="grid w-full gap-1.5">
          <Label
            htmlFor={`min-${value}`}
            className="px-2 text-muted-foreground"
          >
            Min.
          </Label>
          <InputWithAddons
            placeholder="from"
            trailing="s"
            containerClassName="rounded-lg leading-5"
            type="number"
            name={`min-${value}`}
            id={`min-${value}`}
            value={`${localValue?.[0] ?? min}`}
            min={min}
            max={max}
            onChange={(e) => {
              const val = Number.parseInt(e.target.value) || 0;
              const newValue =
                Array.isArray(localValue) && val < localValue[1]
                  ? [val, localValue[1]]
                  : [val, max];
              setLocalValue(newValue);
              debouncedSetFilter(newValue);
            }}
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label
            htmlFor={`max-${value}`}
            className="px-2 text-muted-foreground"
          >
            Max.
          </Label>
          <InputWithAddons
            placeholder="to"
            trailing="s"
            containerClassName="rounded-lg leading-5"
            type="number"
            name={`max-${value}`}
            id={`max-${value}`}
            value={`${localValue?.[1] ?? max}`}
            min={min}
            max={max}
            onChange={(e) => {
              const val = Number.parseInt(e.target.value) || 0;
              const newValue =
                Array.isArray(localValue) && val > localValue[0]
                  ? [localValue[0], val]
                  : [min, val];
              setLocalValue(newValue);
              debouncedSetFilter(newValue);
            }}
          />
        </div>
      </div>
      <Slider
        min={min}
        max={max}
        value={localValue}
        onValueChange={(values) => {
          setLocalValue(values);
          debouncedSetFilter(values);
        }}
      />
    </div>
  );
}
