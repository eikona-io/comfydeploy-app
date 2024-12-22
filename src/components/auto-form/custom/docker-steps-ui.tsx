import type { AutoFormInputComponentProps } from "@/components/auto-form/types";
import { DockerStepsUI } from "@/components/docker-steps-ui";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AutoFormDockerSteps({
  label,
  isRequired,
  field,
  fieldConfigItem,
  zodItem,
}: AutoFormInputComponentProps) {
  const data = field.value;

  return (
    <TooltipProvider>
      <FormItem className="flex flex-col items-start justify-between">
        <FormLabel>
          {fieldConfigItem.inputProps?.title ?? label}
          {isRequired && <span className="text-destructive"> *</span>}
        </FormLabel>
        <FormControl>
          <div className="flex w-full flex-col gap-2">
            <DockerStepsUI
              data={data}
              onEdit={(data) => {
                // console.log(field.value, data);
                field.onChange(data);
              }}
            />
          </div>
        </FormControl>
        {fieldConfigItem.description && (
          <FormDescription>{fieldConfigItem.description}</FormDescription>
        )}
        <FormMessage />
      </FormItem>
    </TooltipProvider>
  );
}
