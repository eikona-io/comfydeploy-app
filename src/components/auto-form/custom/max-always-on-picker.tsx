import type { AutoFormInputComponentProps } from "@/components/auto-form/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { useCurrentPlan } from "@/hooks/use-current-plan";
import { AlertCircleIcon } from "lucide-react";

export default function AutoFormMaxAlwaysOnPicker({
  label,
  isRequired,
  field,
  fieldConfigItem,
}: AutoFormInputComponentProps) {
  const sub = useCurrentPlan();
  const plan = sub?.plans?.plans.filter(
    (plan: string) => !plan.includes("ws"),
  )?.[0];

  const minAlwaysOn = 0;
  const maxAlwaysOn = sub?.features.alwaysOnMachineLimit ?? 0;

  return (
    <FormItem>
      <FormLabel>
        {fieldConfigItem.inputProps?.title ?? label}
        {isRequired && <span className="text-destructive"> *</span>}
      </FormLabel>
      <FormControl>
        {maxAlwaysOn > 0 ? (
          <Slider
            min={minAlwaysOn}
            max={maxAlwaysOn}
            step={1}
            value={[field.value || minAlwaysOn]}
            onValueChange={(value) => field.onChange(value[0])}
            className="w-full"
          />
        ) : (
          <Alert variant="default">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Limited Feature</AlertTitle>
            <AlertDescription>
              This feature is limited with your current plan. Please consult
              with support if you need to increase the limit.
            </AlertDescription>
          </Alert>
        )}
      </FormControl>
      {maxAlwaysOn > 0 ? (
        <div className="flex justify-between text-muted-foreground text-sm">
          <span>{minAlwaysOn}</span>
          <span>Current: {field.value || minAlwaysOn}</span>
          <span>{maxAlwaysOn}</span>
        </div>
      ) : (
        <></>
      )}
      <Alert variant="warning">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Advanced Feature</AlertTitle>
        <AlertDescription>
          This is an advanced feature. Keeping machines always-on will
          continuously incur GPU costs until you reduce the value.
        </AlertDescription>
      </Alert>
      {fieldConfigItem.description && (
        <FormDescription>{fieldConfigItem.description}</FormDescription>
      )}
      <FormMessage />
    </FormItem>
  );
}
