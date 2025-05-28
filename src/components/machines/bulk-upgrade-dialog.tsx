"use client";

import { api } from "@/lib/api";
import { callServerPromise } from "@/lib/call-server-promise";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { AlertCircleIcon, Info, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface BulkUpgradeDialogProps {
  selectedMachines: string[];
  machineData: any[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface UpgradeStatus {
  machineId: string;
  status: "pending" | "processing" | "success" | "error";
  message?: string;
}

export function BulkUpgradeDialog({
  selectedMachines,
  machineData,
  open,
  onOpenChange,
  onSuccess,
}: BulkUpgradeDialogProps) {
  const [upgradeStatuses, setUpgradeStatuses] = useState<UpgradeStatus[]>([]);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [currentMachineIndex, setCurrentMachineIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  const machinesToUpgrade = machineData.filter(
    (machine) =>
      machine.machine_builder_version &&
      Number(machine.machine_builder_version) < 4 &&
      machine.type === "comfy-deploy-serverless" &&
      machine.status === "ready" &&
      selectedMachines.includes(machine.id)
  );

  const handleUpgrade = async () => {
    if (machinesToUpgrade.length === 0) {
      toast.error("No machines selected that require upgrade");
      onOpenChange(false);
      return;
    }

    setIsUpgrading(true);
    
    const initialStatuses = machinesToUpgrade.map((machine) => ({
      machineId: machine.id,
      status: "pending" as const,
    }));
    setUpgradeStatuses(initialStatuses);
    
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < machinesToUpgrade.length; i++) {
      const machine = machinesToUpgrade[i];
      setCurrentMachineIndex(i);
      
      setUpgradeStatuses((prev) =>
        prev.map((status) =>
          status.machineId === machine.id
            ? { ...status, status: "processing" }
            : status
        )
      );

      try {
        const updatedMachine = {
          ...machine,
          machine_builder_version: "4",
          docker_command_steps: {
            ...machine.docker_command_steps,
            steps: machine.docker_command_steps.steps.filter(
              (step: any) =>
                step?.type !== "custom-node" ||
                !step?.data?.url
                  ?.toLowerCase()
                  ?.includes("github.com/bennykok/comfyui-deploy")
            ),
          },
        };

        await callServerPromise(
          api({
            url: `machine/serverless/${machine.id}`,
            init: {
              method: "PATCH",
              body: JSON.stringify({
                machine_builder_version: "4",
                docker_command_steps: updatedMachine.docker_command_steps,
                is_trigger_rebuild: true,
              }),
            },
          }),
          {
            loadingText: `Upgrading machine ${i + 1}/${machinesToUpgrade.length}...`,
          }
        );

        setUpgradeStatuses((prev) =>
          prev.map((status) =>
            status.machineId === machine.id
              ? { ...status, status: "success" }
              : status
          )
        );
        successCount++;
      } catch (error) {
        console.error(`Error upgrading machine ${machine.id}:`, error);
        
        setUpgradeStatuses((prev) =>
          prev.map((status) =>
            status.machineId === machine.id
              ? { 
                  ...status, 
                  status: "error",
                  message: error instanceof Error ? error.message : "Unknown error"
                }
              : status
          )
        );
        errorCount++;
      }

      const progress = Math.round(((i + 1) / machinesToUpgrade.length) * 100);
      setOverallProgress(progress);
    }

    if (errorCount === 0) {
      toast.success(`Successfully upgraded ${successCount} machines`);
    } else if (successCount === 0) {
      toast.error(`Failed to upgrade all ${errorCount} machines`);
    } else {
      toast.info(
        `Upgraded ${successCount} machines, failed to upgrade ${errorCount} machines`
      );
    }

    onSuccess();
    setIsUpgrading(false);
  };

  const resetState = () => {
    setUpgradeStatuses([]);
    setIsUpgrading(false);
    setCurrentMachineIndex(0);
    setOverallProgress(0);
  };

  const handleClose = () => {
    if (!isUpgrading) {
      resetState();
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bulk Upgrade Machines to v4
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            {machinesToUpgrade.length > 0 ? (
              <>
                <p>
                  You are about to upgrade {machinesToUpgrade.length} machines to v4.
                  This process:
                </p>
                <ul className="list-disc pl-4 text-sm">
                  <li>Upgrades comfy deploy node to latest version</li>
                  <li>Preserves custom nodes</li>
                  <li>Rebuilds each machine</li>
                </ul>

                <div className="mt-4 space-y-2">
                  <p className="font-medium text-sm">Selected machines:</p>
                  <div className="max-h-32 overflow-y-auto rounded border p-2">
                    {machinesToUpgrade.map((machine) => (
                      <div key={machine.id} className="flex items-center justify-between py-1">
                        <span className="text-sm">{machine.name}</span>
                        <Badge variant="outline" className="text-xs">
                          v{machine.machine_builder_version}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert variant="warning" className="mt-2 bg-yellow-50">
                  <AlertCircleIcon className="h-4 w-4" />
                  <AlertTitle>Production Deployments</AlertTitle>
                  <AlertDescription>
                    If you have any active production deployments using these
                    machines, it is{" "}
                    <span className="font-semibold">
                      recommended to clone new machines{" "}
                    </span>
                    and migrate to make sure your workflows are not affected.
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <Alert variant="destructive" className="mt-2">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>No Eligible Machines</AlertTitle>
                <AlertDescription>
                  None of the selected machines require an upgrade to v4.
                  Please select machines with version lower than 4.
                </AlertDescription>
              </Alert>
            )}

            {isUpgrading && (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Machine Status:</p>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {upgradeStatuses.map((status) => {
                      const machine = machineData.find(m => m.id === status.machineId);
                      return (
                        <div 
                          key={status.machineId} 
                          className={cn(
                            "flex items-center justify-between rounded border p-2",
                            status.status === "success" && "border-green-200 bg-green-50",
                            status.status === "error" && "border-red-200 bg-red-50",
                            status.status === "processing" && "border-blue-200 bg-blue-50"
                          )}
                        >
                          <span className="text-sm">{machine?.name}</span>
                          <Badge 
                            variant={
                              status.status === "success" ? "success" : 
                              status.status === "error" ? "destructive" : 
                              status.status === "processing" ? "default" : 
                              "outline"
                            }
                            className="text-xs"
                          >
                            {status.status === "pending" && "Pending"}
                            {status.status === "processing" && "Processing"}
                            {status.status === "success" && "Success"}
                            {status.status === "error" && "Failed"}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isUpgrading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUpgrade}
            disabled={isUpgrading || machinesToUpgrade.length === 0}
            className={cn(
              "flex items-center gap-2",
              isUpgrading && "cursor-not-allowed opacity-50"
            )}
          >
            {isUpgrading ? (
              "Upgrading..."
            ) : (
              <>
                <RefreshCcw className="h-4 w-4" />
                Upgrade Machines
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
