import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelectedVersion } from "@/components/version-select";
import { DiffView } from "@/components/workspace/DiffView";
import { useWorkflowStore } from "@/components/workspace/Workspace";

type WorkflowDiffProps = {
  workflowId: string;
  onClose: () => void;
  onSave: () => void;
};
export function WorkflowDiff({
  workflowId,
  onClose,
  onSave,
}: WorkflowDiffProps) {
  const differences = useWorkflowStore((state) => state.differences);
  const workflow = useWorkflowStore((state) => state.workflow);
  const { value: selectedVersion } = useSelectedVersion(workflowId);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] grid grid-rows-[auto,1fr]">
        <DialogHeader className="pb-2">
          <DialogTitle>Workflow Changes</DialogTitle>
          <DialogDescription className="text-sm">
            Review changes before saving
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="w-full">
          <DiffView
            differences={differences}
            workflow={workflow}
            oldWorkflow={selectedVersion?.workflow}
          />
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button size="sm" onClick={onSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
