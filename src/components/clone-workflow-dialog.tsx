import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cloneWorkflow } from "@/components/workflow-api";
import { callServerPromise } from "@/lib/call-server-promise";
import { Copy } from "lucide-react";

interface CloneWorkflowDialogProps {
  workflow: {
    id: string;
    name: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (newWorkflow: any) => void;
}

export function CloneWorkflowDialog({
  workflow,
  open,
  onOpenChange,
  onSuccess,
}: CloneWorkflowDialogProps) {
  const [workflowName, setWorkflowName] = useState(`${workflow.name} (Clone)`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = workflowName.trim();
    if (!trimmedName) {
      return; // Don't submit if name is empty
    }

    setIsSubmitting(true);
    try {
      const newWorkflow = await callServerPromise(
        cloneWorkflow(workflow.id, trimmedName),
        {
          loadingText: "Cloning workflow",
          successMessage: `${workflow.name} cloned successfully`,
        },
      );

      onSuccess?.(newWorkflow);
      onOpenChange(false);
      setWorkflowName(`${workflow.name} (Clone)`); // Reset form
    } catch (error) {
      // Error is handled by callServerPromise
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    // Prevent closing dialog while submitting
    if (isSubmitting && !newOpen) return;

    if (!newOpen) {
      // Reset form when closing
      setWorkflowName(`${workflow.name} (Clone)`);
    }
    onOpenChange(newOpen);
  };

  const isNameEmpty = !workflowName.trim();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Clone Workflow
          </DialogTitle>
          <DialogDescription>
            Create a copy of "{workflow.name}" with a new name.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workflow-name">Workflow Name</Label>
            <Input
              id="workflow-name"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="Enter workflow name"
              disabled={isSubmitting}
              className={
                isNameEmpty ? "border-red-500 focus-visible:ring-red-500" : ""
              }
            />
            {isNameEmpty && (
              <p className="text-sm text-red-500">
                Workflow name cannot be empty
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isNameEmpty || isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Cloning...
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Clone Workflow
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
