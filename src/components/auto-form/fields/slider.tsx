import { Badge } from "@/components/ui/badge";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import type { AutoFormInputComponentProps } from "../types";

export default function AutoFormSlider({
  label,
  isRequired,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) {
  const {
    showLabel: _showLabel,
    value,
    onChange,
    ...fieldPropsWithoutShowLabel
  } = fieldProps;
  const showLabel = _showLabel === undefined ? true : _showLabel;

  return (
    <FormItem>
      {showLabel && <AutoFormLabel label={label} isRequired={isRequired} />}
      <FormControl>
        <div className="flex items-center gap-2">
          <Slider
            value={[value]}
            defaultValue={[value]}
            onValueChange={(value) => {
              onChange(value[0]);
            }}
            {...fieldPropsWithoutShowLabel}
          />
          <Badge className="flex w-10 items-center justify-center text-center">
            {value}
          </Badge>
        </div>
        {/* <Input type="number" {...fieldPropsWithoutShowLabel} /> */}
      </FormControl>
      <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
      <FormMessage />
    </FormItem>
  );
}
