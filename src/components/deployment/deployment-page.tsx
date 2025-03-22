import { useParams } from "@tanstack/react-router";
import type { GpuTypes } from "../onboarding/workflow-machine-import";
import { VersionList } from "../version-select";
import { cn } from "@/lib/utils";
import {
  getEnvColor,
  useWorkflowDeployments,
} from "../workspace/ContainersTable";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "../ui/badge";
import { UserIcon } from "../run/SharePageComponent";
import { getRelativeTime } from "@/lib/get-relative-time";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Copy, Loader2, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import { callServerPromise } from "@/lib/call-server-promise";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useMachine } from "@/hooks/use-machine";
import { useCurrentWorkflow } from "@/hooks/use-current-workflow";
import { useState } from "react";
import { create } from "zustand";
import { DeploymentDrawer } from "../workspace/DeploymentDisplay";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export interface Deployment {
  id: string;
  environment: string;
  workflow_id: string;
  workflow_version_id: string;
  gpu: GpuTypes;
  concurrency_limit: number;
  run_timeout: number;
  idle_timeout: number;
  keep_warm: number;
  modal_image_id?: string;
  version?: {
    version: number;
  };
  dub_link?: string;
  machine_id: string;
  created_at: string;
  updated_at: string;
  machine: {
    name: string;
  };
}

interface Version {
  id: string;
  comfyui_snapshot: string;
  version: number;
  machine_id: string;
  machine_version_id: string;
  modal_image_id: string;
  comment: string;
  created_at: string;
  user_id: string;
  workflow: string;
  workflow_api: string;
}

interface SelectedDeploymentState {
  selectedDeployment: string | null;
  setSelectedDeployment: (deployment: string | null) => void;
}

export const useSelectedDeploymentStore = create<SelectedDeploymentState>(
  (set) => ({
    selectedDeployment: null,
    setSelectedDeployment: (deployment) =>
      set({ selectedDeployment: deployment }),
  }),
);

export function DeploymentPage() {
  const { workflowId } = useParams({ from: "/workflows/$workflowId/$view" });
  const { data: deployments, isLoading: isDeploymentsLoading } =
    useWorkflowDeployments(workflowId);

  return (
    <>
      <div className="mx-auto max-w-screen-lg">
        <div className="mt-10 mb-4 flex flex-col gap-2">
          <h2 className="font-bold text-2xl">Deployment</h2>
          <p className="text-muted-foreground text-sm">
            Select a version and deploy it to an environment.
          </p>
        </div>
        <h3 className="mb-2 ml-2 font-medium text-sm">History</h3>
        <div className="rounded-md bg-background p-1 shadow-sm ring-1 ring-gray-200">
          {isDeploymentsLoading ? (
            <div className="flex h-[80px] flex-col items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <>
              {deployments?.some((d: Deployment) =>
                ["production", "staging"].includes(d.environment),
              ) ? (
                <div className="flex flex-col">
                  {deployments
                    .filter((d: Deployment) =>
                      ["production", "staging"].includes(d.environment),
                    )
                    .map((deployment: Deployment) => (
                      <DeploymentHistory
                        key={deployment.id}
                        deployment={deployment}
                      />
                    ))}
                </div>
              ) : (
                <div className="flex h-[80px] flex-col items-center justify-center">
                  <p className="text-muted-foreground text-xs">
                    No deployments yet
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <h3 className="mt-4 mb-2 ml-2 font-medium text-sm">Versions</h3>
        <DeploymentWorkflowVersionList workflowId={workflowId} />
      </div>
      <DeploymentDrawer />
    </>
  );
}

function DeploymentHistory({ deployment }: { deployment: Deployment }) {
  const { setSelectedDeployment } = useSelectedDeploymentStore();
  console.log(deployment);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      className="grid cursor-pointer grid-cols-3 items-center rounded-[8px] border-gray-100 border-b px-3 py-1.5 text-xs last:border-b-0 hover:bg-gray-50"
      onClick={() => {
        setSelectedDeployment(deployment.id);
      }}
    >
      {/* Left column */}
      <div className="flex items-center gap-3">
        <span className="shrink-0 font-mono text-2xs text-muted-foreground">
          #{deployment.id.slice(0, 8)}
        </span>
        <Badge className={cn("!text-2xs", getEnvColor(deployment.environment))}>
          {deployment.environment}
        </Badge>

        {deployment.version?.version && (
          <Badge variant="secondary" className="!text-2xs py-0 font-medium">
            v{deployment.version.version}
          </Badge>
        )}
      </div>

      {/* Center column - Machine info */}
      <div className="flex items-center justify-center gap-4 overflow-hidden">
        <span
          className="max-w-[150px] truncate text-muted-foreground text-xs"
          title={deployment.machine.name}
        >
          {deployment.machine.name}
        </span>
        {deployment.gpu && (
          <Badge variant="outline" className="!text-2xs font-normal">
            {deployment.gpu}
          </Badge>
        )}
      </div>

      {/* Right column */}
      <div className="flex items-center justify-end gap-3">
        <span className="whitespace-nowrap text-2xs text-muted-foreground">
          {getRelativeTime(deployment.updated_at)}
        </span>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0.5"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.preventDefault();
                  e.nativeEvent.stopPropagation();
                  navigator.clipboard.writeText(deployment.id);
                  toast.success("ID copied to clipboard");
                }}
              >
                <Copy size={13} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-2xs">Copy ID</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

function DeploymentWorkflowVersionList({ workflowId }: { workflowId: string }) {
  const { workflow } = useCurrentWorkflow(workflowId);
  const { data: machine } = useMachine(workflow?.selected_machine_id);
  const { data: deployments, refetch: refetchDeployments } =
    useWorkflowDeployments(workflowId);
  const { data: versions } = useQuery<Version[]>({
    queryKey: ["workflow", workflowId, "versions"],
    meta: {
      params: {
        limit: 1,
        offset: 0,
      },
    },
  });
  const { setSelectedDeployment } = useSelectedDeploymentStore();
  const [isPromoting, setIsPromoting] = useState(false);

  const handlePromoteToEnv = async ({
    environment,
    workflowVersionId,
    machineId,
    machineVersionId,
  }: {
    environment: "production" | "staging";
    workflowVersionId: string;
    machineId: string;
    machineVersionId: string;
  }) => {
    try {
      setIsPromoting(true);
      const deployment = await callServerPromise(
        api({
          url: "deployment",
          init: {
            method: "POST",
            body: JSON.stringify({
              workflow_id: workflowId,
              workflow_version_id: workflowVersionId,
              machine_id: machineId,
              machine_version_id: machineVersionId,
              environment,
            }),
          },
        }),
      );
      refetchDeployments();
      setSelectedDeployment(deployment.id);
      toast.success("Deployment promoted successfully");
    } catch (error) {
      toast.error("Failed to promote deployment");
    } finally {
      setIsPromoting(false);
    }
  };

  return (
    <VersionList
      hideSearch
      workflow_id={workflowId || ""}
      className="relative z-[1] w-full rounded-md bg-background p-1 shadow-sm ring-1 ring-gray-200"
      containerClassName="max-h-[234px]"
      height={30}
      renderItem={(item: Version) => {
        const myDeployments = deployments?.filter(
          (deployment: Deployment) =>
            deployment.workflow_version_id === item.id,
        );

        return (
          <div
            className={cn(
              "flex flex-row items-center justify-between gap-2 rounded-[6px] px-4 transition-colors hover:bg-gray-100",
              item.version === 1 && "rounded-b-sm",
              item.version === versions?.[versions.length - 1]?.version &&
                "rounded-t-sm",
            )}
          >
            <div className="grid grid-cols-[14px_38px_auto_1fr] items-center gap-4">
              <div className="flex h-full items-center justify-center">
                {versions && (
                  <>
                    <div
                      className={cn(
                        "absolute w-[2px] bg-gray-300",
                        item.version === 1
                          ? "top-0 h-[50%]"
                          : item.version === versions?.[0]?.version
                            ? "bottom-0 h-[50%]"
                            : "h-full",
                      )}
                    />
                    <div className="relative z-10 flex h-[6px] w-[6px] items-center justify-center rounded-full bg-gray-300" />
                  </>
                )}
              </div>

              <Badge className="!py-0 !text-2xs w-fit whitespace-nowrap rounded-sm">
                v{item.version}
              </Badge>

              <div className="truncate text-muted-foreground text-xs">
                {item.comment}
              </div>
            </div>
            <div className="grid grid-cols-[auto_auto_110px_30px] items-center gap-4">
              {myDeployments?.length > 0 ? (
                <div className="flex flex-row gap-2">
                  {myDeployments
                    .filter(
                      (deployment: Deployment) =>
                        deployment.environment === "production" ||
                        deployment.environment === "staging",
                    )
                    .map((deployment: Deployment) => (
                      <Badge
                        key={deployment.id}
                        className={cn(
                          "!text-2xs w-fit cursor-pointer whitespace-nowrap rounded-md hover:shadow-sm",
                          getEnvColor(deployment.environment),
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.nativeEvent.preventDefault();
                          e.nativeEvent.stopPropagation();

                          setSelectedDeployment(deployment.id);
                        }}
                      >
                        {deployment.environment}
                      </Badge>
                    ))}
                </div>
              ) : (
                <div />
              )}
              <UserIcon user_id={item.user_id} className="h-5 w-5" />
              <div className="whitespace-nowrap text-2xs text-muted-foreground">
                {getRelativeTime(item.created_at)}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  className="h-full w-full rounded-sm p-2 hover:bg-gray-50"
                  onClick={(e) => e.stopPropagation()} // Prevent triggering the row click
                >
                  <MoreVertical size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 overflow-visible">
                  <DropdownMenuItem
                    className="p-0"
                    disabled={isPromoting}
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.preventDefault();
                      e.nativeEvent.stopPropagation();
                      await handlePromoteToEnv({
                        environment: "production",
                        workflowVersionId: item.id,
                        machineId: machine?.id,
                        machineVersionId: machine?.machine_version_id,
                      });
                    }}
                  >
                    <Button
                      variant={"ghost"}
                      className="w-full justify-between gap-2 px-2 font-normal"
                    >
                      <div className="flex flex-row gap-2">
                        Promote to
                        <Badge variant="blue">production</Badge>
                      </div>
                      {isPromoting && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="p-0"
                    disabled={isPromoting}
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.preventDefault();
                      e.nativeEvent.stopPropagation();
                      await handlePromoteToEnv({
                        environment: "staging",
                        workflowVersionId: item.id,
                        machineId: machine?.id,
                        machineVersionId: machine?.machine_version_id,
                      });
                    }}
                  >
                    <Button
                      variant={"ghost"}
                      className="w-full justify-between gap-2 px-2 font-normal"
                    >
                      <div className="flex flex-row gap-2">
                        Promote to
                        <Badge variant="yellow">staging</Badge>
                      </div>
                      {isPromoting && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      }}
    />
  );
}
