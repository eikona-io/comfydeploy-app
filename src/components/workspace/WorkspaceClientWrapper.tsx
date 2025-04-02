"use client";

import { useCurrentWorkflow } from "@/hooks/use-current-workflow";
import { useMachine } from "@/hooks/use-machine";
import { getRelativeTime } from "@/lib/get-relative-time";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { easeOut } from "framer-motion";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { useQueryState } from "nuqs";
import { lazy, useEffect, useState } from "react";
import { MyDrawer } from "../drawer";
import { VersionChecker } from "../machine/version-checker";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { LoadingIcon } from "../ui/custom/loading-icon";
import { useWorkflowVersion } from "../workflow-list";
import { SessionCreator } from "./SessionView";
import { WorkspaceLoading, WorkspaceMachineLoading } from "./WorkspaceLoading";
import { SessionCreationDialog } from "./session-creator-dialog";
import { SessionCreatorForm } from "./session-creator-form";

const ComfyUIFlow = lazy(() =>
  import("../workflow-preview/comfyui-flow").then((mod) => ({
    default: mod.ComfyUIFlow,
  })),
);

interface WorkspaceClientWrapperProps {
  workflow_id: string;
  className?: string;
  isPublic?: boolean;
}

interface MachineUpdateCheckerProps {
  machineId: string;
}

interface WorkflowVersion {
  version: number;
  id: string;
  created_at: string;
}

function MachineUpdateChecker({ machineId }: MachineUpdateCheckerProps) {
  return (
    <VersionChecker
      machineId={machineId}
      variant="inline"
      onUpdate={() => {
        const url = `/machines/${machineId}?action=update-custom-nodes`;
        window.open(url, "_blank");
      }}
    />
  );
}

export function WorkspaceClientWrapper({
  ...props
}: WorkspaceClientWrapperProps) {
  const [sessionCreation, setSessionCreation] = useState({
    isOpen: false,
    version: 0,
    machineId: "",
    modalImageId: "",
    machineVersionId: "",
  });

  const [showPreview, setShowPreview] = useState(true);

  const [cachedSessionId, setCachedSessionId] = useState<string | null>(null);
  const [hasActiveSession, setHasActiveSession] = useState(false);

  const [sessionId, setSessionId] = useQueryState("sessionId");
  const { data: selectedSession } = useQuery({
    enabled: !!sessionId,
    queryKey: ["session", sessionId],
  });

  const {
    workflow,
    mutateWorkflow,
    isLoading: isLoadingWorkflow,
  } = useCurrentWorkflow(props.workflow_id);

  const { data: versions, isLoading: isLoadingVersions } = useQuery<
    WorkflowVersion[]
  >({
    enabled: !!props.workflow_id,
    queryKey: ["workflow", props.workflow_id, "versions"],
    queryKeyHashFn: (queryKey) => [...queryKey, "latest"].toString(),
    meta: {
      limit: 1,
    },
  });

  const [version] = useQueryState("version", {
    defaultValue: String(workflow?.versions[0].version ?? 1),
  });

  const { data: versionData, status } = useQuery<any>({
    queryKey: ["workflow", props.workflow_id, "version", version.toString()],
  });

  const { data: machine, isLoading } = useMachine(
    workflow?.selected_machine_id,
  );

  useEffect(() => {
    if (sessionId && selectedSession) {
      setHasActiveSession(true);
      setCachedSessionId(sessionId);
    }
  }, [sessionId, selectedSession]);

  useEffect(() => {
    setHasActiveSession(false);
    setCachedSessionId(null);
  }, []);

  if (isLoadingWorkflow || isLoading || isLoadingVersions || !versions) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingIcon />
      </div>
    );
  }

  if (!machine && !isLoading && !isLoadingWorkflow)
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center",
          props.className,
        )}
      >
        No machine selected, please select a machine at the bottom left.
      </div>
    );

  if (
    machine?.type === "comfy-deploy-serverless" &&
    machine?.status === "building"
  )
    return (
      <WorkspaceMachineLoading
        machine={machine}
        endpoint={`${process.env.NEXT_PUBLIC_CD_API_URL}/api/machine`}
      />
    );

  const machineBuilderVersion = machine?.machine_builder_version;

  if (Number.parseInt(machineBuilderVersion) >= 4) {
    return (
      <>
        {/* <div className="absolute inset-x-0 bottom-0 z-0 mx-auto max-w-xl">
        </div> */}
        <MyDrawer
          desktopClassName="w-[600px]"
          open={sessionCreation.isOpen}
          onClose={() =>
            setSessionCreation((prev) => ({ ...prev, isOpen: false }))
          }
        >
          <div className="flex h-full flex-col">
            <div className="mb-4 flex-none">
              <SessionCreationDialog
                workflowId={props.workflow_id}
                version={sessionCreation.version}
                machineId={sessionCreation.machineId}
                modalImageId={sessionCreation.modalImageId ?? undefined}
                machineVersionId={sessionCreation.machineVersionId ?? undefined}
                onClose={() =>
                  setSessionCreation((prev) => ({ ...prev, isOpen: false }))
                }
              />
            </div>
          </div>
        </MyDrawer>

        <motion.div
          className={cn(
            "absolute inset-0 z-[10] h-full w-full bg-[#141414]",
            sessionId ? "pointer-events-auto" : "pointer-events-none",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: sessionId ? 1 : 0 }}
          transition={{ duration: 0.2, ease: easeOut }}
        >
          <motion.div
            className="pointer-events-none absolute inset-0 backdrop-blur-sm"
            style={{
              backgroundImage: `linear-gradient(#2c2c2c 1px, transparent 1px),
                        linear-gradient(90deg, #2c2c2c 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: hasActiveSession ? 0.2 : 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
          />
          {hasActiveSession && cachedSessionId ? (
            <SessionCreator
              workflowId={props.workflow_id}
              sessionIdOverride={cachedSessionId}
            />
          ) : (
            <></>
          )}
        </motion.div>

        {!sessionId ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="pt-20 mx-auto flex h-full w-full max-w-xl px-4 flex-col gap-4">
              <div className="flex items-center justify-between">
                <SessionCreatorForm
                  workflowId={props.workflow_id}
                  version={versions[0]?.version ?? 0}
                  defaultMachineId={workflow?.selected_machine_id}
                  defaultMachineVersionId={
                    workflow?.selected_machine_version_id
                  }
                />
              </div>
              <MachineUpdateChecker machineId={machine.id} />
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowPreview(!showPreview)}
              className="ml-4 p-2"
            >
              {showPreview ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </Button>
            {versionData && showPreview && (
              <motion.div
                className="flex h-full w-full items-center justify-center bg-gray-50 shadow-lg rounded-l-lg border border-1 my-2 overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <ComfyUIFlow
                  workflow={versionData.workflow}
                  apiFormat={versionData.workflow_api}
                />
              </motion.div>
            )}
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center",
        props.className,
      )}
    >
      Machine builder version{" "}
      <Badge className="mx-2">{machineBuilderVersion}</Badge> and{" "}
      <Badge className="mx-2">{machine?.type}</Badge> is not supported for
      workflow preview.
    </div>
  );
}
