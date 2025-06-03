import { Badge } from "@/components/ui/badge";
import { diff } from "json-diff-ts";
import { ArrowRight, Settings } from "lucide-react";

export interface NodeChange {
  name: string;
  hash: string;
  position: number;
  type: "custom-node";
  data: {
    name: string;
    hash: string;
    [key: string]: any; // for other potential data properties
  };
  prevPosition?: number;
  prevHash?: string;
  positionChanged?: boolean;
  hashChanged?: boolean;
}

export interface CommandChange {
  type: "commands";
  command: string;
  position: number;
  prevPosition?: number;
  data: string;
}

export interface StepsChanges {
  type: "steps-changes";
  nodes: {
    removed: NodeChange[];
    added: NodeChange[];
    movedOrUpdated: NodeChange[];
  };
  commands: {
    removed: CommandChange[];
    added: CommandChange[];
    moved: CommandChange[];
  };
}

export interface FieldChange {
  type: "field";
  field: string;
  oldValue: any;
  newValue: any;
}

export type Change = StepsChanges | FieldChange;

export interface DiffViewerProps {
  currentMachineVersion: any; // We can make this more specific later
  machineVersion: any;
}

interface NodeChangesProps {
  nodes: {
    removed: NodeChange[];
    added: NodeChange[];
    movedOrUpdated: NodeChange[];
  };
}

export function RemovedNodes({ nodes }: { nodes?: NodeChange[] }) {
  if (!nodes?.length) return null;

  return (
    <div className="flex items-center gap-2">
      <Badge variant="destructive" className="h-5 px-1.5">
        Removed
      </Badge>
      <div className="flex flex-wrap gap-1">
        {nodes.map((node, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 font-medium text-red-700 text-xs dark:bg-red-800/50 dark:text-red-400"
          >
            {node.name}
            <span className="ml-1 font-mono text-red-500 opacity-75 dark:text-red-400">
              ({node.hash.slice(0, 7)})
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function AddedNodes({ nodes }: { nodes?: NodeChange[] }) {
  if (!nodes?.length) return null;

  return (
    <div className="flex items-center gap-2">
      <Badge variant="success" className="h-5 px-1.5">
        Added
      </Badge>
      <div className="flex flex-wrap gap-1">
        {nodes.map((node, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 font-medium text-green-700 text-xs dark:bg-green-800/50 dark:text-green-400"
          >
            {node.name}
            <span className="ml-1 font-mono text-green-500 opacity-75 dark:text-green-400">
              ({node.hash.slice(0, 7)})
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function MovedOrUpdatedNodes({ nodes }: { nodes?: NodeChange[] }) {
  if (!nodes?.length) return null;

  return (
    <div className="flex items-center gap-2">
      <Badge variant="blue" className="h-5 px-1.5">
        Changed
      </Badge>
      <div className="flex flex-wrap gap-1">
        {nodes.map((node, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-700 text-xs dark:bg-blue-800/50 dark:text-blue-400"
          >
            {node.name}
            {node.positionChanged && (
              <span className="ml-1 font-mono text-blue-500 opacity-75 dark:text-blue-400">
                (pos: {node.prevPosition! + 1} → {node.position + 1})
              </span>
            )}
            {node.hashChanged && (
              <span className="ml-1 font-mono text-yellow-600 opacity-75 dark:text-yellow-400">
                ({node.prevHash?.slice(0, 7)} → {node.hash.slice(0, 7)})
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export function CustomNodeChanges({ nodes }: NodeChangesProps) {
  return (
    <>
      <RemovedNodes nodes={nodes.removed} />
      <AddedNodes nodes={nodes.added} />
      <MovedOrUpdatedNodes nodes={nodes.movedOrUpdated} />
    </>
  );
}

interface CommandChangesProps {
  commands: {
    removed: CommandChange[];
    added: CommandChange[];
    moved: CommandChange[];
  };
}

export function RemovedCommands({ commands }: { commands?: CommandChange[] }) {
  if (!commands?.length) return null;

  return (
    <div className="flex items-center gap-2">
      <Badge variant="destructive" className="h-5 px-1.5">
        Removed Commands
      </Badge>
      <div className="flex flex-wrap gap-1">
        {commands.map((cmd, i) => (
          <span
            key={i}
            className="inline-flex max-w-md items-center truncate rounded-md bg-red-50 px-2 py-1 font-medium font-mono text-red-700 text-xs dark:bg-red-700/50 dark:text-red-400"
            title={cmd.data}
          >
            {cmd.data}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AddedCommands({ commands }: { commands?: CommandChange[] }) {
  if (!commands?.length) return null;

  return (
    <div className="flex items-center gap-2">
      <Badge variant="success" className="h-5 px-1.5">
        Added Commands
      </Badge>
      <div className="flex flex-wrap gap-1">
        {commands.map((cmd, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 font-medium font-mono text-green-700 text-xs dark:bg-green-700/50 dark:text-green-400"
          >
            {cmd.data}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MovedCommands({ commands }: { commands?: CommandChange[] }) {
  if (!commands?.length) return null;

  return (
    <div className="flex items-center gap-2">
      <Badge variant="blue" className="h-5 px-1.5">
        Moved Commands
      </Badge>
      <div className="flex flex-wrap gap-1">
        {commands.map((cmd, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 font-medium font-mono text-blue-700 text-xs dark:bg-blue-700/50 dark:text-blue-400"
          >
            {cmd.data}
            <span className="ml-1 text-blue-500 opacity-75">
              (pos: {cmd.prevPosition! + 1} → {cmd.position + 1})
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function CommandChanges({ commands }: CommandChangesProps) {
  return (
    <>
      <RemovedCommands commands={commands.removed} />
      <AddedCommands commands={commands.added} />
      <MovedCommands commands={commands.moved} />
    </>
  );
}

// Helper function to format values nicely
export function formatValue(value: any): string {
  if (typeof value === "boolean") {
    return value ? "Enabled" : "Disabled";
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (typeof value === "string") {
    return value;
  }
  return JSON.stringify(value);
}

// Helper function to format field names
export function formatFieldName(field: string | undefined) {
  if (!field) return "Unknown Field";
  return field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function FieldChanges({
  field,
  oldValue,
  newValue,
}: Omit<FieldChange, "type">) {
  const truncateValue = (value: string) => {
    return value.length > 20 ? `${value.slice(0, 20)}...` : value;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 font-medium text-sm">
        <Settings className="h-4 w-4 text-gray-500" />
        {formatFieldName(field)}
      </div>
      <div className="flex items-center gap-2 text-sm">
        <div
          className="rounded-md bg-red-50 px-2 py-1 font-mono text-red-700 text-xs dark:bg-red-700/50 dark:text-red-400"
          title={formatValue(oldValue)}
        >
          {truncateValue(formatValue(oldValue))}
        </div>
        <ArrowRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
        <div
          className="rounded-md bg-green-50 px-2 py-1 font-mono text-green-700 text-xs dark:bg-green-700/50 dark:text-green-400"
          title={formatValue(newValue)}
        >
          {truncateValue(formatValue(newValue))}
        </div>
      </div>
    </div>
  );
}

// Helper function to get step info with position
function getStepsInfo(steps: any[] = []) {
  return steps.map((step, index) => ({
    type: step.type,
    data: step.data,
    position: index,
    ...(step.type === "custom-node" && {
      name: step.data.name,
      hash: step.data.hash,
    }),
    ...(step.type === "commands" && {
      command: step.data,
    }),
  }));
}

export function processChanges(
  currentMachineVersion: any,
  machineVersion: any,
): Change[] {
  const MachineDiff = diff(currentMachineVersion, machineVersion, {
    keysToSkip: [
      "version",
      "created_at",
      "updated_at",
      "status",
      "build_log",
      "id",
      "user_id",
    ],
  });

  return MachineDiff.reduce((acc: Change[], change: any) => {
    if (change.key === "docker_command_steps") {
      if (!acc.some((item) => item.type === "steps-changes")) {
        const currentSteps = getStepsInfo(
          machineVersion.docker_command_steps?.steps,
        );
        const previousSteps = getStepsInfo(
          currentMachineVersion.docker_command_steps?.steps,
        );

        // Process nodes changes
        const { nodes } = processNodeChanges(currentSteps, previousSteps);

        // Process command changes
        const { commands } = processCommandChanges(currentSteps, previousSteps);

        if (
          nodes.removed.length ||
          nodes.added.length ||
          nodes.movedOrUpdated.length ||
          commands.removed.length ||
          commands.added.length ||
          commands.moved.length
        ) {
          acc.push({
            type: "steps-changes",
            nodes,
            commands,
          });
        }
      }
    } else {
      // Process field changes
      if (
        !acc.some(
          (item) =>
            item.type === "field" &&
            "field" in item &&
            item.field === change.key,
        )
      ) {
        acc.push({
          type: "field",
          field: change.key,
          oldValue: currentMachineVersion[change.key],
          newValue: machineVersion[change.key],
        });
      }
    }
    return acc;
  }, []);
}

// Helper functions for processing different types of changes
function processNodeChanges(currentSteps: any[], previousSteps: any[]) {
  const currentNodes = currentSteps.filter(
    (step) => step.type === "custom-node",
  );
  const previousNodes = previousSteps.filter(
    (step) => step.type === "custom-node",
  );

  return {
    nodes: {
      removed: previousNodes.filter(
        (node) => !currentNodes.some((curr) => curr.name === node.name),
      ),
      added: currentNodes.filter(
        (node) => !previousNodes.some((prev) => prev.name === node.name),
      ),
      movedOrUpdated: currentNodes
        .filter((curr) => {
          const prevNode = previousNodes.find(
            (prev) => prev.name === curr.name,
          );
          return (
            prevNode &&
            (prevNode.position !== curr.position || prevNode.hash !== curr.hash)
          );
        })
        .map((curr) => {
          const prevNode = previousNodes.find(
            (prev) => prev.name === curr.name,
          );
          return {
            ...curr,
            prevPosition: prevNode?.position,
            prevHash: prevNode?.hash,
            positionChanged: prevNode?.position !== curr.position,
            hashChanged: prevNode?.hash !== curr.hash,
          };
        }),
    },
  };
}

function processCommandChanges(currentSteps: any[], previousSteps: any[]) {
  const currentCommands = currentSteps.filter(
    (step) => step.type === "commands",
  );
  const previousCommands = previousSteps.filter(
    (step) => step.type === "commands",
  );

  return {
    commands: {
      removed: previousCommands.filter(
        (cmd) => !currentCommands.some((curr) => curr.data === cmd.data),
      ),
      added: currentCommands.filter(
        (cmd) => !previousCommands.some((prev) => prev.data === cmd.data),
      ),
      moved: currentCommands.filter((curr) => {
        const prevCmd = previousCommands.find(
          (prev) => prev.data === curr.data,
        );
        return prevCmd && prevCmd.position !== curr.position;
      }),
    },
  };
}
