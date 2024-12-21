import {
  type WorkflowInputType,
  getInputsFromWorkflow,
} from "@/lib/getInputsFromWorkflow";
import { z } from "zod";

export function workflowVersionInputsToZod(workflow_version: any) {
  const inputs = getInputsFromWorkflow(workflow_version);
  if (!inputs) return null;
  return plainInputsToZod(inputs);
}

export function plainInputsToZod(inputs: z.infer<typeof WorkflowInputType>[]) {
  if (!inputs) return null;

  return z.object({
    ...Object.fromEntries(
      inputs?.map((x) => {
        return [x?.input_id, z.string().optional()];
      }),
    ),
  });
}
