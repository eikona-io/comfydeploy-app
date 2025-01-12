import { useCurrentWorkflow } from "@/hooks/use-current-workflow";
import { useSessionAPI } from "@/hooks/use-session-api";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useUpdateServerActionDialog } from "../auto-form/auto-form-dialog";
import { machineGPUOptions } from "../machine/machine-schema";
import { Button } from "../ui/button";
import { useLogStore } from "./LogContext";

type SessionCreateProps = {
  workflowId: string;
  setSessionId: (sessionId: string) => void;
  btnText?: string;
  btnSize?: "xs" | "sm" | "lg";
  asChild?: boolean;
  children?: React.ReactNode;
};
export function SessionCreate({
  workflowId,
  setSessionId,
  btnText = "Create New Session",
  btnSize = "lg",
  asChild = false,
  children,
}: SessionCreateProps) {
  const { workflow } = useCurrentWorkflow(workflowId);
  const machineId = workflow?.selected_machine_id;
  const { createSession, listSession, deleteSession } =
    useSessionAPI(machineId);
  const { open, ui, setOpen } = useUpdateServerActionDialog({
    title: "Create Session",
    description: "Create a new session",
    formSchema: z.object({
      gpu: z.enum(machineGPUOptions).describe("GPU"),
      timeout: z.number().min(5).describe("Timeout in minutes"),
    }),
    buttonTitle: "Create Session",
    data: {
      gpu: (localStorage.getItem("lastGPUSelection") ||
        "A10G") as (typeof machineGPUOptions)[number],
      timeout: Number.parseInt(
        localStorage.getItem("lastTimeoutSelection") || "15",
      ),
    },
    fieldConfig: {
      gpu: {
        fieldType: "timeoutPicker",
        inputProps: {
          optionsForTier: [
            ["CPU", undefined, "CPU"],
            ["T4", undefined, "T4 (16GB)"],
            ["A10G", undefined, "A10G (24GB)"],
            ["L4", undefined, "L4 (24GB)"],
            ["L40S", "business", "L40S (48GB)"],
            ["A100", "business", "A100 (40GB)"],
            ["A100-80GB", "business", "A100-80GB (80GB)"],
            ["H100", "business", "H100 (80GB)"],
          ],
        },
      },
      timeout: {
        inputProps: {
          value: 15,
          min: 1,
          max: 60,
        },
        fieldType: "slider",
        description: "Set the timeout for the session",
      },
    },
    serverAction: async (data) => {
      try {
        localStorage.setItem("lastGPUSelection", data.gpu);
        localStorage.setItem("lastTimeoutSelection", data.timeout.toString());
        const response = await createSession.mutateAsync(data);
        useLogStore.getState().clearLogs();
        await listSession.refetch();
        setSessionId(response.session_id);
      } catch (e) {
        toast.error(`Failed to create session: ${e}`);
      }
    },
  });
  return (
    <>
      {ui}
      {asChild && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
          className="flex-auto"
          onClick={() =>
            setOpen({
              gpu: (localStorage.getItem("lastGPUSelection") ||
                "A10G") as (typeof machineGPUOptions)[number],
              timeout: Number.parseInt(
                localStorage.getItem("lastTimeoutSelection") || "15",
              ),
            })
          }
        >
          {children}
        </div>
      )}
      {!asChild && (
        <Button
          className="flex-auto gap-1"
          onClick={() =>
            setOpen({
              gpu: (localStorage.getItem("lastGPUSelection") ||
                "A10G") as (typeof machineGPUOptions)[number],
              timeout: Number.parseInt(
                localStorage.getItem("lastTimeoutSelection") || "15",
              ),
            })
          }
          size={btnSize}
        >
          {btnText}
          <Plus size={16} />
        </Button>
      )}
    </>
  );
}
