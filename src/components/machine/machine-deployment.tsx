import { CustomNodeList } from "@/components/machines/custom-node-list";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingIcon } from "@/components/ui/custom/loading-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { VirtualizedInfiniteList } from "@/components/virtualized-infinite-list";
import { useMachineVersion, useMachineVersions } from "@/hooks/use-machine";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { differenceInSeconds } from "date-fns";
import {
  ChevronDown,
  ChevronRight,
  CircleArrowUp,
  CircleX,
  Ellipsis,
  ExternalLink,
  HardDrive,
  Library,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function formatExactTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}

export function formatShortDistanceToNow(date: Date): string {
  const seconds = differenceInSeconds(new Date(), date);
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface UserInfo {
  user_id: string;
  image_url?: string | null;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
}

// Create a hook for fetching user
function useUserInfo(userId: string) {
  return useQuery<UserInfo>({
    queryKey: ["user", userId],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

// Then in your UserInfo component
const UserInfoForDeployment = ({ machineVersion }: { machineVersion: any }) => {
  const { data: user, isLoading } = useUserInfo(machineVersion.user_id);

  if (isLoading || !user) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500">
        {formatShortDistanceToNow(new Date(machineVersion.created_at))} by{" "}
        {user.username ?? `${user.first_name} ${user.last_name}`}
      </span>
      <img
        src={user.image_url ?? ""}
        alt={`${user.first_name}'s avatar`}
        className="h-[22px] w-[22px] rounded-full"
      />
    </div>
  );
};

const MachineStatusBadge = ({ status }: { status: string }) => {
  return (
    <>
      <div className="flex items-center justify-center shrink-0">
        <div
          className={`h-[9px] w-[9px] rounded-full animate-pulse ${
            status === "ready"
              ? "bg-green-500"
              : status === "error"
                ? "bg-red-500"
                : status === "building"
                  ? "bg-yellow-500"
                  : "bg-gray-500"
          }`}
        />
      </div>
      <span className="text-sm text-gray-600 truncate">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </>
  );
};

export function MachineDeployment(props: { machine: any }) {
  const { machine } = props;
  const query = useMachineVersions(machine.id);

  if (query.isLoading) {
    return (
      <div className="mx-auto h-[calc(100vh-60px)] max-h-full w-full max-w-[1500px] px-2 py-4 md:px-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="border bg-white p-4 shadow-sm rounded-[8px] mb-4"
          >
            <div className="grid grid-cols-[minmax(120px,1fr)_minmax(150px,1fr)_minmax(180px,2fr)_auto] gap-x-4 items-center">
              {/* ID and Version */}
              <div className="grid grid-cols-1 gap-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-12" />
              </div>

              {/* Status and Time */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>

              {/* GPU and Nodes */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-40" />
              </div>

              {/* User Info */}
              <div className="justify-self-end flex items-center gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-[22px] w-[22px] rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto h-[calc(100vh-60px)] max-h-full w-full max-w-[1500px] px-2 py-4 md:px-4">
      <VirtualizedInfiniteList
        className="!h-full fab-machine-list w-full"
        queryResult={query}
        renderItem={(machineVersion) => (
          <MachineVersionList
            machineVersion={machineVersion}
            machine={machine}
          />
        )}
        estimateSize={90}
      />
    </div>
  );
}

function MachineVersionList({
  machineVersion,
  machine,
}: {
  machineVersion: any;
  machine: any;
}) {
  const navigate = useNavigate({
    from: "/machines/$machineId",
  });

  return (
    <div
      key={machineVersion.id}
      className="border bg-white p-4 shadow-sm rounded-[8px]"
    >
      <div className="grid grid-cols-[minmax(120px,1fr)_minmax(150px,1fr)_minmax(180px,2fr)_auto] gap-x-4 items-center">
        {/* ID and Version */}
        <div
          className="grid grid-cols-1 gap-y-1 min-w-0 cursor-pointer"
          onClick={() =>
            navigate({
              to: "/machines/$machineId/$machineVersionId",
              params: {
                machineVersionId: machineVersion.id,
              },
            })
          }
        >
          <div className="font-medium font-mono text-2xs truncate">
            {machineVersion.id.slice(0, 8)}
          </div>
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-gray-100 leading-snug px-2 py-0 rounded-md text-gray-500 text-xs w-fit">
              v{machineVersion.version}
            </div>
            {machineVersion.id === machine.machine_version_id && (
              <Badge
                variant="green"
                className="flex items-center gap-x-1 !text-2xs"
              >
                <CircleArrowUp className="h-3 w-3" />
                <span>Current</span>
              </Badge>
            )}
          </div>
        </div>

        {/* Status and Time */}
        <div className="grid grid-cols-[auto,1fr] gap-x-1.5 items-center min-w-0">
          <MachineStatusBadge status={machineVersion.status} />
          {machineVersion.status === "building" ? (
            <LoadingIcon className="h-[14px] w-[14px] text-gray-600 shrink-0" />
          ) : (
            <div className="w-[14px] shrink-0" />
          )}
          <span className="text-sm text-gray-500 truncate">
            {machineVersion.status === "building"
              ? formatExactTime(
                  differenceInSeconds(
                    new Date(),
                    new Date(machineVersion.created_at),
                  ),
                )
              : machineVersion.created_at === machineVersion.updated_at
                ? "-"
                : `${formatExactTime(
                    differenceInSeconds(
                      new Date(machineVersion.updated_at),
                      new Date(machineVersion.created_at),
                    ),
                  )} (${formatShortDistanceToNow(
                    new Date(machineVersion.updated_at),
                  )})`}
          </span>
        </div>

        {/* GPU and Nodes */}
        <div className="grid grid-cols-[auto,1fr] items-center gap-x-2 min-w-0">
          <HardDrive className="h-[14px] w-[14px] shrink-0" />
          <div className="grid grid-cols-10 items-center">
            <span className="text-sm text-gray-600 truncate">
              {machineVersion.gpu}
            </span>

            <Badge
              variant="indigo"
              className="font-mono !text-[10px] w-fit whitespace-nowrap cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
              onClick={() => {
                window.open(
                  `https://github.com/comfyanonymous/ComfyUI/commit/${machineVersion.comfyui_version}`,
                  "_blank",
                );
              }}
            >
              ComfyUI - {machineVersion.comfyui_version.slice(0, 10)}
              <ExternalLink className="h-3 w-3" />
            </Badge>
          </div>
          <Library className="h-[14px] w-[14px] shrink-0" />
          <CustomNodeList machine={machineVersion} numOfNodes={2} />
        </div>

        {/* User Info and Actions */}
        <div className="justify-self-end flex flex-row gap-x-2 shrink-0">
          <UserInfoForDeployment machineVersion={machineVersion} />
          <InstantRollback machineVersion={machineVersion} machine={machine} />
        </div>
      </div>
    </div>
  );
}

function InstantRollback({
  machineVersion,
  machine,
}: {
  machineVersion: any;
  machine: any;
}) {
  const [rollbackAlertOpen, setRollbackAlertOpen] = useState(false);
  const { data: currentMachineVersion } = useMachineVersion(
    machine.id,
    machine.machine_version_id,
  );
  const navigate = useNavigate({
    from: "/machines/$machineId",
  });

  const handleRollback = async () => {
    try {
      await api({
        url: `machine/serverless/${machine.id}/rollback`,
        init: {
          method: "POST",
          body: JSON.stringify({
            machine_version_id: machineVersion.id,
          }),
        },
      });
      toast.success(`Rollback to v${machineVersion.version}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to rollback. ");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon">
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[180px]" align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={
              machineVersion.id === machine.machine_version_id ||
              machineVersion.status !== "ready"
            }
            className="text-red-500"
            onClick={() => setRollbackAlertOpen(true)}
          >
            Instant Rollback
            <DropdownMenuShortcut>
              <RotateCcw className="w-4 h-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              navigate({
                to: "/machines/$machineId/$machineVersionId",
                params: {
                  machineVersionId: machineVersion.id,
                },
              });
            }}
          >
            <span>Details</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={rollbackAlertOpen} onOpenChange={setRollbackAlertOpen}>
        <AlertDialogContent className="w-[900px] max-w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>Instant Rollback</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="mb-4">
                You are about to rollback from
                <span className="bg-gray-100 leading-snug px-2 py-1 rounded-md text-gray-500 text-xs w-fit mx-1">
                  v{currentMachineVersion?.version}
                </span>
                to
                <span className="bg-gray-100 leading-snug px-2 py-1 rounded-md text-gray-500 text-xs w-fit mx-1">
                  v{machineVersion.version}
                </span>
                .
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4">
                {/* Current Version Card */}
                <div className="flex-1 flex justify-between bg-gray-100 rounded-[6px] p-2 border border-gray-200 w-full md:w-auto">
                  <div className="flex flex-row gap-x-4 items-center">
                    <div>
                      <CircleX className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-xs text-gray-600 font-medium font-mono flex flex-row gap-x-2 items-center">
                        {currentMachineVersion?.id.slice(0, 8)}
                        <span className="bg-gray-200 leading-snug px-2 py-1 rounded-md text-gray-500 text-xs w-fit">
                          v{currentMachineVersion?.version}
                        </span>
                      </div>
                      <div className="flex flex-row gap-x-2 items-center">
                        <MachineStatusBadge
                          status={currentMachineVersion?.status}
                        />
                      </div>
                      <UserInfoForDeployment
                        machineVersion={currentMachineVersion}
                      />
                    </div>
                  </div>
                  <div>
                    <Badge
                      variant="green"
                      className="!px-3 !py-1 rounded-[6px]"
                    >
                      Current
                    </Badge>
                  </div>
                </div>

                <div className="hidden md:block">
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </div>

                <div className="block md:hidden">
                  <ChevronDown className="h-4 w-4 shrink-0" />
                </div>

                {/* Previous Version Card */}
                <div className="flex-1 flex justify-between bg-white rounded-[6px] p-2 border border-gray-200 shadow-lg w-full md:w-auto">
                  <div className="flex flex-row gap-x-4 items-center">
                    <div>
                      <RotateCcw className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-xs text-gray-600 font-medium font-mono flex flex-row gap-x-2 items-center">
                        {machineVersion.id.slice(0, 8)}
                        <span className="bg-gray-200 leading-snug px-2 py-1 rounded-md text-gray-500 text-xs w-fit">
                          v{machineVersion.version}
                        </span>
                      </div>
                      <div className="flex flex-row gap-x-2 items-center">
                        <MachineStatusBadge status={machineVersion.status} />
                      </div>
                      <UserInfoForDeployment machineVersion={machineVersion} />
                    </div>
                  </div>
                  <div>
                    <Badge
                      variant="yellow"
                      className="!px-3 !py-1 rounded-[6px]"
                    >
                      Previous
                    </Badge>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRollback}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
