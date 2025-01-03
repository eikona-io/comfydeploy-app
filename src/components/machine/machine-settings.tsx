import AutoForm, { AutoFormSubmit } from "@/components/auto-form";
import {
  customFormSchema,
  serverlessFormSchema,
  sharedMachineConfig,
} from "@/components/machine/machine-schema";
import { SnapshotImportZone } from "@/components/snapshot-import-zone";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { memo, useState } from "react";
import { toast } from "sonner";

type View = "settings" | "deployments" | undefined;

// -----------------------components-----------------------

export function MachineSettings(props: {
  machine: any;
  setView: (view: View) => void;
}) {
  const { machine, setView } = props;
  const [isLoading, setIsLoading] = useState(false);

  if (machine.type === "comfy-deploy-serverless") {
    return (
      <div className="flex w-full flex-col gap-2">
        <span className="px-4 text-muted-foreground text-sm">
          You can drag and drop a snapshot file to import your machine
          configuration.
        </span>
        <MemoizedInlineSettings machine={machine} />
      </div>
    );
  }

  return (
    <ScrollArea className="relative h-full">
      <AutoForm
        containerClassName="lg:flex-row lg:gap-14"
        className="px-2"
        values={machine}
        formSchema={customFormSchema}
        fieldConfig={{
          auth_token: {
            inputProps: {
              type: "password",
            },
          },
        }}
        onSubmit={async (data) => {
          setIsLoading(true);
          try {
            await api({
              url: `machine/custom/${machine.id}`,
              init: {
                method: "PATCH",
                body: JSON.stringify({
                  name: data.name,
                  endpoint: data.endpoint,
                  auth_token: data.auth_token || "",
                  type: data.type,
                }),
              },
            });
            toast.success("Updated successfully!");
          } catch (error) {
            toast.error("Failed to update!");
          } finally {
            setIsLoading(false);
          }
        }}
      >
        <AutoFormSubmit
          className="absolute right-0 bottom-0"
          isLoading={isLoading}
        >
          Save Changes
        </AutoFormSubmit>
      </AutoForm>
    </ScrollArea>
  );
}

const MemoizedInlineSettings = memo(InlineSettings);

function InlineSettings(props: { machine: any }) {
  const { machine } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState(machine);

  return (
    <SnapshotImportZone
      currentMachineState={state}
      onMachineStateChange={setState}
      className="h-full"
    >
      <AutoForm
        containerClassName="flex-col"
        className="px-4"
        values={state}
        formSchema={serverlessFormSchema}
        fieldConfig={{
          ...sharedMachineConfig,
        }}
        onSubmit={async (data) => {
          console.log(data);
          setIsLoading(true);
          try {
            console.log(data);
            await api({
              url: `machine/serverless/${machine.id}`,
              init: {
                method: "PATCH",
                body: JSON.stringify(data),
              },
            });
            toast.success("Updated successfully!");
          } catch (error: any) {
            console.error("API Error:", error);
            // If the error response contains validation details, show them
            if (error.response) {
              const errorData = await error.response.json();
              console.error("Validation errors:", errorData);
              toast.error(
                `Update failed: ${JSON.stringify(errorData, null, 2)}`,
              );
            } else {
              toast.error("Failed to update!");
            }
          } finally {
            setIsLoading(false);
          }
        }}
      >
        <AutoFormSubmit
          className="absolute right-0 bottom-0"
          isLoading={isLoading}
        >
          Save Changes
        </AutoFormSubmit>
      </AutoForm>
    </SnapshotImportZone>
  );
}
