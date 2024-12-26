import {
  type GpuTypes,
  WorkflowImportNewMachineSetup,
} from "@/components/onboarding/workflow-machine-import";
import { type Step, StepForm } from "@/components/step-form";
import { useCurrentPlan } from "@/hooks/use-current-plan";
import { api } from "@/lib/api";
import { comfyui_hash } from "@/utils/comfydeploy-hash";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface MachineStepValidation {
  machineName: string;
  gpuType: GpuTypes;
  comfyUiHash: string;
  selectedComfyOption: "recommended" | "latest" | "custom";
  docker_command_steps: DockerCommandSteps;
}

export interface DockerCommandStep {
  id: string;
  type: "custom-node";
  data: {
    name: string;
    hash?: string;
    url: string;
    files: string[];
    install_type: "git-clone";
    pip?: string[];
    meta?: {
      message: string;
      latest_hash?: string;
      committer?: {
        name: string;
        // email: string;
        // date: string;
      };
      // commit_url: string;
      stargazers_count?: number;
    };
  };
}

interface DockerCommandSteps {
  steps: DockerCommandStep[];
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
    gpuType: "A10G",
    comfyUiHash: comfyui_hash,
    selectedComfyOption: "recommended",
    docker_command_steps: {
      steps: [],
    },
  });

  const STEPS: Step<MachineStepValidation>[] = [
    {
      id: 1,
      title: "Create Machine",
      component: WorkflowImportNewMachineSetup,
      validate: (validation) => {
        const { machineName, comfyUiHash, gpuType, selectedComfyOption } =
          validation;

        if (!machineName?.trim()) {
          return { isValid: false, error: "Please enter a machine name" };
        }

        if (!gpuType) {
          return { isValid: false, error: "Please select a GPU type" };
        }

        if (selectedComfyOption === "custom" && !comfyUiHash?.trim()) {
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
            const response = await api({
              url: "machine/serverless",
              init: {
                method: "POST",
                body: JSON.stringify({
                  name: validation.machineName,
                  comfyui_version: validation.comfyUiHash,
                  gpu: validation.gpuType,
                  docker_command_steps: validation.docker_command_steps,
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
