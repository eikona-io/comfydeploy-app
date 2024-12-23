import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { getRelativeTime } from "@/lib/get-relative-time";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { CommandLoading } from "cmdk";
import {
  ArrowRight,
  Box,
  CircleGauge,
  CreditCard,
  Database,
  Key,
  Plus,
  Server,
  Settings,
  Workflow,
} from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingIcon } from "./ui/custom/loading-icon";

// ------------------Props-------------------

interface ComfyCommandProps {
  navigate: (args: any) => void;
  setOpen: (open: boolean) => void;
  search?: string;
}

interface workflowSchema {
  id: string;
  name: string;
  created_at: string;
}

interface machineSchema {
  id: string;
  name: string;
  updated_at: string;
}

// ------------------Component-------------------

export function ComfyCommand() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
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
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={(value) => setSearch(value)}
      />
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
          {/* <CommandItem
            onSelect={() => {
              navigate({
                to: "/settings",
              });
              setOpen(false);
            }}
          >
            <Settings className="!h-4 !w-4 mr-2" />
            <span>Settings</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              navigate({
                to: "/api-keys",
              });
              setOpen(false);
            }}
          >
            <Key className="!h-4 !w-4 mr-2" />
            <span>API Keys</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              navigate({
                to: "/usage",
              });
              setOpen(false);
            }}
          >
            <CircleGauge className="!h-4 !w-4 mr-2" />
            <span>Usage</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              navigate({
                to: "/pricing",
              });
              setOpen(false);
            }}
          >
            <CreditCard className="!h-4 !w-4 mr-2" />
            <span>Plan</span>
          </CommandItem> */}
        </CommandGroup>

        {!isDetailPage() && (
          <WorkflowPartCommand
            navigate={navigate}
            setOpen={setOpen}
            search={search}
          />
        )}

        {!isDetailPage() && (
          <MachinePartCommand navigate={navigate} setOpen={setOpen} />
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

function WorkflowPartCommand({ navigate, setOpen, search }: ComfyCommandProps) {
  const { data: workflows, isLoading } = useQuery<workflowSchema[]>({
    queryKey: ["workflows", "all"],
    staleTime: 5 * 60 * 1000, // 5 minutes in milliseconds
    gcTime: 5 * 60 * 1000, // 5 minutes in milliseconds
    refetchOnWindowFocus: false,
  });

  return (
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
      {isLoading && (
        <CommandLoading>
          <div className="flex h-10 items-center justify-center text-muted-foreground">
            <LoadingIcon />
          </div>
        </CommandLoading>
      )}
      {workflows?.slice(0, 5).map((workflow) => {
        return (
          <CommandItem
            key={workflow.id}
            onSelect={() => {
              navigate({
                to: `/workflows/${workflow.id}/workspace`,
              });
              setOpen(false);
            }}
          >
            <Box className="!h-4 !w-4 mr-2" />
            <div className="flex flex-col leading-snug">
              <span>{workflow.name}</span>
              <span className="font-mono text-[9px]">{workflow.id}</span>
            </div>
            <CommandShortcut className="text-2xs tracking-normal">
              {getRelativeTime(workflow.created_at)}
            </CommandShortcut>
          </CommandItem>
        );
      })}
    </CommandGroup>
  );
}

function MachinePartCommand({ navigate, setOpen }: ComfyCommandProps) {
  const { data: machines, isLoading } = useQuery<machineSchema[]>({
    queryKey: ["machines", "all"],
    staleTime: 5 * 60 * 1000, // 5 minutes in milliseconds
    gcTime: 5 * 60 * 1000, // 5 minutes in milliseconds
    refetchOnWindowFocus: false,
  });

  return (
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
      {isLoading && (
        <CommandLoading>
          <div className="flex h-10 items-center justify-center text-muted-foreground">
            <LoadingIcon />
          </div>
        </CommandLoading>
      )}
      {machines?.slice(0, 5).map((machine) => {
        return (
          <CommandItem
            key={machine.id}
            onSelect={() => {
              navigate({
                to: `/machines/${machine.id}`,
                search: { view: "overview" },
              });
              setOpen(false);
            }}
          >
            <Server className="!h-4 !w-4 mr-2" />
            <div className="flex flex-col leading-snug">
              <span>{machine.name}</span>
              <span className="font-mono text-[9px]">{machine.id}</span>
            </div>
            <CommandShortcut className="text-2xs tracking-normal">
              {getRelativeTime(machine.updated_at)}
            </CommandShortcut>
          </CommandItem>
        );
      })}
    </CommandGroup>
  );
}
