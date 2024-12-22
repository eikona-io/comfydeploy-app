import AutoForm, { AutoFormSubmit } from "@/components/auto-form";
import type { FieldConfig } from "@/components/auto-form/types";
import { SnapshotImportZone } from "@/components/snapshot-import-zone";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { comfyui_hash } from "@/utils/comfydeploy-hash";
import { Link } from "@tanstack/react-router";
import { ExternalLinkIcon } from "lucide-react";
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

export const machineGPUOptions = [
  "CPU",
  "T4",
  "L4",
  "A10G",
  "A100",
  "A100-80GB",
  "H100",
] as const;

export const machineBuilderVersionTypes = ["2", "3", "4"] as const;

const serverlessFormSchema = z.object({
  name: z.string().default("My Machine").describe("Name"),
  comfyui_version: z.string().default(comfyui_hash).describe("ComfyUI Version"),
  gpu: z.enum(machineGPUOptions).default("A10G"),
  docker_command_steps: z.any().describe("Environment"),
  concurrency_limit: z.number().default(2),
  install_custom_node_with_gpu: z
    .boolean()
    .default(false)
    .optional()
    .describe("Install custom nodes with GPU"),
  run_timeout: z.number().default(300),
  idle_timeout: z.number().default(60),
  ws_timeout: z.number().default(2),
  extra_docker_commands: z.any().default([]).nullable(),
  allow_concurrent_inputs: z.number().default(1).describe("Queue per GPU"),
  machine_builder_version: z
    .enum(machineBuilderVersionTypes)
    .nullable()
    .default("4")
    .describe("Builder Version"),
  keep_warm: z.number().default(0).describe("Keep always on"),
  base_docker_image: z
    .string()
    .nullable()
    .default("")
    .optional()
    .describe("Base docker image"),
  python_version: z
    .string()
    .nullable()
    .default("3.11")
    .optional()
    .describe("Python version"),
  extra_args: z
    .string()
    .nullable()
    .default("")
    .optional()
    .describe("Extra arguments"),
  prestart_command: z
    .string()
    .nullable()
    .default("")
    .optional()
    .describe("Prestart command"),
});

export const sharedMachineConfig: FieldConfig<
  z.infer<typeof serverlessFormSchema>
> = {
  comfyui_version: {
    fieldType: "comfyuiVersion",
  },
  docker_command_steps: {
    fieldType: "dockerSteps",
    description: "Install any custom nodes, custom docker commands.",
  },
  gpu: {
    fieldType: "timeoutPicker",
    inputProps: {
      optionsForTier: [
        ["CPU", , "CPU"],
        ["T4", , "T4 (16GB)"],
        ["A10G", , "A10G (24GB)"],
        ["L4", , "L4 (24GB)"],
        ["A100", "business", "A100 (40GB)"],
        ["A100-80GB", "business", "A100-80GB (80GB)"],
        ["H100", "business", "H100 (80GB)"],
      ],
    },
  },
  run_timeout: {
    fieldType: "timeoutPicker",
    inputProps: {
      title: "Workflow timeout",
      optionsForTier: [
        ["300"],
        ["420", "pro"],
        ["600", "business"],
        ["1200", "business"],
        ["1800", "business"],
      ],
      displayAsTime: true,
    },
    group: "Auto Scaling",
  },
  idle_timeout: {
    fieldType: "timeoutPicker",
    description:
      "The warm time is the seconds before the container will be stopped after the run is finished. So the next request will reuse the warm container.",
    inputProps: {
      title: "Warm time",
      optionsForTier: [
        ["2"],
        ["15"],
        ["30"],
        ["60"],
        ["120", "pro"],
        ["240", "business"],
        ["600", "business"], // 10 minutes
        ["1200", "business"], // 20 minutes
      ],
      displayAsTime: true,
    },
    group: "Auto Scaling",
  },
  keep_warm: {
    fieldType: "max-always-on-picker",
    group: "Auto Scaling",
  },
  concurrency_limit: {
    fieldType: "max-gpu-picker",
    description:
      "Increase the concurrency limit for the machine to handle more gpu intensive tasks at the same time.",
    inputProps: {
      title: "Max Parallel GPU",
    },
    group: "Auto Scaling",
  },

  models: {
    fieldType: "models",
    inputProps: {
      showLabel: false,
    },
    group: "Advance",
  },
  ws_timeout: {
    fieldType: "timeoutPicker",
    inputProps: {
      title: "Websocket timeout",
      optionsForTier: [["2"], ["5", "pro"], ["10", "business"]],
      displayAsTime: true,
    },
    group: "Advance",
  },
  allow_concurrent_inputs: {
    fieldType: "slider",
    description:
      "The queue size is the number of inputs that can be queued to 1 container before spinning up a new container.",
    inputProps: {
      title: "Queue per GPU",
      min: 1,
    },
    group: "Advance",
  },
  extra_docker_commands: {
    fieldType: "extraDockerCommands",
    group: "Advance",
  },
  install_custom_node_with_gpu: {
    fieldType: "checkbox",
    description: "Some custom nodes require a gpu while being initialized.",
    inputProps: {
      title: "Install custom node with GPU",
    },
    group: "Advance",
  },
  machine_builder_version: {
    fieldType: "select",
    description:
      "v2 is deprecated, v3 is recommended, for new users, v4 is in beta, request v2 API access in /settings",
    group: "Advance",
  },

  base_docker_image: {
    description: "Optional base docker image for the machine.",
    group: "Advance",
  },

  extra_args: {
    description: (
      <>
        ComfyUI extra args{" "}
        <Link
          className="text-blue-500 underline"
          target="_blank"
          href="https://github.com/comfyanonymous/ComfyUI/blob/master/comfy/cli_args.py"
        >
          examples{" "}
          <ExternalLinkIcon className="inline-block h-[14px] w-[14px]" />
        </Link>
      </>
    ),
    group: "Advance",
  },

  prestart_command: {
    description: "Command to run before the machine starts.",
    group: "Advance",
  },

  python_version: {
    description: "Python version for the machine.",
    group: "Advance",
  },

  // retrieve_static_assets: {
  //   group: "Advance",
  // },
};

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
        containerClassName="lg:flex-row lg:gap-14"
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
