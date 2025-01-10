import AutoForm, { AutoFormSubmit } from "@/components/auto-form";
import {
  customFormSchema,
  serverlessFormSchema,
  sharedMachineConfig,
} from "@/components/machine/machine-schema";
import { SnapshotImportZone } from "@/components/snapshot-import-zone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGithubBranchInfo } from "@/hooks/use-github-branch-info";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { comfyui_hash } from "@/utils/comfydeploy-hash";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEqual } from "lodash";
import { ExternalLinkIcon, Save } from "lucide-react";
import { type RefObject, memo, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import type { MachineStepValidation } from "../machines/machine-create";
import { CustomNodeSetup } from "../onboarding/custom-node-setup";

type View = "deployments" | undefined;

export function MachineSettingsWrapper({ machine }: { machine: any }) {
  const isServerless = machine.type === "comfy-deploy-serverless";
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSave = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <Card className="flex h-full flex-col rounded-[10px]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between font-semibold text-xl">
          Settings
          <div className="flex items-center">
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Configure your machine's GPU settings and environment
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {isServerless ? (
          <ServerlessSettings machine={machine} formRef={formRef} />
        ) : (
          <ClassicSettings machine={machine} formRef={formRef} />
        )}
      </CardContent>
    </Card>
  );
}

function ClassicSettings({
  machine,
  formRef,
}: { machine: any; formRef: RefObject<HTMLFormElement | null> }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Tabs defaultValue="advanced">
      <TabsList className="grid w-full grid-cols-3 rounded-[8px]">
        <TabsTrigger
          value="environment"
          className="rounded-[6px]"
          disabled={true}
        >
          Environment
        </TabsTrigger>
        <TabsTrigger
          value="auto-scaling"
          className="rounded-[6px]"
          disabled={true}
        >
          Auto Scaling
        </TabsTrigger>
        <TabsTrigger value="advanced" className="rounded-[6px]">
          Advanced
        </TabsTrigger>
      </TabsList>
      <TabsContent value="environment">
        Not available for classic machines.
      </TabsContent>
      <TabsContent value="auto-scaling">
        Not available for classic machines.
      </TabsContent>
      <TabsContent value="advanced">
        <AutoForm
          formRef={formRef}
          className="md:px-2"
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
        />
      </TabsContent>
    </Tabs>
  );
}

type FormData = z.infer<typeof serverlessFormSchema>;

function ServerlessSettings({
  machine,
  formRef,
}: { machine: any; formRef: RefObject<HTMLFormElement | null> }) {
  const form = useForm<FormData>({
    resolver: zodResolver(serverlessFormSchema),
    defaultValues: {
      comfyui_version: machine.comfyui_version,
      docker_command_steps: machine.docker_command_steps,
    },
  });

  return (
    <form
      ref={formRef}
      onSubmit={form.handleSubmit((data) => console.log(data))}
    >
      <Tabs defaultValue="environment">
        <TabsList className="grid w-full grid-cols-3 rounded-[8px]">
          <TabsTrigger value="environment" className="rounded-[6px]">
            Environment
          </TabsTrigger>
          <TabsTrigger value="auto-scaling" className="rounded-[6px]">
            Auto Scaling
          </TabsTrigger>
          <TabsTrigger value="advanced" className="rounded-[6px]">
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="environment">
          <div className="space-y-4 p-2">
            <div>
              <h3 className="font-medium text-sm">ComfyUI Version</h3>
              <ComfyUIVersionSelectBox
                value={form.watch("comfyui_version")}
                onChange={(value) => form.setValue("comfyui_version", value)}
              />
            </div>
            <CustomNodeSetupWrapper
              value={form.watch("docker_command_steps")}
              onChange={(value) => form.setValue("docker_command_steps", value)}
            />
          </div>
        </TabsContent>

        {/* Other tabs content... */}
      </Tabs>
    </form>
  );
}

// -----------------------components-----------------------

function ComfyUIVersionSelectBox({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  const { data: latestComfyUI, isLoading } = useGithubBranchInfo(
    "https://github.com/comfyanonymous/ComfyUI",
  );

  const options = [
    { label: "Recommended", value: comfyui_hash },
    { label: "Latest", value: latestComfyUI?.commit.sha || "" },
    { label: "Custom", value: "", isCustom: true },
  ];

  const recommendedOption = options.find((opt) => opt.label === "Recommended");
  const selectedOption = options.find(
    (opt) => opt.value === value && !opt.isCustom,
  );
  const isCustomSelected = !selectedOption && value;

  return (
    <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
      {options.map((option) => (
        <div
          key={option.label}
          className={cn(
            "flex cursor-pointer flex-col justify-center rounded-lg border p-4 transition-all duration-200",
            "hover:border-gray-400",
            (option.isCustom && isCustomSelected) ||
              (!option.isCustom && value === option.value)
              ? "border-gray-500 ring-2 ring-gray-500 ring-offset-2"
              : "border-gray-200 opacity-60",
          )}
          onClick={() => {
            if (option.isCustom) {
              onChange(value ?? "");
            } else {
              onChange(option.value);
            }
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{option.label}</span>
            <a
              href={`https://github.com/comfyanonymous/ComfyUI/commit/${option.value}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLinkIcon className="h-3 w-3" />
            </a>
          </div>
          {option.isCustom ? (
            <Input
              className="w-full rounded-[8px] font-mono text-[11px]"
              placeholder="ComfyUI hash..."
              value={isCustomSelected ? value : ""}
              onChange={(e) => {
                const newValue = e.target.value;
                onChange(newValue || (recommendedOption?.value ?? ""));
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="truncate break-all font-mono text-[11px] text-gray-400">
              {option.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function CustomNodeSetupWrapper({
  value,
  onChange,
}: {
  value: any;
  onChange: (value: any) => void;
}) {
  const [validation, setValidation] = useState<MachineStepValidation>(() => ({
    docker_command_steps: value || { steps: [] },
    machineName: "",
    gpuType: "A10G",
    comfyUiHash: "",
    selectedComfyOption: "recommended",
    firstTimeSelectGPU: false,
  }));

  useEffect(() => {
    if (value && !isEqual(value, validation.docker_command_steps)) {
      setValidation((prev) => ({
        ...prev,
        docker_command_steps: value,
      }));
    }
  }, [value]);

  useEffect(() => {
    if (!isEqual(validation.docker_command_steps, value)) {
      onChange(validation.docker_command_steps);
    }
  }, [validation.docker_command_steps, value, onChange]);

  return (
    <CustomNodeSetup validation={validation} setValidation={setValidation} />
  );
}

// -----------------------legacy-----------------------

export function MachineSettingsLegacy(props: {
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
