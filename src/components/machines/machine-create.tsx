import { WorkflowImportNewMachineSetup } from "@/components/onboarding/workflow-machine-import";
import { type Step, StepForm } from "@/components/step-form";
import { useCurrentPlan } from "@/hooks/use-current-plan";
import { api } from "@/lib/api";
import { comfyui_hash } from "@/utils/comfydeploy-hash";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface MachineStepValidation {
  machineName: string;
  gpuType: "t4" | "a10g" | "a100";
  comfyUiHash: string;
  selectedComfyOption: "recommended" | "latest" | "custom";
}

interface MachineStepNavigation {
  next: number | null; // null means end of flow
  prev: number | null; // null means start of flow
}

function getStepNavigation(
  currentStep: number,
  _validation: MachineStepValidation,
): MachineStepNavigation {
  switch (currentStep) {
    default:
      return {
        next: null,
        prev: null,
      };
  }
}

export function MachineCreate() {
  const sub = useCurrentPlan();
  const navigate = useNavigate({ from: "/machines" });
  const [validation, setValidation] = useState<MachineStepValidation>({
    machineName: "My Machine",
    gpuType: "a10g",
    comfyUiHash: comfyui_hash,
    selectedComfyOption: "recommended",
  });

  const STEPS: Step<MachineStepValidation>[] = [
    {
      id: 1,
      title: "Create Machine",
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
        onNext: async () => {
          try {
            // Type guard to ensure required fields exist
            if (
              !validation.machineName ||
              !validation.comfyUiHash ||
              !validation.gpuType
            ) {
              throw new Error("Missing required fields");
            }

            const response = await api({
              url: "machine/serverless",
              init: {
                method: "POST",
                body: JSON.stringify({
                  name: validation.machineName,
                  comfyui_version: validation.comfyUiHash,
                  gpu: validation.gpuType.toUpperCase() as
                    | "T4"
                    | "A10G"
                    | "A100",
                }),
              },
            });

            toast.success(`${validation.machineName} created successfully!`);
            const machineId = response.id;

            toast.info("Redirecting to machine page...");
            await new Promise((resolve) => setTimeout(resolve, 1000));
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

  useEffect(() => {
    if (sub?.features.machineLimited) {
      navigate({
        search: { view: undefined },
      });
    }
  }, [sub, navigate]);

  return (
    <StepForm
      hideProgressBar
      steps={STEPS}
      validation={validation}
      setValidation={setValidation}
      getStepNavigation={getStepNavigation}
      onExit={() => navigate({ to: "/machines", search: { view: undefined } })}
    />
  );
}
