import AutoForm from "@/components/auto-form";
import {
  customFormSchema,
  type machineGPUOptions,
  serverlessFormSchema,
  useGPUConfig,
} from "@/components/machine/machine-schema";
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
import { useBlocker } from "@tanstack/react-router";
import { AnimatePresence, easeOut, motion, useAnimation } from "framer-motion";
import { isEqual } from "lodash";
import {
  AlertCircleIcon,
  ExternalLinkIcon,
  Info,
  Loader2,
  Lock,
  Save,
} from "lucide-react";
import { type RefObject, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import type { MachineStepValidation } from "../machines/machine-create";
import { CustomNodeSetup } from "../onboarding/custom-node-setup";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { ExtraDockerCommands } from "./extra-docker-commands";

export function MachineSettingsWrapper({ machine }: { machine: any }) {
  const isServerless = machine.type === "comfy-deploy-serverless";
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleSave = async () => {
    await formRef.current?.requestSubmit();
  };

  return (
    <div>
      <div>
        <Tabs defaultValue={isServerless ? "environment" : "advanced"}>
          <div className="sticky top-[57px] z-10 flex items-center justify-between bg-background">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-2">
                <div className="font-medium text-xl">Settings</div>
              </div>
            </div>
            <TabsList className=" w-fit border-0 bg-transparent">
              {machine.type === "comfy-deploy-serverless" && (
                <>
                  <TabsTrigger
                    value="environment"
                    className="rounded-none border-transparent border-b-2 bg-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Environment
                  </TabsTrigger>
                  <TabsTrigger
                    value="auto-scaling"
                    className="rounded-none border-transparent border-b-2 bg-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Auto Scaling
                  </TabsTrigger>
                </>
              )}
              <TabsTrigger
                value="advanced"
                className="rounded-none border-transparent border-b-2 bg-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Advanced
              </TabsTrigger>
            </TabsList>
          </div>
          <Card className="flex flex-col rounded-[10px] px-2">
            {isServerless ? (
              <ServerlessSettings
                machine={machine}
                formRef={formRef}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            ) : (
              <ClassicSettings
                machine={machine}
                formRef={formRef}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
          </Card>
        </Tabs>
      </div>
    </div>
  );
}

function ClassicSettings({
  machine,
  formRef,
  isLoading,
  setIsLoading,
}: {
  machine: any;
  formRef: RefObject<HTMLFormElement | null>;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}) {
  return (
    <>
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
              setIsLoading(true);
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
    </>
  );
}

type FormData = z.infer<typeof serverlessFormSchema>;

function ServerlessSettings({
  machine,
  formRef,
  isLoading,
  setIsLoading,
}: {
  machine: any;
  formRef: RefObject<HTMLFormElement | null>;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}) {
  const [isFormDirty, setIsFormDirty] = useState(false);
  const controls = useAnimation();

  const form = useForm<FormData>({
    resolver: zodResolver(serverlessFormSchema),
    mode: "onChange",
    defaultValues: {
      // env
      comfyui_version: machine.comfyui_version,
      docker_command_steps: machine.docker_command_steps,

      // auto scaling
      gpu: machine.gpu,
      concurrency_limit: machine.concurrency_limit,
      run_timeout: machine.run_timeout,
      idle_timeout: machine.idle_timeout,
      keep_warm: machine.keep_warm,

      // advance
      install_custom_node_with_gpu: machine.install_custom_node_with_gpu,
      ws_timeout: machine.ws_timeout,
      extra_docker_commands: machine.extra_docker_commands,
      allow_concurrent_inputs: machine.allow_concurrent_inputs,
      machine_builder_version: machine.machine_builder_version,
      base_docker_image: machine.base_docker_image,
      python_version: machine.python_version,
      extra_args: machine.extra_args,
      prestart_command: machine.prestart_command,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      const formValues = form.getValues();
      const isDirty = Object.keys(formValues).some((key) => {
        return formValues[key as keyof FormData] !== machine[key];
      });
      setIsFormDirty(isDirty);
    });

    return () => subscription.unsubscribe();
  }, [form, machine]);

  const { proceed, reset, status, next } = useBlocker({
    condition: !!isFormDirty,
  });

  useEffect(() => {
    const errors = form.formState.errors;
    console.log(errors);
    for (const [field, error] of Object.entries(errors)) {
      if (error?.message) {
        toast.error(`${field}: ${error.message}`);
      }
    }
  }, [form.formState.errors]);

  const handleSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      await api({
        url: `machine/serverless/${machine.id}`,
        init: {
          method: "PATCH",
          body: JSON.stringify(data),
        },
      });
      toast.success("Updated successfully!");
      setIsFormDirty(false);
    } catch (error: any) {
      console.error("API Error:", error);
      // If the error response contains validation details, show them
      if (error.response) {
        const errorData = await error.response.json();
        console.error("Validation errors:", errorData);
        toast.error(`Update failed: ${JSON.stringify(errorData, null, 2)}`);
      } else {
        toast.error("Failed to update!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "blocked") {
      controls.start({
        x: [0, -8, 12, -15, 8, -10, 5, -3, 2, -1, 0],
        y: [0, 4, -9, 6, -12, 8, -3, 5, -2, 1, 0],
        filter: [
          "blur(0px)",
          "blur(2px)",
          "blur(2px)",
          "blur(3px)",
          "blur(2px)",
          "blur(2px)",
          "blur(1px)",
          "blur(2px)",
          "blur(1px)",
          "blur(1px)",
          "blur(0px)",
        ],
        transition: {
          duration: 0.4,
          ease: easeOut,
        },
      });
      reset();
    }
  }, [status]);

  return (
    <>
      <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)}>
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

            <Accordion type="single" defaultValue="concurrency" className="">
              <AccordionItem value="concurrency">
                <AccordionTrigger className="py-4">
                  GPU Configuration
                </AccordionTrigger>
                <AccordionContent className="space-y-6">
                  <div>
                    <h3 className="font-medium text-sm">Max Parallel GPU</h3>
                    <MaxParallelGPUSlider
                      value={form.watch("concurrency_limit")}
                      onChange={(value) =>
                        form.setValue("concurrency_limit", value)
                      }
                    />
                  </div>
                  <div>
                    <h3 className="mb-2 font-medium text-sm">Keep Always On</h3>
                    <MaxAlwaysOnSlider
                      value={form.watch("keep_warm") || 0}
                      onChange={(value) => form.setValue("keep_warm", value)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="timeout">
                <AccordionTrigger className="py-4">
                  Timeout Settings
                </AccordionTrigger>
                <AccordionContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="mb-2 font-medium text-sm">
                        Workflow Timeout
                      </h3>
                      <WorkflowTimeOut
                        value={form.watch("run_timeout")}
                        onChange={(value) =>
                          form.setValue("run_timeout", value)
                        }
                      />
                    </div>
                    <div>
                      <h3 className="mb-2 font-medium text-sm">Warm Time</h3>
                      <WarmTime
                        value={form.watch("idle_timeout")}
                        onChange={(value) =>
                          form.setValue("idle_timeout", value)
                        }
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>

        <TabsContent value="advanced">
          <div className="space-y-10 p-2">
            <div className="flex flex-col gap-2">
              <h3 className="font-medium text-sm">Builder Version</h3>
              <BuilderVersionPicker
                value={form.watch("machine_builder_version") || "4"}
                onChange={(value) =>
                  form.setValue(
                    "machine_builder_version",
                    value as "2" | "3" | "4",
                  )
                }
              />
            </div>

            <Accordion type="single" defaultValue="docker">
              <AccordionItem value="docker">
                <AccordionTrigger className="py-4">
                  Docker Configuration
                </AccordionTrigger>
                <AccordionContent className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-sm">Base Docker Image</h3>
                    <Input
                      value={form.watch("base_docker_image") ?? ""}
                      onChange={(e) =>
                        form.setValue("base_docker_image", e.target.value)
                      }
                    />
                    <p className="text-muted-foreground text-xs">
                      Optional base docker image for the machine.
                    </p>
                  </div>
                  <ExtraDockerCommands
                    value={form.watch("extra_docker_commands")}
                    onChange={(value) =>
                      form.setValue("extra_docker_commands", value)
                    }
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="system">
                <AccordionTrigger className="py-4">
                  System Settings
                </AccordionTrigger>
                <AccordionContent className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-sm">Python Version</h3>
                    <Select
                      value={form.watch("python_version") ?? "3.11"}
                      onValueChange={(value) =>
                        form.setValue("python_version", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Python Version" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3.9">3.9</SelectItem>
                        <SelectItem value="3.10">3.10</SelectItem>
                        <SelectItem value="3.11">3.11 (Recommended)</SelectItem>
                        <SelectItem value="3.12">3.12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-sm">Queue per GPU</h3>
                    <RangeSlider
                      value={form.watch("allow_concurrent_inputs") || 1}
                      onChange={(value) =>
                        form.setValue("allow_concurrent_inputs", value)
                      }
                      min={1}
                      max={10}
                    />
                    <p className="text-muted-foreground text-xs">
                      The queue size is the number of inputs that can be queued
                      to 1 container before spinning up a new container.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-sm">Websocket timeout</h3>
                    <WebSocketTimeout
                      value={form.watch("ws_timeout")}
                      onChange={(value) => form.setValue("ws_timeout", value)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="custom">
                <AccordionTrigger className="py-4">
                  Custom Settings
                </AccordionTrigger>
                <AccordionContent className="space-y-6">
                  <div>
                    <div className="flex flex-row items-center gap-4">
                      <Switch
                        id="install_custom_node_with_gpu"
                        checked={form.watch("install_custom_node_with_gpu")}
                        onCheckedChange={(value) =>
                          form.setValue("install_custom_node_with_gpu", value)
                        }
                      />
                      <Label htmlFor="install_custom_node_with_gpu">
                        Install custom nodes with GPU
                      </Label>
                    </div>
                    <p className="mt-2 text-muted-foreground text-xs">
                      Some custom nodes require GPU while being initialized.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-sm">Extra arguments</h3>
                    <Input
                      value={form.watch("extra_args") ?? ""}
                      onChange={(e) =>
                        form.setValue("extra_args", e.target.value)
                      }
                    />
                    <p className="flex flex-row items-center gap-1 text-muted-foreground text-xs">
                      ComfyUI extra arguments.
                      <a
                        href="https://github.com/comfyanonymous/ComfyUI/blob/master/comfy/cli_args.py"
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-row items-center gap-1 text-blue-500"
                      >
                        Examples
                        <ExternalLinkIcon className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-sm">Prestart Command</h3>
                    <Input
                      value={form.watch("prestart_command") ?? ""}
                      onChange={(e) =>
                        form.setValue("prestart_command", e.target.value)
                      }
                    />
                    <p className="text-muted-foreground text-xs">
                      Command to run before the machine starts.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
      </form>

      <AnimatePresence>
        {isFormDirty && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.5 }}
            className="fixed right-0 bottom-4 left-0 z-50 mx-auto w-fit"
          >
            <motion.div
              animate={controls}
              className="flex w-96 flex-row items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm shadow-md"
            >
              <div className="flex flex-row items-center gap-2">
                <Info className="h-4 w-4" /> Unsaved changes
              </div>
              <div className="flex flex-row items-center gap-1">
                <Button
                  variant="ghost"
                  onClick={() => {
                    form.reset();
                    setIsFormDirty(false);
                  }}
                >
                  Reset
                </Button>
                <Button
                  onClick={() => formRef.current?.requestSubmit()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save
                    </span>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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

  // Handle incoming value changes (including form reset)
  useEffect(() => {
    setValidation((prev) => ({
      ...prev,
      docker_command_steps: value || { steps: [] },
    }));
  }, [value]);

  // Handle outgoing changes
  const handleValidationChange = (
    newValidation:
      | MachineStepValidation
      | ((prev: MachineStepValidation) => MachineStepValidation),
  ) => {
    const nextValidation =
      typeof newValidation === "function"
        ? newValidation(validation)
        : newValidation;

    setValidation(nextValidation);
    if (!isEqual(nextValidation.docker_command_steps, value)) {
      onChange(nextValidation.docker_command_steps);
    }
  };

  return (
    <CustomNodeSetup
      validation={validation}
      setValidation={handleValidationChange}
    />
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
  seconds?: number;
  minutes?: number;
  value?: number;
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

  const formatTime = (option: TimeSelectOption) => {
    if (option.minutes) return `${option.minutes} min`;
    if (option.seconds)
      return option.seconds < 60
        ? `${option.seconds} sec`
        : `${Math.floor(option.seconds / 60)} min`;
    return `${option.value} min`;
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
          {options.map((option) => {
            const optionValue =
              option.value ?? (option.seconds || (option.minutes || 0) * 60);
            const isAllowed =
              !option.requiredPlan ||
              (plan &&
                plan in planHierarchy &&
                planHierarchy[plan as keyof typeof planHierarchy]?.includes(
                  option.requiredPlan,
                ));

            return (
              <SelectItem
                key={optionValue}
                value={String(optionValue)}
                disabled={!isAllowed}
              >
                <span className="flex w-full items-center justify-between">
                  <span>{formatTime(option)}</span>
                  {!isAllowed && (
                    <span className="mx-2 inline-flex items-center justify-center gap-2">
                      <Badge className="capitalize">
                        {option.requiredPlan}
                      </Badge>{" "}
                      plan required
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

function WebSocketTimeout({
  value,
  onChange,
}: { value: number; onChange: (value: number) => void }) {
  const options: TimeSelectOption[] = [
    { minutes: 2 },
    { minutes: 5, requiredPlan: "pro" },
    { minutes: 10, requiredPlan: "business" },
  ];

  return (
    <TimeSelect
      value={value}
      onChange={onChange}
      options={options.map((opt) => ({ ...opt, value: opt.minutes }))}
      placeholder="Select Timeout"
    />
  );
}

function BuilderVersionPicker({
  value,
  onChange,
}: { value: string; onChange: (value: string) => void }) {
  const builderVersions = [
    {
      value: "2",
      label: "V2",
      status: "deprecated",
      disabled: true,
      description: "Deprecated",
    },
    {
      value: "3",
      label: "V3",
      status: "",
      disabled: true,
      description: "Support version",
    },
    {
      value: "4",
      label: "V4",
      status: "latest",
      disabled: false,
      description: "Recommended version",
    },
  ];

  return (
    <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
      {builderVersions.map((version) => (
        <SelectionBox
          key={version.value}
          selected={value === version.value}
          disabled={version.disabled}
          onClick={() => !version.disabled && onChange(version.value)}
          leftHeader={
            <span className="font-medium text-sm">{version.label}</span>
          }
          rightHeader={
            <Badge
              variant={
                version.status === "deprecated" ? "destructive" : "green"
              }
              className="text-xs"
            >
              {version.status}
            </Badge>
          }
          description={version.description}
        />
      ))}
    </div>
  );
}
