"use client";

import { useCurrentWorkflow } from "@/hooks/use-current-workflow";
import { useMachine } from "@/hooks/use-machine";
import { cn } from "@/lib/utils";
import { getRelativeTime } from "@/lib/get-relative-time";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "../ui/badge";
import { LoadingIcon } from "../ui/custom/loading-icon";
import { useWorkflowVersion } from "../workflow-list";
import { SessionCreator } from "./SessionView";
import { WorkspaceLoading, WorkspaceMachineLoading } from "./WorkspaceLoading";
import { Button } from "../ui/button";
import { SessionCreationDialog } from "./session-creator-dialog";
import { MyDrawer } from "../drawer";
import { useState, useEffect } from "react";
import { VersionChecker } from "../machine/version-checker";
import { useQueryState } from "nuqs";
import { easeOut } from "framer-motion";
import { motion } from "framer-motion";

interface WorkspaceClientWrapperProps {
  workflow_id: string;
  className?: string;
  isPublic?: boolean;
}

interface MachineUpdateCheckerProps {
  machineId: string;
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

  const { data: versions, isLoading: isLoadingVersions } = useQuery({
    enabled: !!props.workflow_id,
    queryKey: ["workflow", props.workflow_id, "versions"],
    queryKeyHashFn: (queryKey) => [...queryKey, "latest"].toString(),
    meta: {
      limit: 1,
    },
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

  // console.log(
  //   "sessionId",
  //   sessionId,
  //   selectedSession,
  //   hasActiveSession,
  //   cachedSessionId,
  // );

  useEffect(() => {
    setHasActiveSession(false);
    setCachedSessionId(null);
  }, [props.workflow_id]);

  if (isLoadingWorkflow || isLoading || isLoadingVersions || !versions) {
    // return <WorkspaceLoading />;
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
        <div className="absolute inset-x-0 bottom-0 z-0 mx-auto max-w-xl">
          <MachineUpdateChecker machineId={machine.id} />
        </div>
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
          className="z-[10] h-full w-full bg-[#141414] relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: !!sessionId ? 1 : 0 }}
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
          <div className="absolute inset-0 z-[10] flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-gray-500">
                Starting a ComfyUI session to edit your workflow
              </p>
              <Button
                onClick={(e) =>
                  setSessionCreation((prev) => ({
                    ...prev,
                    isOpen: true,
                    version: versions[0].version,
                    machineId: workflow?.selected_machine_id,
                  }))
                }
              >
                Start ComfyUI
              </Button>
            </div>
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
