import AutoForm, { AutoFormSubmit } from "@/components/auto-form";
import { SnapshotImportZone } from "@/components/snapshot-import-zone";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { memo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
type View = "settings" | "overview" | "logs";

// -----------------------schemas-----------------------

const customFormSchema = z.object({
  name: z.string().default("My Machine").describe("Name"),
  endpoint: z.string().default("http://127.0.0.1:8188").describe("Endpoint"),
  type: z
    .enum([
      "classic",
      "runpod-serverless",
      "modal-serverless",
      "comfy-deploy-serverless",
      "workspace",
      "workspace-v2",
    ])
    .default("classic")
    .describe("Type"),
  auth_token: z.string().default("").describe("Auth token").optional(),
});

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
        containerClassName="lg:flex-row lg:gap-14"
        className="px-4"
        values={state}
        formSchema={addCustomMachineSchemaWithEmptyDockerSteps}
        fieldConfig={{
          ...sharedMachineConfig,
        }}
        dependencies={sharedMachineConfigDeps}
        onSubmit={async (data) => {
          setIsLoading(true);
          const { type } = machine;
          if (type === "comfy-deploy-serverless")
            await callServerPromise(
              updateCustomMachine({
                ...data,
                id: machine.id,
              }),
            );
          else
            await callServerPromise(
              updateMachine({
                id: machine.id,
                endpoint: machine.endpoint,
                ...data,
              }),
            );

          setIsLoading(false);
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
