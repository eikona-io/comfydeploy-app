"use client";

import React from "react";

import { useRunsTableStore } from "@/components/workflows/RunsTable";
import { useProgressUpdates } from "@/hooks/use-progress-update";
import { useQueryClient } from "@tanstack/react-query";

export function useRealtimeWorkflowUpdate2(workflow_id: string) {
  const queryClient = useQueryClient();

  const { progressUpdates, connectionStatus } = useProgressUpdates({
    workflowId: workflow_id,
    returnRun: true,
    reconnect: true,
    onUpdate: (update) => {
      const data = update as any;

      queryClient.setQueryData(
        ["v2", "workflow", workflow_id, "runs"],
        (oldData: any) => {
          // console.log("oldData", oldData);
          if (!oldData) return oldData;
          let exist = false;
          let newRunNumber = 1;
          if (oldData.pages.length > 0 && oldData.pages[0].length > 0) {
            const highestRunNumber = Math.max(
              ...oldData.pages[0].map((run: any) => run.number || 0),
            );
            newRunNumber = highestRunNumber + 1;
          }

          const updatedPages = oldData.pages.map((page: any[]) => {
            const index = page.findIndex((run) => run.id === data.id);
            if (index !== -1) {
              exist = true;
              // Update existing run
              const updatedRuns = [...page];
              const updatedRun = { ...data, number: newRunNumber };
              updatedRuns[index] = updatedRun;

              // Update the selected cell if it's the current run
              if (useRunsTableStore.getState().selectedCell?.id === data.id) {
                useRunsTableStore.setState({ selectedCell: updatedRun });
              }
              return updatedRuns;
            }
            return page;
          });

          // If the run doesn't exist, add it to the first page
          if (!exist) {
            const newRun = { ...data, number: newRunNumber };

            updatedPages[0] = [newRun, ...updatedPages[0]];
          }

          const _data = {
            ...oldData,
            pages: updatedPages,
          };

          return _data;
        },
      );
    },
  });

  // const { refetch } = useRuns({
  //   workflow_id,
  // });

  // React.useEffect(() => {
  //   if (progressUpdates.length === 0) return;

  //   // get the last run
  //   const lastRun = progressUpdates[progressUpdates.length - 1];
  //   console.log("lastRun", lastRun);
  //   // refetch();
  // }, [progressUpdates]);

  return { connectionStatus };
}

// Create a context for the realtime workflow
const RealtimeWorkflowContext = React.createContext<{
  socket: any | null;
  workflowId: string | null;
  connectionStatus: string;
}>({
  socket: null,
  workflowId: null,
  connectionStatus: "connecting",
});

// Create a provider component
export function RealtimeWorkflowProvider({
  children,
  workflowId,
}: { children: React.ReactNode; workflowId: string }) {
  const { connectionStatus } = useRealtimeWorkflowUpdate2(workflowId);
  // const socket = useRealtimeWorkflowUpdate(workflowId);
  // useRealtimeWorkflowUpdate2(workflowId);

  // useEffect(() => {
  //   console.log("progressUpdates", progressUpdates);
  // }, [progressUpdates]);

  // useEffect(() => {
  //   console.log("connectionStatus", connectionStatus);
  // }, [connectionStatus]);

  return (
    <RealtimeWorkflowContext.Provider
      value={{ socket: undefined, workflowId, connectionStatus }}
    >
      {children}
    </RealtimeWorkflowContext.Provider>
  );
}

// Create a custom hook to use the context
export function useRealtimeWorkflow() {
  const context = React.use(RealtimeWorkflowContext);
  if (context === undefined) {
    throw new Error(
      "useRealtimeWorkflow must be used within a RealtimeWorkflowProvider",
    );
  }
  return context;
}
