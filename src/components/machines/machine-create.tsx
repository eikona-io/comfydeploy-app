import { Link, useNavigate } from "@tanstack/react-router";
import { useCustomer } from "autumn-js/react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useCurrentPlan,
  useCurrentPlanWithStatus,
} from "@/hooks/use-current-plan";
import { useMachine } from "@/hooks/use-machine";
import { api } from "@/lib/api";
import type { Feature as AutumnFeature } from "@/types/autumn-v2";
import { useLatestHashes } from "@/utils/comfydeploy-hash";
import { MachineSettingsWrapper } from "../machine/machine-settings";
import { LoadingIcon } from "../ui/custom/loading-icon";
import { Input } from "../ui/input";

const createNewMachine = (latestHashes: any, maxGPU: number = 1) => ({
  name: "My New Machine",
  id: "new",
  type: "comfy-deploy-serverless",
  gpu: "A10G",
  comfyui_version:
    latestHashes?.comfyui_hash || "158419f3a0017c2ce123484b14b6c527716d6ec8",
  docker_command_steps: {
    steps: [
      {
        id: "comfyui-deploy",
        type: "custom-node",
        data: {
          name: "ComfyUI Deploy",
          url: "https://github.com/BennyKok/comfyui-deploy",
          files: ["https://github.com/BennyKok/comfyui-deploy"],
          install_type: "git-clone",
          hash:
            latestHashes?.comfydeploy_hash ||
            "c47865ec266daf924cc7ef19223e9cf70122eb41",
        },
      },
    ],
  },

  // default values
  machine_builder_version: "4",
  allow_concurrent_inputs: 1,
  concurrency_limit: maxGPU,
  run_timeout: 300,
  idle_timeout: 60,
  ws_timeout: 2,
  python_version: "3.11",
  models_to_cache: [],
  enable_gpu_memory_snapshot: false,
  extra_docker_commands: [],
});

export function filterMachineConfig(machine: any) {
  // Pick only the fields defined in MachineConfig
  return {
    id: machine.id,
    name: `${machine.name} (Clone)`,
    type: machine.type,
    comfyui_version: machine.comfyui_version,
    docker_command_steps: machine.docker_command_steps,
    gpu: machine.gpu,
    concurrency_limit: machine.concurrency_limit,
    run_timeout: machine.run_timeout,
    idle_timeout: machine.idle_timeout,
    keep_warm: machine.keep_warm,
    install_custom_node_with_gpu: machine.install_custom_node_with_gpu,
    ws_timeout: machine.ws_timeout,
    extra_docker_commands: machine.extra_docker_commands,
    allow_concurrent_inputs: machine.allow_concurrent_inputs,
    machine_builder_version: machine.machine_builder_version,
    base_docker_image: machine.base_docker_image,
    python_version: machine.python_version,
    extra_args: machine.extra_args,
    disable_metadata: machine.disable_metadata,
    prestart_command: machine.prestart_command,
    models_to_cache: machine.models_to_cache,
    enable_gpu_memory_snapshot: machine.enable_gpu_memory_snapshot,
  };
}

export function MachineCreate() {
  const navigate = useNavigate({ from: "/machines" });

  // Fetch plan feature for GPU concurrency limit
  const { check: checkFeature, isLoading: isCustomerLoading } = useCustomer();
  const concurrencyCheck = checkFeature({ featureId: "gpu_concurrency_limit" });
  const planMaxGPU = concurrencyCheck.data?.included_usage ?? 1;

  const { check, isLoading: isAutumnLoading } = useCustomer();
  const machineLimitedFeature = check({ featureId: "machine_limit" });
  const machineLimited = !machineLimitedFeature.data?.allowed;

  const [cloneMachineId, setCloneMachineId] = useQueryState("machineId");
  const { data: machine, isLoading } = useMachine(cloneMachineId ?? undefined);
  const { data: latestHashes } = useLatestHashes();

  // Initialize with newMachine if not cloning, otherwise wait for machine data
  const [formValues, setFormValues] = useState<any>(
    cloneMachineId ? undefined : createNewMachine(latestHashes, planMaxGPU),
  );

  // Update formValues when machine data is loaded
  useEffect(() => {
    if (machine && cloneMachineId) {
      setFormValues(filterMachineConfig(machine));
    }
  }, [machine, cloneMachineId]);

  // machine limit effect
  useEffect(() => {
    if (machineLimited && !isAutumnLoading) {
      navigate({
        search: { view: undefined, action: undefined },
      });
    }
  }, [machineLimited, navigate, isAutumnLoading]);

  if (isAutumnLoading) {
    return (
      <div>
        <LoadingIcon />
      </div>
    );
  }

  if (cloneMachineId && (!formValues || isLoading)) {
    return (
      <div>
        <LoadingIcon />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="flex h-full w-full justify-center md:py-0">
        <div className="mx-4 my-auto w-full max-w-5xl py-20">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ filter: "blur(2px)", opacity: 0, y: 20 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              exit={{ filter: "blur(2px)", opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <h1 className="mb-4 font-medium text-xl">
                {cloneMachineId ? "Clone Machine" : "Create Machine"}
              </h1>
              <div className="mb-1">
                <div className="mb-2">
                  <span className="font-medium text-sm">Machine Name </span>
                  <span className="text-red-500">*</span>
                </div>
                <Input
                  placeholder="Machine name..."
                  value={formValues?.name}
                  onChange={(e) =>
                    setFormValues((prev: any) =>
                      prev
                        ? { ...prev, name: e.target.value }
                        : createNewMachine(latestHashes),
                    )
                  }
                />
              </div>
              <MachineSettingsWrapper
                title={<div />}
                machine={formValues}
                onValueChange={(key, value) => {
                  setFormValues((prev: any) =>
                    prev
                      ? { ...prev, [key]: value }
                      : createNewMachine(latestHashes),
                  );
                }}
                disableUnsavedChangesWarningServerless={true}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="fixed right-8 bottom-12 flex flex-row gap-2">
        <Button
          variant="outline"
          onClick={() => {
            navigate({
              to: "/machines",
              search: { view: undefined, action: undefined },
            });
          }}
          className="drop-shadow-md"
        >
          Back
        </Button>
        <Button
          Icon={ChevronRight}
          iconPlacement="right"
          disabled={!formValues?.name.trim()}
          onClick={async () => {
            const { id, ...filteredData } = formValues;
            if (filteredData.machine_builder_version < 4) {
              toast.warning(
                "Required to upgrade to builder v4 for better compatibility...",
              );
              filteredData.machine_builder_version = 4;
            }

            try {
              const response = await api({
                url: "machine/serverless",
                init: {
                  method: "POST",
                  body: JSON.stringify(filteredData),
                },
              });

              toast.success(`${filteredData?.name} created successfully!`);
              const machineId = response.id;

              // toast.info("Redirecting to machine page...");
              await new Promise((resolve) => setTimeout(resolve, 1000));
              navigate({
                to: "/machines/$machineId",
                params: { machineId },
              });

              return true;
            } catch (error) {
              toast.error("Failed to create");
              return false;
            }
          }}
          className="drop-shadow-md"
        >
          {cloneMachineId ? "Clone" : "Create"}
        </Button>
      </div>
    </div>
  );
}
