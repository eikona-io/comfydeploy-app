import { useUpdateServerActionDialog } from "@/components/auto-form/auto-form-dialog";
import type { AutoFormInputComponentProps } from "@/components/auto-form/types";
import { CustomNodeItem } from "@/components/custom-node-item";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormMessage } from "@/components/ui/form";
import { FormDescription } from "@/components/ui/form";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getBranchInfo } from "@/hooks/use-github-branch-info";
import { MoreVertical } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function AutoFormComfyUIVersion({
  label,
  isRequired,
  field,
  fieldConfigItem,
  zodItem,
}: AutoFormInputComponentProps) {
  const data = field.value;

  const { watch, setValue } = useFormContext();
  const values = watch();

  const version = data ?? values.dependencies?.comfyui;

  const { ui, setOpen } = useUpdateServerActionDialog({
    title: "Set ComfyUI Hash",
    description: "Set the comfyui hash to a specific commit",
    values: {
      comfyui: data,
    },
    formSchema: z.object({
      comfyui: z.string().min(1, { message: "ComfyUI hash is required" }),
    }),
    serverAction: async (data) => {
      field.onChange(data.comfyui);
    },
  });

  return (
    <TooltipProvider>
      <FormItem className="flex flex-col items-start justify-between">
        <FormLabel>
          {fieldConfigItem.inputProps?.title ?? label}
          {isRequired && <span className="text-destructive"> *</span>}
        </FormLabel>
        <FormControl>
          <Card className="flex w-full flex-col gap-2 p-4">
            <CustomNodeItem
              description={version ?? "No comfy ui hash found"}
              title={"ComfyUI"}
              url={"https://github.com/comfyanonymous/ComfyUI"}
              actions={
                <DropdownMenu>
                  <DropdownMenuTrigger asChild type="button">
                    <Button type="button" variant={"ghost"}>
                      <MoreVertical size={12} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={async () => {
                        const branchInfo = await getBranchInfo(
                          "https://github.com/comfyanonymous/ComfyUI",
                        );

                        if (!branchInfo) return;

                        if (data?.comfyui !== branchInfo?.commit.sha) {
                          toast.success("Updated hash to latest");
                        }

                        field.onChange(branchInfo?.commit.sha);
                      }}
                    >
                      Update
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async (e) => {
                        e.preventDefault();
                        setOpen({
                          comfyui: data,
                        });
                      }}
                    >
                      Set Hash
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
            />
          </Card>
        </FormControl>
        {ui}
        {fieldConfigItem.description && (
          <FormDescription>{fieldConfigItem.description}</FormDescription>
        )}
        <FormMessage />
      </FormItem>
    </TooltipProvider>
  );
}
