import type { AutoFormInputComponentProps } from "@/components/auto-form/types";
import { Badge } from "@/components/ui/badge";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentPlan } from "@/hooks/use-current-plan";
import { getDuration } from "@/lib/get-relative-time";
import { Lock } from "lucide-react";

export default function AutoFormTimeoutPicker({
  label,
  isRequired,
  field,
  fieldConfigItem,
  zodItem,
}: AutoFormInputComponentProps) {
  const allUnlocked = fieldConfigItem.inputProps?.unlocked ?? false;

  const values = fieldConfigItem.inputProps?.optionsForTier;
  const displayAsTime = fieldConfigItem.inputProps?.displayAsTime ?? false;

  const sub = useCurrentPlan();

  const plan = sub?.plans?.plans.filter(
    (plan: string) => !plan?.includes("ws"),
  )?.[0];

  // Define plan hierarchy
  const planHierarchy = {
    basic: [],
    pro: ["pro"],
    enterprise: ["pro", "business", "creator"],
    ws_basic: [],
    ws_pro: [],
    business: ["pro", "business"],
    creator: ["pro", "business", "creator"],
  } satisfies Record<string, string[]>;

  // Check if the current plan meets or exceeds the required plan
  const isPlanSufficient = (requiredPlan: string | undefined) => {
    if (!requiredPlan) return true;
    if (plan === "basic" || plan === undefined) return false;
    return (
      planHierarchy[plan as keyof typeof planHierarchy] as string[]
    ).includes(requiredPlan);
  };

  // Determine which timeout settings are enabled based on the current plan
  const enabledTimeoutSettings = values?.filter(([, requiredPlan]) => {
    return allUnlocked || isPlanSufficient(requiredPlan);
  });

  const valueDsiplay =
    field.value !== undefined && field.value !== null ? (
      <>
        {displayAsTime ? (
          <span>{getDuration(Number.parseFloat(field.value))}</span>
        ) : (
          <span>
            {values?.find(([value]) => value === field.value.toString())?.[2] ||
              field.value}
          </span>
        )}
      </>
    ) : (
      "Select an option"
    );

  return (
    <FormItem>
      <FormLabel>
        {fieldConfigItem.inputProps?.title ?? label}
        {isRequired && <span className="text-destructive"> *</span>}
      </FormLabel>
      <FormControl>
        <Select
          value={field.value?.toString()}
          onValueChange={(value) => {
            if (!value) return;

            const parsedValue = Number.parseInt(value);
            field.onChange(Number.isNaN(parsedValue) ? value : parsedValue);
          }}
          defaultValue={field.value?.toString()}
        >
          <SelectTrigger>
            <SelectValue
              className="w-full"
              placeholder={fieldConfigItem.inputProps?.placeholder}
            >
              {valueDsiplay}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {values?.map(([value, requiredPlan, label]) => {
              const enabled = enabledTimeoutSettings?.some(
                ([enabledValue]) => enabledValue === value,
              );
              return (
                <SelectItem value={value} key={value} disabled={!enabled}>
                  {displayAsTime ? (
                    <span>{getDuration(Number.parseFloat(value))}</span>
                  ) : (
                    <span>{label ?? value}</span>
                  )}
                  {!enabled && (
                    <span className="mx-2 inline-flex items-center justify-center gap-2">
                      <Badge className="capitalize">{requiredPlan}</Badge> plan
                      required
                      <Lock size={14} />
                    </span>
                  )}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </FormControl>
      {fieldConfigItem.description && (
        <FormDescription>{fieldConfigItem.description}</FormDescription>
      )}
      <FormMessage />
    </FormItem>
  );
}
