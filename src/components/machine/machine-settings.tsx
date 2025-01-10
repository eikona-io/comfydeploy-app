import AutoForm, { AutoFormSubmit } from "@/components/auto-form";
import {
  customFormSchema,
  type machineGPUOptions,
  serverlessFormSchema,
  sharedMachineConfig,
  useGPUConfig,
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
import { SelectionBox } from "@/components/ui/custom/selection-box";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type SubscriptionPlan,
  useCurrentPlan,
} from "@/hooks/use-current-plan";
import { useGithubBranchInfo } from "@/hooks/use-github-branch-info";
import { useUserSettings } from "@/hooks/use-user-settings";
import { api } from "@/lib/api";
import { comfyui_hash } from "@/utils/comfydeploy-hash";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEqual } from "lodash";
import { AlertCircleIcon, ExternalLinkIcon, Lock, Save } from "lucide-react";
import { type RefObject, memo, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import type { MachineStepValidation } from "../machines/machine-create";
import { CustomNodeSetup } from "../onboarding/custom-node-setup";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";

type View = "deployments" | undefined;

export function MachineSettingsWrapper({ machine }: { machine: any }) {
  const isServerless = machine.type === "comfy-deploy-serverless";
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSave = async () => {
    await formRef.current?.requestSubmit();
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
      gpu: machine.gpu,
      concurrency_limit: machine.concurrency_limit,
      run_timeout: machine.run_timeout,
      idle_timeout: machine.idle_timeout,
      keep_warm: machine.keep_warm,
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

        <TabsContent value="auto-scaling">
          <div className="space-y-10 p-2">
            <div>
              <h3 className="font-medium text-sm">GPU</h3>
              <GPUSelectBox
                value={form.watch("gpu")}
                onChange={(value) => form.setValue("gpu", value)}
              />
            </div>
            <div>
              <h3 className="font-medium text-sm">Max Parallel GPU</h3>
              <MaxParallelGPUSlider
                value={form.watch("concurrency_limit")}
                onChange={(value) => form.setValue("concurrency_limit", value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-medium text-sm">Workflow Timeout</h3>
                <WorkflowTimeOut
                  value={form.watch("run_timeout")}
                  onChange={(value) => form.setValue("run_timeout", value)}
                />
              </div>
              <div>
                <h3 className="mb-2 font-medium text-sm">Warm Time</h3>
                <WarmTime
                  value={form.watch("idle_timeout")}
                  onChange={(value) => form.setValue("idle_timeout", value)}
                />
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-sm">Keep Always On</h3>
              <MaxAlwaysOnSlider
                value={form.watch("keep_warm") || 0}
                onChange={(value) => form.setValue("keep_warm", value)}
              />
            </div>
          </div>
        </TabsContent>
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
        <SelectionBox
          key={option.label}
          selected={Boolean(
            (option.isCustom && isCustomSelected) ||
              (!option.isCustom && value === option.value),
          )}
          onClick={() => {
            if (option.isCustom) {
              onChange(value ?? "");
            } else {
              onChange(option.value);
            }
          }}
          leftHeader={
            <span className="font-medium text-sm">{option.label}</span>
          }
          rightHeader={
            <a
              href={`https://github.com/comfyanonymous/ComfyUI/commit/${option.value}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLinkIcon className="h-3 w-3" />
            </a>
          }
          description={
            option.isCustom ? (
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
              <span className="truncate break-all">{option.value}</span>
            )
          }
        />
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

function GPUSelectBox({
  value,
  onChange,
}: {
  value?: (typeof machineGPUOptions)[number];
  onChange: (value: (typeof machineGPUOptions)[number]) => void;
}) {
  const { gpuConfig } = useGPUConfig();
  const sub = useCurrentPlan() as SubscriptionPlan;
  const isBusiness = sub?.plans?.plans?.includes("business");

  return (
    <div className="mt-2 grid grid-cols-2 gap-2 lg:grid-cols-3">
      {gpuConfig.map((gpu) => {
        const isDisabled = !isBusiness && gpu.tier === "business";
        return (
          <SelectionBox
            key={gpu.id}
            selected={value === gpu.id}
            disabled={isDisabled}
            onClick={() =>
              !isDisabled &&
              onChange(gpu.id as (typeof machineGPUOptions)[number])
            }
            leftHeader={
              <span className="flex items-center gap-1 font-medium text-sm">
                {gpu.gpuName} {isDisabled && <Lock className="h-3 w-3" />}
              </span>
            }
            rightHeader={
              <span className="text-gray-500 text-sm">{gpu.ram}</span>
            }
            description={`$${gpu.pricePerSec?.toFixed(6)} / sec`}
          />
        );
      })}
    </div>
  );
}

interface RangeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  description?: string;
  inputWidth?: string;
}

function RangeSlider({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  description,
}: RangeSliderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row items-center gap-4">
        <Slider
          showTooltip={true}
          min={min}
          max={max}
          step={step}
          value={[value || min]}
          onValueChange={(value) => onChange(value[0])}
          className="w-full"
        />
        <Input
          className="w-20"
          type="number"
          min={min}
          max={max}
          value={value || min}
          onChange={(e) => {
            const newValue = Math.round(
              Math.min(Math.max(Number(e.target.value), min), max),
            );
            onChange(newValue);
          }}
          onKeyDown={(e) => {
            if (e.key === "." || e.key === ",") {
              e.preventDefault();
            }
          }}
        />
      </div>
      <div className="flex w-[calc(100%-90px)] justify-between px-1 text-muted-foreground text-sm leading-tight">
        <span>{min}</span>
        <span>Current: {value || min}</span>
        <span>{max}</span>
      </div>
      {description && (
        <span className="text-muted-foreground text-sm">{description}</span>
      )}
    </div>
  );
}

function MaxParallelGPUSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const sub = useCurrentPlan();
  const { data: userSettings } = useUserSettings();
  const plan = sub?.plans?.plans.filter(
    (plan: string) => !plan.includes("ws"),
  )?.[0];

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

  return (
    <RangeSlider
      value={value}
      onChange={onChange}
      min={1}
      max={maxGPU}
      description="Increase the concurrency limit for the machine to handle more gpu intensive tasks at the same time."
    />
  );
}

interface TimeSelectOption {
  seconds: number;
  requiredPlan?: string;
}

interface TimeSelectProps {
  value: number;
  onChange: (value: number) => void;
  options: TimeSelectOption[];
  placeholder?: string;
  description?: string;
}

function TimeSelect({
  value,
  onChange,
  options,
  placeholder,
  description,
}: TimeSelectProps) {
  const planHierarchy: Record<string, string[]> = {
    basic: [],
    pro: ["pro"],
    enterprise: ["pro", "business", "creator"],
    ws_basic: [],
    ws_pro: [],
    business: ["pro", "business"],
    creator: ["pro", "business", "creator"],
  };

  const sub = useCurrentPlan();
  const plan = sub?.plans?.plans.filter(
    (plan: string) => !plan.includes("ws"),
  )?.[0];

  const formatTime = (seconds: number) => {
    return seconds < 60 ? `${seconds} sec` : `${Math.floor(seconds / 60)} min`;
  };

  return (
    <div className="flex flex-col gap-1">
      <Select
        value={String(value)}
        onValueChange={(val) => onChange(Number(val))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder || "Select time"} />
        </SelectTrigger>
        <SelectContent>
          {options.map(({ seconds, requiredPlan }) => {
            const isAllowed =
              !requiredPlan ||
              (plan &&
                plan in planHierarchy &&
                planHierarchy[plan as keyof typeof planHierarchy]?.includes(
                  requiredPlan,
                ));

            return (
              <SelectItem
                key={seconds}
                value={String(seconds)}
                disabled={!isAllowed}
              >
                <span className="flex w-full items-center justify-between">
                  <span>{formatTime(seconds)}</span>
                  {!isAllowed && (
                    <span className="mx-2 inline-flex items-center justify-center gap-2">
                      <Badge className="capitalize">{requiredPlan}</Badge> plan
                      required
                      <Lock size={14} />
                    </span>
                  )}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {description && (
        <span className="pt-2 text-muted-foreground text-sm leading-snug">
          {description}
        </span>
      )}
    </div>
  );
}

function WorkflowTimeOut({
  value,
  onChange,
}: { value: number; onChange: (value: number) => void }) {
  const options: TimeSelectOption[] = [
    { seconds: 300 },
    { seconds: 420, requiredPlan: "pro" },
    { seconds: 600, requiredPlan: "business" },
    { seconds: 1200, requiredPlan: "business" },
    { seconds: 1800, requiredPlan: "business" },
  ];

  return (
    <TimeSelect
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select Timeout"
    />
  );
}

function WarmTime({
  value,
  onChange,
}: { value: number; onChange: (value: number) => void }) {
  const options: TimeSelectOption[] = [
    { seconds: 2 },
    { seconds: 15 },
    { seconds: 30 },
    { seconds: 60 },
    { seconds: 120, requiredPlan: "pro" },
    { seconds: 240, requiredPlan: "business" },
    { seconds: 600, requiredPlan: "business" },
    { seconds: 1200, requiredPlan: "business" },
  ];

  return (
    <TimeSelect
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select Warm Time"
      description="The warm time is the seconds before the container will be stopped after the run is finished. So the next request will reuse the warm container."
    />
  );
}

function MaxAlwaysOnSlider({
  value,
  onChange,
}: { value: number; onChange: (value: number) => void }) {
  const sub = useCurrentPlan();

  const minAlwaysOn = 0;
  const maxAlwaysOn = sub?.features.alwaysOnMachineLimit ?? 0;

  return (
    <div>
      {maxAlwaysOn === 0 ? (
        <Alert variant="warning" className="border-blue-500 bg-blue-500/10">
          <AlertCircleIcon className="!text-blue-500 h-4 w-4" />
          <AlertTitle className="text-blue-500">Limited Feature</AlertTitle>
          <AlertDescription className="text-blue-500">
            This feature is limited with your current plan. Please consult with
            support if you need to increase the limit.
          </AlertDescription>
        </Alert>
      ) : (
        <RangeSlider
          value={value}
          onChange={onChange}
          min={0}
          max={maxAlwaysOn}
        />
      )}
      <Alert variant="warning" className="mt-2 bg-yellow-500/10">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Advanced Feature</AlertTitle>
        <AlertDescription>
          This is an advanced feature. Keeping machines always-on will
          continuously incur GPU costs until you reduce the value.
        </AlertDescription>
      </Alert>
    </div>
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
