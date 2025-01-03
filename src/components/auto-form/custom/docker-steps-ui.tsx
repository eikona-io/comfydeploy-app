import type { AutoFormInputComponentProps } from "@/components/auto-form/types";
import type { MachineStepValidation } from "@/components/machines/machine-create";
import { CustomNodeSetup } from "@/components/onboarding/custom-node-setup";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useMemo, useState } from "react";

export default function AutoFormDockerSteps({
  label,
  isRequired,
  field,
  fieldConfigItem,
  zodItem,
}: AutoFormInputComponentProps) {
  const [validation, setValidation] = useState<MachineStepValidation>({
    machineName: "",
    gpuType: "A10G",
    comfyUiHash: "",
    selectedComfyOption: "recommended",
    firstTimeSelectGPU: false,
    docker_command_steps: {
      steps: [],
    },
    isEditingHashOrAddingCommands: false,
  });

  // Memoize the docker_command_steps
  const memoizedSteps = useMemo(
    () => field.value,
    [JSON.stringify(field.value)],
  );

  // Update validation when memoized steps change
  useEffect(() => {
    if (memoizedSteps) {
      setValidation((prev) => ({
        ...prev,
        docker_command_steps: memoizedSteps,
      }));
    }
  }, [memoizedSteps]);

  // Update field when validation changes
  useEffect(() => {
    field.onChange(validation.docker_command_steps);
  }, [validation.docker_command_steps]);

  return (
    <TooltipProvider>
      <FormItem className="flex flex-col items-start justify-between">
        <FormLabel>
          {fieldConfigItem.inputProps?.title ?? label}
          {isRequired && <span className="text-destructive"> *</span>}
        </FormLabel>
        <FormControl>
          <div className="w-full">
            <CustomNodeSetup
              validation={validation}
              setValidation={setValidation}
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
