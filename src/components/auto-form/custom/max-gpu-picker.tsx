import type { AutoFormInputComponentProps } from "@/components/auto-form/types";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { useCurrentPlan } from "@/hooks/use-current-plan";
import { useUserSettings } from "@/hooks/use-user-settings";

export default function AutoFormMaxGPUPicker({
  label,
  isRequired,
  field,
  fieldConfigItem,
}: AutoFormInputComponentProps) {
  //   const { maxGPU: maxGPUFlag } = useFeatureFlags();

  const sub = useCurrentPlan();
  const { data: userSettings } = useUserSettings();
  const plan = sub?.plans?.plans.filter(
    (plan: string) => !plan.includes("ws"),
  )?.[0];

  // Define plan hierarchy and max GPU values
  const planHierarchy: Record<string, { max: number }> = {
    basic: { max: 1 },
    pro: { max: 3 },
    ws_basic: { max: 1 },
    ws_pro: { max: 3 },
    business: { max: 10 },
    enterprise: { max: 10 },
    creator: { max: 10 },
  };

  let maxGPU = planHierarchy[plan as keyof typeof planHierarchy]?.max || 1;
  if (userSettings?.max_gpu) {
    maxGPU = Math.max(maxGPU, userSettings.max_gpu);
  }
  const minGPU = 1;

  return (
    <FormItem>
      <FormLabel>
        {fieldConfigItem.inputProps?.title ?? label}
        {isRequired && <span className="text-destructive"> *</span>}
      </FormLabel>
      <FormControl>
        <Slider
          min={minGPU}
          max={maxGPU}
          step={1}
          value={[field.value || minGPU]}
          onValueChange={(value) => field.onChange(value[0])}
          className="w-full"
        />
      </FormControl>
      <div className="flex justify-between text-muted-foreground text-sm">
        <span>{minGPU}</span>
        <span>Current: {field.value || minGPU}</span>
        <span>{maxGPU}</span>
      </div>
      {fieldConfigItem.description && (
        <FormDescription>{fieldConfigItem.description}</FormDescription>
      )}
      <FormMessage />
    </FormItem>
  );
}
