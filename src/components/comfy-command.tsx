import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowRight, Database, Plus, Server, Workflow } from "lucide-react";
import { useEffect, useState } from "react";

// ------------------Props-------------------

interface ComfyCommandProps {
  navigate: (args: any) => void;
  setOpen: (open: boolean) => void;
}

// ------------------Component-------------------

export function ComfyCommand() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Helper function to check if we're in a detail page
  const isDetailPage = () => {
    const path = router.state.location.pathname;
    return (
      path.match(/^\/workflows\/[^/]+/) || path.match(/^\/machines\/[^/]+/)
    );
  };

  // Helper function to check if we're in a workflow detail page
  const isWorkflowDetailPage = () => {
    const path = router.state.location.pathname;
    return path.match(/^\/workflows\/[^/]+/);
  };

  // Helper function to check if we're in a machine detail page
  const isMachineDetailPage = () => {
    const path = router.state.location.pathname;
    return path.match(/^\/machines\/[^/]+/);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {isWorkflowDetailPage() && (
          <WorkflowActionCommand navigate={navigate} setOpen={setOpen} />
        )}

        {isMachineDetailPage() && (
          <MachineActionCommand navigate={navigate} setOpen={setOpen} />
        )}

        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => {
              navigate({ to: "/workflows" });
              setOpen(false);
            }}
          >
            <Workflow className="!h-4 !w-4 mr-2" />
            <span>Workflows</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              navigate({
                to: "/machines",
                search: { view: undefined },
              });
              setOpen(false);
            }}
          >
            <Server className="!h-4 !w-4 mr-2" />
            <span>Machines</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              navigate({
                to: "/storage",
              });
              setOpen(false);
            }}
          >
            <Database className="!h-4 !w-4 mr-2" />
            <span>Storage</span>
          </CommandItem>
        </CommandGroup>

        {!isDetailPage() && (
          <CreatePartCommand navigate={navigate} setOpen={setOpen} />
        )}
      </CommandList>
    </CommandDialog>
  );
}

// ------------------functions-------------------

// -------------------Commands-------------------

function WorkflowActionCommand({ navigate, setOpen }: ComfyCommandProps) {
  // Get the current workflow ID from the URL
  const router = useRouter();
  const workflowId = router.state.location.pathname.split("/")[2];

  return (
    <>
      <CommandGroup heading="Actions">
        <CommandItem
          onSelect={() => {
            navigate({ to: `/workflows/${workflowId}/workspace` });
            setOpen(false);
          }}
        >
          <ArrowRight className="!h-4 !w-4 mr-2" />
          <span>To Workspace...</span>
        </CommandItem>
        <CommandItem
          onSelect={() => {
            navigate({ to: `/workflows/${workflowId}/requests` });
            setOpen(false);
          }}
        >
          <ArrowRight className="!h-4 !w-4 mr-2" />
          <span>To Requests...</span>
        </CommandItem>
        <CommandItem
          onSelect={() => {
            navigate({ to: `/workflows/${workflowId}/containers` });
            setOpen(false);
          }}
        >
          <ArrowRight className="!h-4 !w-4 mr-2" />
          <span>To Containers...</span>
        </CommandItem>
        <CommandItem
          onSelect={() => {
            navigate({ to: `/workflows/${workflowId}/deployment` });
            setOpen(false);
          }}
        >
          <ArrowRight className="!h-4 !w-4 mr-2" />
          <span>To Deployment...</span>
        </CommandItem>
        <CommandItem
          onSelect={() => {
            navigate({ to: `/workflows/${workflowId}/playground` });
            setOpen(false);
          }}
        >
          <ArrowRight className="!h-4 !w-4 mr-2" />
          <span>To Playground...</span>
        </CommandItem>
        <CommandItem
          onSelect={() => {
            navigate({ to: `/workflows/${workflowId}/gallery` });
            setOpen(false);
          }}
        >
          <ArrowRight className="!h-4 !w-4 mr-2" />
          <span>To Gallery...</span>
        </CommandItem>
      </CommandGroup>
    </>
  );
}

function MachineActionCommand({ navigate, setOpen }: ComfyCommandProps) {
  // Get the current machine ID from the URL
  const router = useRouter();
  const machineId = router.state.location.pathname.split("/")[2];

  return (
    <>
      <CommandGroup heading="Actions">
        <CommandItem
          onSelect={() => {
            navigate({
              to: `/machines/${machineId}`,
              search: { view: "overview" },
            });
            setOpen(false);
          }}
        >
          <ArrowRight className="!h-4 !w-4 mr-2" />
          <span>To Overview...</span>
        </CommandItem>
        <CommandItem
          onSelect={() => {
            navigate({
              to: `/machines/${machineId}`,
              search: { view: "settings" },
            });
            setOpen(false);
          }}
        >
          <ArrowRight className="!h-4 !w-4 mr-2" />
          <span>To Settings...</span>
        </CommandItem>
        <CommandItem
          onSelect={() => {
            navigate({
              to: `/machines/${machineId}`,
              search: { view: "logs" },
            });
            setOpen(false);
          }}
        >
          <ArrowRight className="!h-4 !w-4 mr-2" />
          <span>To Logs...</span>
        </CommandItem>
      </CommandGroup>
    </>
  );
}

function CreatePartCommand({ navigate, setOpen }: ComfyCommandProps) {
  return (
    <>
      <CommandGroup heading="Workflows">
        <CommandItem
          onSelect={() => {
            navigate({
              to: "/workflows",
              search: { view: "import" },
            });
            setOpen(false);
          }}
        >
          <Plus className="!h-4 !w-4 mr-2" />
          <span>Create New Workflow...</span>
        </CommandItem>
      </CommandGroup>

      <CommandGroup heading="Machines">
        <CommandItem
          onSelect={() => {
            navigate({
              to: "/machines",
              search: { view: "create" },
            });
            setOpen(false);
          }}
        >
          <Plus className="!h-4 !w-4 mr-2" />
          <span>Create Serverless Machine...</span>
        </CommandItem>
      </CommandGroup>
    </>
  );
}
