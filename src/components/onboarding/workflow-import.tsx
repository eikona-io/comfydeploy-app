import type {
  ConflictingNodeInfo,
  WorkflowDependencies,
} from "@/components/onboarding/workflow-analyze";
import {
  WorkflowImportCustomNodeSetup,
  WorkflowImportMachine,
  WorkflowImportNewMachineSetup,
  convertToDockerSteps,
  findFirstDuplicateNode,
} from "@/components/onboarding/workflow-machine-import";
import { WorkflowModelCheck } from "@/components/onboarding/workflow-model-check";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { comfyui_hash } from "@/utils/comfydeploy-hash";
import { defaultWorkflowTemplates } from "@/utils/default-workflow";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleCheckBig,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Add these interfaces
export interface StepValidation {
  workflowName: string;
  importOption: "import" | "default" | "empty";
  importJson?: string;
  workflowJson?: string;
  workflowApi?: string;
  selectedMachineId?: string;
  machineOption?: "existing" | "new";
  // Add more fields as needed for future steps

  machineName?: string;
  gpuType?: "t4" | "a10g" | "a100";
  comfyUiHash?: string;
  selectedComfyOption?: "recommended" | "latest" | "custom";

  dependencies?: WorkflowDependencies;
  selectedConflictingNodes?: {
    [nodeName: string]: ConflictingNodeInfo[];
  };
}

// Add a new interface for step actions
interface StepActions {
  onNext: (validation: StepValidation) => Promise<boolean> | boolean;
}

// Update Step interface
interface Step {
  id: number;
  title: string;
  component: React.ComponentType<StepProps>;
  validate: (validation: StepValidation) => {
    isValid: boolean;
    error?: string;
  };
  actions: StepActions;
}

export interface StepProps {
  validation: StepValidation;
  setValidation: (
    validation: StepValidation | ((prev: StepValidation) => StepValidation),
  ) => void;
}

interface StepNavigation {
  next: number | null; // null means end of flow
  prev: number | null; // null means start of flow
}

function getStepNavigation(
  currentStep: number,
  validation: StepValidation,
): StepNavigation {
  switch (currentStep) {
    case 0: // Create Workflow
      return {
        next: 1,
        prev: null,
      };

    case 1: // Select Machine
      return {
        next:
          validation.machineOption === "new"
            ? validation.importOption === "empty" ||
              validation.importOption === "default"
              ? 4
              : 2 // Skip Custom Node Setup for empty workflows
            : null, // End flow for existing/none machine
        prev: 0,
      };

    case 2: // Custom Node Setup
      return {
        next: 3,
        prev: 1,
      };

    case 3: // Model Checking
      return {
        next: 4,
        prev: 2,
      };

    case 4: // Machine Settings
      return {
        next: null,
        prev:
          validation.importOption === "empty" ||
          validation.importOption === "default"
            ? 1
            : 3,
      };

    default:
      return {
        next: null,
        prev: null,
      };
  }
}

export default function WorkflowImport() {
  // const router = useRouter();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const { getToken } = useAuth();
  const [validation, setValidation] = useState<StepValidation>({
    workflowName: "Untitled Workflow",
    importOption:
      (localStorage.getItem("workflowImportOption") as
        | "import"
        | "default"
        | "empty") || "default",
    importJson: "",
    workflowJson:
      localStorage.getItem("workflowImportOption") === "empty"
        ? JSON.stringify(EMPTY_WORKFLOW)
        : "",
    workflowApi: "",
    selectedMachineId: "",
    machineOption: "existing",
    machineName: "Untitled Machine",
    gpuType: "a10g",
    comfyUiHash: comfyui_hash,
    selectedComfyOption: "recommended",
    dependencies: undefined,
    selectedConflictingNodes: {},
  });
  const [isNavigating, setIsNavigating] = useState(false);

  const createWorkflow = async (machineId?: string) => {
    const requestBody = {
      name: validation.workflowName,
      workflow_json:
        validation.importOption === "import"
          ? validation.importJson
          : validation.workflowJson,
      ...(validation.workflowApi && { workflow_api: validation.workflowApi }),
      ...(machineId && { machine_id: machineId }),
    };

    const result = await fetch(
      `${process.env.NEXT_PUBLIC_CD_API_URL}/api/workflow`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!result.ok) {
      const error = await result.json();
      throw new Error(error.message || "Failed to create workflow");
    }

    return result.json();
  };

  // Define steps configuration
  const STEPS: Step[] = [
    {
      id: 1,
      title: "Create Workflow",
      component: Import,
      validate: (validation) => {
        if (!validation.workflowName.trim()) {
          return { isValid: false, error: "Please enter a workflow name" };
        }
        if (validation.importOption === "import") {
          if (!validation.importJson) {
            return { isValid: false, error: "Please provide workflow JSON" };
          }
          try {
            JSON.parse(validation.importJson);
          } catch (error) {
            return { isValid: false, error: "Please provide valid JSON" };
          }
        }
        return { isValid: true };
      },
      actions: {
        onNext: async () => {
          // Any actions needed after first step
          // console.log(validation);
          return true;
        },
      },
    },
    {
      id: 2,
      title: "Select Machine",
      component: WorkflowImportMachine,
      validate: (validation) => {
        if (
          validation.machineOption === "existing" &&
          !validation.selectedMachineId
        ) {
          return { isValid: false, error: "Please select a machine" };
        }
        return { isValid: true };
      },
      actions: {
        onNext: async (validation) => {
          try {
            switch (validation.machineOption) {
              // case "none":
              case "existing":
                // console.log(validation);
                // console.log(validation.workflowApi);
                // console.log(validation.workflowJson);

                // Execute the promise with toast and handle navigation
                toast.promise(
                  createWorkflow(validation.selectedMachineId || undefined),
                  {
                    loading: "Creating workflow...",
                    success: (data) => {
                      console.log(data);
                      if (data.workflow_id) {
                        navigate({
                          to: "/workflows/$workflowId/$view",
                          params: {
                            workflowId: data.workflow_id,
                            view: "workspace",
                          },
                          search: { view: undefined },
                        });
                      }
                      return `Workflow "${validation.workflowName}" has been created!`;
                    },
                    error: (err) => `Failed to create workflow: ${err.message}`,
                  },
                );

                return true;

              case "new":
                // Maybe store some state and continue to next step
                return true;

              default:
                return false;
            }
          } catch (error) {
            toast.error(`Failed to create workflow: ${error}`);
            return false;
          }
        },
      },
    },
    // Add more steps as needed:
    {
      id: 3,
      title: "Custom Node Setup",
      component: WorkflowImportCustomNodeSetup,
      validate: (validation) => {
        // Check if dependencies exist
        if (!validation.dependencies) {
          return { isValid: false, error: "No dependencies found" };
        }

        // Check custom nodes
        const customNodesWithoutHash = Object.entries(
          validation.dependencies.custom_nodes || {},
        ).filter(([_, node]) => !node.hash);

        if (customNodesWithoutHash.length > 0) {
          return {
            isValid: false,
            error: `Some custom nodes are missing hashes: ${customNodesWithoutHash
              .map(([url]) => url)
              .join(", ")}`,
          };
        }

        // Check selected conflicting nodes
        const selectedConflictsWithoutHash = Object.entries(
          validation.selectedConflictingNodes || {},
        ).flatMap(([nodeName, conflicts]) =>
          conflicts
            .filter((node) => !node.hash)
            .map((node) => `${nodeName} (${node.url})`),
        );

        if (selectedConflictsWithoutHash.length > 0) {
          return {
            isValid: false,
            error: `Some selected conflicting nodes are missing hashes: ${selectedConflictsWithoutHash.join(
              ", ",
            )}`,
          };
        }

        // Check if there is any duplicated nodes imported
        const duplicateNode = findFirstDuplicateNode(
          validation.dependencies?.custom_nodes,
          validation.selectedConflictingNodes,
        );
        if (duplicateNode) {
          return {
            isValid: false,
            error: `Duplicate node found: "${duplicateNode.url
              .split("/")
              .slice(-1)
              .join("/")}"`,
          };
        }

        return { isValid: true };
      },
      actions: {
        onNext: async () => {
          return true;
        },
      },
    },
    {
      id: 4,
      title: "Model Checking (Beta)",
      component: WorkflowModelCheck,
      validate: (validation) => {
        return { isValid: true };
      },
      actions: {
        onNext: async () => {
          return true;
        },
      },
    },
    {
      id: 5,
      title: "Machine Settings",
      component: WorkflowImportNewMachineSetup,
      validate: (validation) => {
        if (!validation.machineName?.trim()) {
          return { isValid: false, error: "Please enter a machine name" };
        }

        if (
          validation.selectedComfyOption === "custom" &&
          !validation.comfyUiHash?.trim()
        ) {
          return {
            isValid: false,
            error: "Please enter a ComfyUI commit hash",
          };
        }

        return { isValid: true };
      },
      actions: {
        onNext: async (validation) => {
          try {
            // Type guard to ensure required fields exist
            if (
              !validation.machineName ||
              !validation.comfyUiHash ||
              !validation.gpuType
            ) {
              throw new Error("Missing required fields");
            }

            const docker_commands = convertToDockerSteps(
              validation.dependencies?.custom_nodes,
              validation.selectedConflictingNodes,
            );

            const response = await fetch(
              `${process.env.NEXT_PUBLIC_CD_API_URL}/api/machine/serverless`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${await getToken()}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: validation.machineName,
                  comfyui_version: validation.comfyUiHash,
                  gpu: validation.gpuType.toUpperCase() as
                    | "T4"
                    | "A10G"
                    | "A100",
                  docker_command_steps: docker_commands,
                }),
              },
            );

            if (!response.ok) {
              throw new Error("Failed to create machine");
            }

            const data = await response.json();
            toast.success(`${validation.machineName} created successfully!`);
            const machineId = data.id;

            // Create workflow with the new machine ID
            const workflowResult = await createWorkflow(machineId);

            toast.success(
              `Workflow "${validation.workflowName}" created successfully!`,
            );
            if (workflowResult.workflow_id) {
              window.open(
                `/workflows/${workflowResult.workflow_id}/workspace`,
                "_blank",
              );
            }

            toast.info("Redirecting to machine page...");
            navigate({
              to: "/machines/$machineId",
              params: { machineId },
              search: { view: "logs" },
            });

            return true;
          } catch (error) {
            toast.error(`Failed to create: ${error}`);
            return false;
          }
        },
      },
    },
  ];

  const handleNavigation = async (direction: "next" | "prev") => {
    if (isNavigating) return;

    setIsNavigating(true);
    const navigation = getStepNavigation(step, validation);
    const nextStep = direction === "next" ? navigation.next : navigation.prev;

    if (direction === "next") {
      const validationResult = STEPS[step].validate(validation);
      if (!validationResult.isValid) {
        if (validationResult.error) {
          toast.error(validationResult.error);
        }
        setIsNavigating(false);
        return;
      }

      const actionResult = await STEPS[step].actions.onNext(validation);
      if (!actionResult) {
        setIsNavigating(false);
        return;
      }
    }

    if (nextStep === null) {
      if (direction === "prev") {
        navigate({
          to: "/workflows",
          search: { view: undefined },
        });
      }
      setIsNavigating(false);
      return;
    }

    // Update step immediately
    setStep(nextStep);

    // Keep buttons disabled during animation
    setTimeout(() => {
      setIsNavigating(false);
    }, 300);
  };

  const CurrentStepComponent = STEPS[step].component;

  // Calculate progress percentage based on current step and total steps
  const calculateProgress = () => {
    const navigation = getStepNavigation(step, validation);
    const totalSteps = STEPS.length - 1;
    const currentStepNumber = step;

    // If this is the last step (navigation.next is null), show 100%
    if (navigation.next === null) {
      return 100;
    }

    return Math.round((currentStepNumber / totalSteps) * 100);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col gap-4">
      <div className="sticky top-0 left-0 z-50 w-full">
        <div className="relative">
          <Progress value={calculateProgress()} className="h-2 rounded-none" />

          {/* Add background steps */}
          <div className="-bottom-10 absolute hidden w-full justify-between px-4 md:flex">
            {STEPS.map((stepItem, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-full px-3 py-1 text-xs transition-all duration-300",
                  index === step
                    ? "opacity-0" // Hide the background step that matches current step
                    : "bg-muted text-muted-foreground opacity-30",
                )}
              >
                {stepItem.title}
              </div>
            ))}
          </div>

          {/* Current step indicator (existing code) */}
          <div
            className="-bottom-10 absolute z-10 transform transition-all duration-300 ease-out"
            style={{
              left:
                calculateProgress() === 100
                  ? "auto"
                  : `${calculateProgress()}%`,
              right: calculateProgress() === 100 ? "0" : "auto",
              transform:
                calculateProgress() === 100
                  ? "translateX(-5%)"
                  : calculateProgress() === 0
                    ? "translateX(5%)"
                    : "translateX(-50%)",
              maxWidth: "90%",
              minWidth: "max-content",
            }}
          >
            <div className="relative">
              <div
                className={cn(
                  "-top-2 -translate-x-1/2 -translate-y-full absolute left-1/2 transform",
                  calculateProgress() === 0 && "hidden",
                )}
              >
                <div className="border-x-[8px] border-x-transparent border-b-[8px] border-b-primary" />
              </div>
              <div className="rounded-full bg-primary px-3 py-1 text-primary-foreground text-xs">
                {STEPS[step].title}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center px-4 py-14 md:py-0">
        <div className="w-full max-w-5xl py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="mb-4 font-medium text-xl">{STEPS[step].title}</h1>
              <CurrentStepComponent
                validation={validation}
                setValidation={setValidation}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="fixed right-8 bottom-12 flex flex-row gap-2">
        <Button
          variant={"expandIconOutline"}
          Icon={ChevronLeft}
          iconPlacement="left"
          onClick={() => handleNavigation("prev")}
          className="drop-shadow-md"
        >
          Back
        </Button>
        <Button
          variant={"expandIcon"}
          Icon={ChevronRight}
          iconPlacement="right"
          onClick={() => handleNavigation("next")}
          className="drop-shadow-md"
        >
          {getStepNavigation(step, validation).next === null
            ? "Finish"
            : "Next"}
        </Button>
      </div>
    </div>
  );
}

// Update component props
function Import({ validation, setValidation }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2">
          <span className="font-medium text-sm">Workflow Name </span>
          <span className="text-red-500">*</span>
        </div>
        <Input
          placeholder="Workflow name..."
          value={validation.workflowName}
          onChange={(e) =>
            setValidation({ ...validation, workflowName: e.target.value })
          }
        />
      </div>

      <div>
        <div className="mb-2">
          <span className="font-medium text-sm">Choose an option </span>
          <span className="text-red-500">*</span>
        </div>

        <div>
          <Accordion
            type="single"
            className="flex w-full flex-col gap-2"
            defaultValue={validation.importOption}
            onValueChange={(value) => {
              // Store just the importOption
              localStorage.setItem("workflowImportOption", value);

              // console.log(value);

              if (value === "empty") {
                setValidation({
                  ...validation,
                  importOption: value as "empty",
                  workflowJson: JSON.stringify(EMPTY_WORKFLOW),
                  workflowApi: undefined,
                  importJson: "",
                });
              } else {
                setValidation({
                  ...validation,
                  importOption: value as "import" | "default",
                  workflowJson: "",
                  workflowApi: undefined,
                });
              }
            }}
          >
            <DefaultOption
              validation={validation}
              setValidation={setValidation}
            />
            <ImportOptions
              validation={validation}
              setValidation={setValidation}
            />

            <AccordionOption
              value="empty"
              selected={validation.importOption}
              label="Empty"
              content={
                <span className="text-muted-foreground">
                  Blank page for you to start your own workflow.
                </span>
              }
            />
          </Accordion>
        </div>
      </div>
    </div>
  );
}

// =============== Utils ===============

export type AccordionOptionProps = {
  value: string;
  selected: string | undefined;
  label: string | React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

export function AccordionOption({
  value,
  selected,
  label,
  content,
  disabled = false,
}: AccordionOptionProps) {
  return (
    <AccordionItem
      value={value}
      disabled={disabled}
      className={cn(
        "rounded-sm border border-gray-200 px-4 py-1",
        selected !== value && "opacity-50",
        selected === value && "ring-2 ring-gray-500 ring-offset-2",
        disabled && "cursor-not-allowed opacity-50 hover:opacity-50",
      )}
    >
      <AccordionTrigger className={disabled ? "cursor-not-allowed" : ""}>
        <div className={"flex flex-row items-center"}>
          {selected === value ? (
            <CircleCheckBig className="mr-4 h-3 w-3" />
          ) : (
            <Circle className="mr-4 h-3 w-3" />
          )}
          {label}
        </div>
      </AccordionTrigger>
      <AccordionContent>{content}</AccordionContent>
    </AccordionItem>
  );
}

function InnerAccordionOption({
  value,
  selected,
  label,
  content,
}: {
  value: string;
  selected: string;
  label: string;
  content: React.ReactNode;
}) {
  return (
    <AccordionItem
      value={value}
      className={cn(
        "rounded-[4px] px-4 py-1 transition-all duration-200 ease-in-out",
        selected !== value ? "opacity-50" : "bg-gray-50",
      )}
    >
      <AccordionTrigger>
        <div className="flex flex-row items-center">
          {selected === value ? (
            <CircleCheckBig className="mr-4 h-3 w-3" />
          ) : (
            <Circle className="mr-4 h-3 w-3" />
          )}
          {label}
        </div>
      </AccordionTrigger>
      <AccordionContent>{content}</AccordionContent>
    </AccordionItem>
  );
}

function DefaultOption({
  validation,
  setValidation,
}: {
  validation: StepValidation;
  setValidation: (validation: StepValidation) => void;
}) {
  // Initialize innerSelected from validation if it exists, otherwise use default
  const [innerSelected, setInnerSelected] = useState<string>(
    validation.workflowJson
      ? defaultWorkflowTemplates.find(
          (t) => t.workflowJson === validation.workflowJson,
        )?.workflowId || "sd1.5"
      : "sd1.5",
  );

  // Only update validation when template changes, not on every mount
  useEffect(() => {
    const selectedTemplate = defaultWorkflowTemplates.find(
      (template) => template.workflowId === innerSelected,
    );

    if (selectedTemplate && validation.importOption === "default") {
      setValidation({
        ...validation,
        workflowJson: selectedTemplate.workflowJson,
        workflowApi: selectedTemplate.workflowApi,
        importJson: "",
      });
    }
  }, [innerSelected, validation.importOption]);

  return (
    <AccordionOption
      value="default"
      // Make sure this matches exactly with validation.importOption
      selected={validation.importOption}
      label="Default"
      content={
        <div>
          <span className="text-muted-foreground">
            Select a workflow as your starting point.{" "}
          </span>

          <div className="mt-2">
            <Accordion
              type="single"
              defaultValue={defaultWorkflowTemplates[0].workflowId}
              value={innerSelected}
              onValueChange={setInnerSelected}
            >
              {defaultWorkflowTemplates.map((template, index) => (
                <InnerAccordionOption
                  key={index}
                  value={template.workflowId}
                  selected={innerSelected}
                  label={template.workflowName}
                  content={
                    <div className="flex flex-row items-center gap-8 py-4">
                      <div className="w-1/2">
                        <p className="text-muted-foreground text-sm">
                          {template.workflowDescription}
                        </p>
                      </div>
                      <div className="relative h-48 w-1/2">
                        <div className="absolute inset-0 bg-gradient-to-r from-background to-15% to-transparent" />
                        <img
                          src={template.workflowImageUrl}
                          className="h-full w-full object-cover"
                          alt={`${template.workflowName} example`}
                        />
                      </div>
                    </div>
                  }
                />
              ))}
            </Accordion>
          </div>
        </div>
      }
    />
  );
}

function ImportOptions({
  validation,
  setValidation,
}: {
  validation: StepValidation;
  setValidation: (v: StepValidation) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file && file.type === "application/json") {
      const text = await file.text();
      try {
        setValidation({
          ...validation,
          importOption: "import",
          importJson: text,
          workflowJson: "",
          workflowApi: "", // Clear workflowApi
        });
      } catch (error) {
        toast.error("Invalid JSON file");
      }
    } else {
      toast.error("Please select a JSON file");
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    await handleFileSelect(file);
  };

  return (
    <AccordionOption
      value="import"
      selected={validation.importOption}
      label="Import"
      content={
        <>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="application/json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={cn(
              "cursor-pointer rounded-md border-2 border-dashed p-4 transition-colors duration-200",
              isDragging ? "border-green-500 bg-green-50" : "border-gray-200",
              "hover:border-gray-300",
            )}
          >
            <span className="text-muted-foreground">
              Click or drag and drop your workflow JSON file here.
            </span>

            <div className="mt-2">
              <Textarea
                placeholder="Or paste your workflow JSON here..."
                className="h-48"
                value={validation.importJson}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={(e) => {
                  const text = e.target.value;
                  setValidation({
                    ...validation,
                    importOption: "import",
                    importJson: text,
                    workflowJson: "",
                    workflowApi: "",
                  });

                  if (text.trim()) {
                    try {
                      setValidation({
                        ...validation,
                        importOption: "import",
                        importJson: text,
                        workflowJson: "",
                        workflowApi: "",
                      });
                    } catch (error) {
                      // If invalid JSON, we already set empty objects above
                    }
                  }
                }}
              />
            </div>
          </div>
        </>
      }
    />
  );
}

const EMPTY_WORKFLOW = {
  last_node_id: 14,
  last_link_id: 11,
  nodes: [],
  links: [],
  groups: [],
  config: {},
  extra: {
    ds: {
      scale: 1.1167815779424797,
      offset: [-1275.5956025607436, -780.4765046901985],
    },
  },
  version: 0.4,
};
