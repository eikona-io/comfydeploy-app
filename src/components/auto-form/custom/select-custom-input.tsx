import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Update import to use shadcn Select components
import { useModels } from "@/hooks/use-model";
import { ChevronsUpDown } from "lucide-react"; // Import Lucide icon
import { useMemo, useState } from "react";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import type { AutoFormInputComponentProps } from "../types";

export default function AutoFormSelectInput({
  label,
  isRequired,
  fieldConfigItem,
  fieldProps,
  field,
}: AutoFormInputComponentProps) {
  const { showLabel: _showLabel, ...fieldPropsWithoutShowLabel } = fieldProps;
  const showLabel = _showLabel === undefined ? true : _showLabel;
  const type = fieldProps.type || "text";

  const { flattenedModels } = useModels();

  // Memoize the folders calculation
  const options = useMemo(
    () => [
      ...new Set(
        flattenedModels
          .filter((model) => model.path.includes("/"))
          .map((model) => model.path.split("/")[0])
          .filter((option) => option && option.trim() !== ""),
      ),
    ],
    [flattenedModels],
  ); // Only recalculate when flattenedModels changes

  return (
    <div className="flex flex-row items-center space-x-2">
      <FormItem className="flex w-full flex-col justify-start">
        {showLabel && (
          <AutoFormLabel label={"Folder"} isRequired={isRequired} />
        )}
        <div className="flex flex-row items-center space-x-2">
          <FormControl>
            <Input
              type={type}
              {...fieldPropsWithoutShowLabel}
              // onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <Select
              value={fieldPropsWithoutShowLabel.value}
              onValueChange={(value) => {
                if (value === "") return;
                console.log("value", value);
                field.onChange(value);
              }}
            >
              <SelectTrigger
                className="w-15 items-center justify-center"
                icon={<ChevronsUpDown size={14} />}
              >
                {/* <SelectValue placeholder="Select an option" /> */}
              </SelectTrigger>
              <SelectContent>
                {options.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </div>
        <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
        <FormMessage />
      </FormItem>
    </div>
  );
}
