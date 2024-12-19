"use client";

// import { useSelectedVersion } from "@/components/VersionSelectV2";
// import { WorkflowCommitVersion } from "@/components/WorkflowCommitVersion";
// import { WorkflowDiff } from "@/components/WorkflowDiff";
import { Button } from "@/components/ui/button";
import {
  useSelectedVersion,
  useWorkflowStore,
} from "@/components/workspace/Workspace";
import { sendWorkflow } from "@/components/workspace/sendEventToCD";
import { useWorkflowIdInWorkflowPage } from "@/hooks/hook";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Diff, RefreshCcw, Save } from "lucide-react";
import { use, useState } from "react";
import { toast } from "sonner";

type WorkspaceStatusBarProps = {
  endpoint: string;
};

export function WorkspaceStatusBar({ endpoint }: WorkspaceStatusBarProps) {
  // const { workflowId, readonly } = use(WorkspaceContext);
  const workflowId = useWorkflowIdInWorkflowPage();
  const readonly = false;
  const { value: selectedVersion } = useSelectedVersion(workflowId);
  const hasChanged = useWorkflowStore((state) => state.hasChanged);

  const [displayDiff, setDisplayDiff] = useState(false);
  const [displayCommit, setDisplayCommit] = useState(false);

  return (
    <>
      {/* {displayCommit && !readonly && (
        <WorkflowCommitVersion setOpen={setDisplayCommit} endpoint={endpoint} />
      )} */}

      {/* {displayDiff && !readonly && (
        <WorkflowDiff
          workflowId={workflowId}
          onClose={() => setDisplayDiff(false)}
          onSave={() => {
            setDisplayDiff(false);
            setDisplayCommit(true);
          }}
        />
      )} */}
      <AnimatePresence>
        {hasChanged && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-yellow-100/80 px-2 py-1 text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle size={12} className="text-yellow-800" />
                <span className="text-yellow-800">Unsaved changes</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  className="pointer-events-auto"
                  disabled={readonly}
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    sendWorkflow(selectedVersion.workflow);
                    toast.success("Discarded changes");
                  }}
                  Icon={RefreshCcw}
                  iconPlacement="right"
                  confirm
                >
                  Discard
                </Button>
                <Button
                  className="pointer-events-auto"
                  disabled={readonly}
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    setDisplayDiff(true);
                  }}
                  Icon={Diff}
                  iconPlacement="right"
                >
                  Diff
                </Button>
                <Button
                  className="pointer-events-auto"
                  disabled={readonly}
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    setDisplayCommit(true);
                  }}
                  Icon={Save}
                  iconPlacement="right"
                >
                  Save
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
