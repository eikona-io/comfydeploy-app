import { PaddingLayout } from "@/components/PaddingLayout";
import { RealtimeWorkflowProvider } from "@/components/workflows/RealtimeRunUpdate";
import RunComponent from "@/components/workflows/RunComponent";
import WorkflowComponent from "@/components/workflows/WorkflowComponent";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/workflows/$workflowId/$view")({
  component: WorkflowPageComponent,
});

function WorkflowPageComponent() {
  const { workflowId, view: currentView } = Route.useParams();

  const [mountedViews, setMountedViews] = useState<Set<string>>(
    new Set([currentView]),
  );

  useEffect(() => {
    if (currentView === "gallery") {
      return;
    }
    setMountedViews((prev) => {
      const newSet = new Set(prev);
      newSet.add(currentView);
      return newSet;
    });
  }, [currentView]);

  if (currentView === "workspace") {
    return (
      <PaddingLayout>
        <motion.div
          layout
          className={cn("flex h-full w-full flex-col gap-4 pt-4 lg:flex-row")}
        >
          <RealtimeWorkflowProvider workflowId={workflowId}>
            <RunComponent />
            <WorkflowComponent />
          </RealtimeWorkflowProvider>
        </motion.div>
      </PaddingLayout>
    );
  }

  return (
    <div className="p-2">
      <h3>Workflow {workflowId}</h3>
    </div>
  );
}
