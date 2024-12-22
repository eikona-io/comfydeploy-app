"use client";

import type { AutoFormInputComponentProps } from "@/components/auto-form/types";
import { LoadingIcon } from "@/components/loading-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, ExternalLink, Plus } from "lucide-react";
import * as React from "react";
import { useMemo, useRef } from "react";
import type { z } from "zod";
import type { Model, ModelList, ModelListWrapper } from "./CivitalModelSchema";

export function ModelSelector({
  field,
  modelList,
  label,
  onSearch,
  shouldFilter = true,
  isLoading,
  selectMultiple = true,
  // searchValue,
  searchId,
}: Pick<AutoFormInputComponentProps, "field"> & {
  searchId: string;
  modelList?: z.infer<typeof ModelListWrapper>;
  label: string;
  // searchValue?: string;
  onSearch?: (search: string) => void;
  shouldFilter?: boolean;
  isLoading?: boolean;
  selectMultiple?: boolean;
}) {
  const value = (field.value as z.infer<typeof ModelList>) ?? [];
  const [open, setOpen] = React.useState(false);

  function toggleModel(model: z.infer<typeof Model>) {
    const prevSelectedModels = value;
    if (
      prevSelectedModels.some(
        (selectedModel) =>
          selectedModel.url + selectedModel.name === model.url + model.name,
      )
    ) {
      field.onChange(
        prevSelectedModels.filter(
          (selectedModel) =>
            selectedModel.url + selectedModel.name !== model.url + model.name,
        ),
      );
    } else {
      if (!selectMultiple) {
        field.onChange([model]);
      } else {
        field.onChange([...prevSelectedModels, model]);
      }
    }
  }

  const containerRef = useRef<HTMLDivElement>(null);

  const [searchValue, setSearchValue] = React.useState("");

  React.useEffect(() => {
    if (!searchId) return;

    const url = field.value[0]?.url;

    if (url?.startsWith("search:" + searchId + ":")) {
      const values = url.split(":") as string[];
      const value = values[values.length - 1];
      const type = values[values.length - 2];
      // console.log("searching for", value, type);

      setOpen(true);
      setSearchValue(value);
    }
  }, [field.value]);

  const filteredModelList = useMemo(() => {
    if (!modelList) return modelList;
    if (!searchValue) return modelList;
    if (shouldFilter === false) return modelList;

    console.log("filtering", searchValue);

    return {
      models: modelList.models.filter((model) => {
        return (
          model.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          model.filename.toLowerCase().includes(searchValue.toLowerCase()) ||
          model.type.toLowerCase().includes(searchValue.toLowerCase()) ||
          (model.base
            ? model.base.toLowerCase().includes(searchValue.toLowerCase())
            : false) ||
          (model.description
            ? model.description
                .toLowerCase()
                .includes(searchValue.toLowerCase())
            : false)
        );
      }),
    };
  }, [searchValue, modelList, shouldFilter]);

  return (
    <div className="" ref={containerRef}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex w-fit justify-between"
          >
            {label} <Plus size={14} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[375px] overflow-hidden p-0" side="bottom">
          <div className="relative shadow-md">
            <Input
              className="rounded-none border-none focus-visible:ring-0"
              placeholder={"Search " + label}
              value={searchValue}
              onChange={(c) => {
                setSearchValue(c.target.value);
                onSearch?.(c.target.value);
              }}
            />
            <div className="absolute top-0 right-4 flex h-full items-center">
              {isLoading && <LoadingIcon />}
            </div>
          </div>
          {/* <div className='w-full h-[1px] bg-gray-200'></div> */}
          {filteredModelList && (
            <Content
              toggleModel={toggleModel}
              modelList={filteredModelList}
              value={value}
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

function Content({
  modelList,
  toggleModel,
  value,
}: {
  modelList: z.infer<typeof ModelListWrapper>;
  toggleModel: (model: z.infer<typeof Model>) => void;
  value: z.infer<typeof ModelList>;
}) {
  const parentRef = React.useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: modelList?.models.length === undefined ? 0 : modelList.models.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  const items = rowVirtualizer.getVirtualItems();

  return (
    <>
      <div
        ref={parentRef}
        className="List"
        style={{
          height: `200px`,
          width: `100%`,
          overflow: "auto",
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {modelList &&
            items.map((virtualRow) => {
              const model = modelList.models[virtualRow.index];
              return (
                <div
                  key={virtualRow.key}
                  // className={virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  className="flex items-center overflow-hidden transition-colors hover:bg-gray-200"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    // height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div
                    className="relative flex h-full w-[375px] max-w-[calc(100%-48px)] flex-shrink items-center gap-2 px-4 py-2 text-xs "
                    onClick={() => {
                      toggleModel(model);
                    }}
                  >
                    <div className="flex w-full flex-col gap-1">
                      <span className="break-words">{model?.name}</span>
                      <Badge className="w-fit min-w-fit break-words">
                        {model?.filename}
                      </Badge>
                    </div>
                    <div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value.some(
                            (selectedModel) => selectedModel.url === model.url,
                          )
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </div>
                  </div>
                  <div className="h-full flex-col items-center justify-center">
                    <Button variant={"ghost"} asChild>
                      <a
                        href={model.reference}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink size={14} />{" "}
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
