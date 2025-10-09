import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VersionSelectV2 } from "@/components/version-select";
import { MachineSelect } from "@/components/workspace/MachineSelect";
import { useCurrentWorkflow } from "@/hooks/use-current-workflow";
import { useMachine } from "@/hooks/use-machine";
import { cn } from "@/lib/utils";

interface Version {
  id: string;
  version: number;
  workflow_api: string;
}

interface Deployment {
  id: string;
  environment: string;
  workflow_version_id: string;
  machine_id: string;
  workflow_id: string;
}

interface DeploymentFormProps {
  workflowId: string;
  isUpdateMode?: boolean;
  deploymentToUpdate?: Deployment | null;
  selectedVersion?: Version | null;
  publicLinkOnly?: boolean;
  onSubmit: (data: {
    selectedWorkflowVersion: Version | null;
    selectedEnvironment: string;
    selectedMachineId: string;
  }) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function DeploymentForm({
  workflowId,
  isUpdateMode = false,
  deploymentToUpdate = null,
  selectedVersion = null,
  publicLinkOnly = false,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: DeploymentFormProps) {
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    | "staging"
    | "production"
    | "public-share"
    | "private-share"
    | "community-share"
  >(
    isUpdateMode && deploymentToUpdate
      ? (deploymentToUpdate.environment as any)
      : publicLinkOnly
        ? "public-share"
        : "staging",
  );

  const [selectedWorkflowVersion, setSelectedWorkflowVersion] =
    useState<Version | null>(selectedVersion);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(
    null,
  );

  const { workflow } = useCurrentWorkflow(workflowId);

  // Get workflow versions for version selection
  const { data: workflowVersions } = useQuery<Version[]>({
    queryKey: ["workflow", workflowId, "versions"],
    enabled: !!workflowId,
  });

  const final_machine = useMachine(
    selectedMachineId ?? workflow?.selected_machine_id,
  );
  const machine = final_machine.data;

  // Initialize form values
  useEffect(() => {
    if (isUpdateMode && deploymentToUpdate) {
      setSelectedEnvironment(deploymentToUpdate.environment as any);
      setSelectedMachineId(deploymentToUpdate.machine_id);
    } else if (machine?.id) {
      setSelectedMachineId(machine.id);
    }
  }, [deploymentToUpdate, isUpdateMode, machine?.id]);

  // Initialize selected version
  useEffect(() => {
    if (isUpdateMode && deploymentToUpdate && workflowVersions) {
      const currentVersion = workflowVersions.find(
        (v: Version) => v.id === deploymentToUpdate.workflow_version_id,
      );
      setSelectedWorkflowVersion(currentVersion || null);
    } else {
      setSelectedWorkflowVersion(selectedVersion);
    }
  }, [selectedVersion, isUpdateMode, deploymentToUpdate, workflowVersions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      selectedWorkflowVersion,
      selectedEnvironment,
      selectedMachineId: selectedMachineId || "",
    });
  };

  const showCommunity = false;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-medium text-lg">
          {isUpdateMode ? "Update Deployment" : "Deploy Version"}
        </h3>
        {selectedWorkflowVersion && (
          <Badge>v{selectedWorkflowVersion.version}</Badge>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-sm">
            {publicLinkOnly || isUpdateMode ? "Visibility" : "Environment"}
          </h3>
          <Tabs
            value={selectedEnvironment}
            onValueChange={(value) =>
              setSelectedEnvironment(
                value as
                  | "staging"
                  | "production"
                  | "public-share"
                  | "private-share"
                  | "community-share",
              )
            }
          >
            <TabsList className="inline-flex h-fit items-center rounded-lg bg-white/95 ring-1 ring-gray-200/50 dark:bg-zinc-800 dark:ring-zinc-700/50">
              {!publicLinkOnly && !isUpdateMode ? (
                <>
                  <TabsTrigger
                    value="staging"
                    className={cn(
                      "rounded-md px-4 py-1.5 font-medium text-sm transition-all",
                      selectedEnvironment === "staging"
                        ? "bg-gradient-to-b from-white to-yellow-100 shadow-sm ring-1 ring-gray-200/50 dark:from-zinc-800 dark:to-yellow-900 dark:ring-yellow-900/50"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700",
                    )}
                  >
                    Staging
                  </TabsTrigger>
                  <TabsTrigger
                    value="production"
                    className={cn(
                      "rounded-md px-4 py-1.5 font-medium text-sm transition-all",
                      selectedEnvironment === "production"
                        ? "bg-gradient-to-b from-white to-blue-100 shadow-sm ring-1 ring-gray-200/50 dark:from-zinc-800 dark:to-blue-900 dark:ring-blue-900/50"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700",
                    )}
                  >
                    Production
                  </TabsTrigger>
                </>
              ) : (
                <>
                  <TabsTrigger
                    value="public-share"
                    className={cn(
                      "rounded-md px-4 py-1.5 font-medium text-sm transition-all",
                      selectedEnvironment === "public-share"
                        ? "bg-gradient-to-b from-white to-green-100 shadow-sm ring-1 ring-gray-200/50 dark:from-zinc-800 dark:to-green-900 dark:ring-green-900/50"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700",
                    )}
                  >
                    Link Access
                  </TabsTrigger>
                  {showCommunity && (
                    <TabsTrigger
                      value="community-share"
                      className={cn(
                        "rounded-md px-4 py-1.5 font-medium text-sm transition-all",
                        selectedEnvironment === "community-share"
                          ? "bg-gradient-to-b from-white to-orange-100 shadow-sm ring-1 ring-gray-200/50 dark:from-zinc-800 dark:to-orange-900 dark:ring-orange-900/50"
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700",
                      )}
                    >
                      Community
                    </TabsTrigger>
                  )}
                  <TabsTrigger
                    value="private-share"
                    className={cn(
                      "rounded-md px-4 py-1.5 font-medium text-sm transition-all",
                      selectedEnvironment === "private-share"
                        ? "bg-gradient-to-b from-white to-purple-100 shadow-sm ring-1 ring-gray-200/50 dark:from-zinc-800 dark:to-purple-900 dark:ring-purple-900/50"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700",
                    )}
                  >
                    Internal
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </Tabs>
          <div className="mt-1 ml-2 text-2xs text-muted-foreground">
            {selectedEnvironment === "public-share"
              ? "This deployment will be accessible via a public link. Anyone with the link can access it."
              : selectedEnvironment === "private-share"
                ? "This deployment will only be accessible within your organization."
                : selectedEnvironment === "community-share"
                  ? "This deployment will be visible in the community."
                  : null}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-sm">Workflow Version</h3>
          <VersionSelectV2
            workflow_id={workflowId}
            selectedVersion={selectedWorkflowVersion}
            onSelect={setSelectedWorkflowVersion}
            className="w-full border bg-background p-5"
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-sm">Machine</h3>
          <MachineSelect
            workflow_id={workflowId}
            value={selectedMachineId ?? ""}
            onChange={(value) => setSelectedMachineId(value)}
            className="rounded-md border bg-background"
          />
        </div>

        {!isUpdateMode && !selectedVersion?.workflow_api && (
          <div className="text-center text-muted-foreground text-sm">
            Please save a new version in ComfyUI to deploy this workflow.
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              !selectedMachineId ||
              final_machine.isLoading ||
              (!isUpdateMode && !selectedVersion?.workflow_api) ||
              (isUpdateMode && !selectedWorkflowVersion)
            }
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUpdateMode ? "Update" : "Deploy"}
          </Button>
        </div>
      </form>
    </div>
  );
}
