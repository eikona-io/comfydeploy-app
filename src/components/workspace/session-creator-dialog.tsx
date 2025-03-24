import { ScrollArea } from "@/components/ui/scroll-area";
import { SessionCreatorForm } from "./session-creator-form";

interface SessionCreationDialogProps {
  workflowId: string;
  version: number;
  machineId?: string;
  machineName?: string;
  machineGpu?: string;
  machineVersionId?: string;
  modalImageId?: string;
  machineVersions?: Array<{
    id: string;
    version: string;
    modal_image_id?: string;
  }>;
  onClose: () => void;
}

export function SessionCreationDialog({
  workflowId,
  version,
  machineId,
  machineVersionId,
  onClose,
}: SessionCreationDialogProps) {
  return (
    <ScrollArea className="h-full px-1">
      <div className="flex h-full flex-col">
        <div className="mb-4 flex-none">
          <SessionCreatorForm
            workflowId={workflowId}
            version={version}
            defaultMachineId={machineId}
            defaultMachineVersionId={machineVersionId}
            showCancelButton
            onCancel={onClose}
          />
        </div>
      </div>
    </ScrollArea>
  );
}
