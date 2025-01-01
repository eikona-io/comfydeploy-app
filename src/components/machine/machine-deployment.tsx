import { CustomNodeList } from "@/components/machines/custom-node-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingIcon } from "@/components/ui/custom/loading-icon";
import { VirtualizedInfiniteList } from "@/components/virtualized-infinite-list";
import { useMachineVersions } from "@/hooks/use-machine";
import { useQuery } from "@tanstack/react-query";
import { differenceInSeconds } from "date-fns";
import {
  CircleArrowUp,
  Ellipsis,
  ExternalLink,
  HardDrive,
  Library,
} from "lucide-react";

type View = "settings" | "deployments" | "overview" | "logs";

function formatExactTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0
    ? `${minutes}m ${remainingSeconds}s`
    : `${minutes}m`;
}

function formatShortDistanceToNow(date: Date): string {
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

export function MachineDeployment(props: {
  machine: any;
  setView: (view: View) => void;
}) {
  const { machine, setView } = props;
  const query = useMachineVersions(machine.id);

  console.log(query.data?.pages.flat());

  return (
    <div className="mx-auto h-[calc(100vh-60px)] max-h-full w-full max-w-[1500px] px-2 py-4 md:px-4">
      <VirtualizedInfiniteList
        className="!h-full fab-machine-list w-full"
        queryResult={query}
        renderItem={(machineVersion) => (
          <div
            key={machineVersion.id}
            className="border bg-white p-4 shadow-sm rounded-[8px]"
          >
            <div className="grid grid-cols-[minmax(120px,1fr)_minmax(150px,1fr)_minmax(180px,2fr)_auto] gap-x-4 items-center">
              {/* ID and Version */}
              <div className="grid grid-cols-1 gap-y-1 min-w-0">
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
                <div className="flex items-center justify-center shrink-0">
                  <div
                    className={`h-[9px] w-[9px] rounded-full animate-pulse ${
                      machineVersion.status === "ready"
                        ? "bg-green-500"
                        : machineVersion.status === "error"
                          ? "bg-red-500"
                          : machineVersion.status === "building"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                    }`}
                  />
                </div>
                <span className="text-sm text-gray-600 truncate">
                  {machineVersion.status.charAt(0).toUpperCase() +
                    machineVersion.status.slice(1)}
                </span>
                {machineVersion.status === "building" ? (
                  <LoadingIcon className="h-[14px] w-[14px] text-gray-600 shrink-0" />
                ) : (
                  <div className="w-[14px] shrink-0" />
                )}
                <span className="text-sm text-gray-500 truncate">
                  {machineVersion.created_at === machineVersion.updated_at
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
                <CustomNodeList machine={machineVersion} />
              </div>

              {/* User Info and Actions */}
              <div className="justify-self-end flex flex-row gap-x-2 shrink-0">
                <UserInfoForDeployment machineVersion={machineVersion} />
                <Button variant="ghost" size="icon">
                  <Ellipsis className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
        estimateSize={90}
      />
    </div>
  );
}
