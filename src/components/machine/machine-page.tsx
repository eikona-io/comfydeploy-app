import {
  BuildStepsUI,
  MachineBuildLog,
} from "@/components/machine/machine-build-log";
import { MachineDeployment } from "@/components/machine/machine-deployment";
import { MachineOverview } from "@/components/machine/machine-overview";
import { MachineSettings } from "@/components/machine/machine-settings";
import { Portal } from "@/components/ui/custom/portal";
import {
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";

type View = "settings" | "deployments" | "overview" | "logs";

export default function MachinePage({
  params,
}: {
  params: { machine_id: string };
}) {
  const navigate = useNavigate();
  const machineEndpoint = `${process.env.NEXT_PUBLIC_CD_API_URL}/api/machine`;
  const { view } = useSearch({ from: "/machines/$machineId" });

  const { data: machine, isLoading } = useQuery<any>({
    queryKey: ["machine", params.machine_id],
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (machine?.status === "building") {
      navigate({
        to: "/machines/$machineId",
        params: { machineId: params.machine_id },
        search: { view: "logs" },
      });
    }
  }, [machine?.status, navigate, params.machine_id]);

  const setView = (newView: View) => {
    navigate({
      to: "/machines/$machineId",
      params: { machineId: params.machine_id },
      search: { view: newView },
    });
  };

  const isDockerCommandStepsNull =
    machine?.docker_command_steps === null &&
    machine?.type === "comfy-deploy-serverless";

  const routes = ["Overview", "Settings", "Deployments", "Logs"]
    .filter((name) => !isDockerCommandStepsNull || name !== "Settings")
    .map((name) => ({
      name,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        setView(name.toLowerCase() as View);
      },
    }));

  const { openMobile: isSidebarOpen } = useSidebar();

  if (isLoading || !machine) {
    return (
      <div className="mx-auto w-full max-w-[1500px] md:p-4">
        <Skeleton className="m-4 h-10 w-48 rounded-[8px]" />
        <div className="flex flex-row gap-3 p-4 pb-2">
          <Skeleton className="h-10 w-24 rounded-[8px]" />
          <Skeleton className="h-10 w-24 rounded-[8px]" />
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-[8px]" />
            <Skeleton className="h-[300px] w-full rounded-[8px]" />
            <Skeleton className="h-[300px] w-full rounded-[8px]" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-[408px] w-full rounded-[8px]" />
            <Skeleton className="h-[408px] w-full rounded-[8px]" />
          </div>
        </div>

        <div className="p-4 pt-0">
          <Skeleton className="h-[500px] w-full rounded-[8px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Portal targetId="sidebar-panel-machines" trigger={isSidebarOpen}>
        <SidebarMenuSub>
          {routes.map((route) => (
            <SidebarMenuSubItem key={route.name}>
              <SidebarMenuSubButton
                onClick={route.onClick}
                className={
                  view === route.name.toLowerCase() ? "" : "opacity-50"
                }
              >
                <span>{route.name}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </Portal>

      <div className="mx-auto w-full max-w-[1500px] md:p-4">
        <h1 className="p-4 font-medium text-2xl">{machine.name}</h1>

        {(() => {
          switch (view) {
            case "settings":
              return <MachineSettings machine={machine} setView={setView} />;
            case "overview":
              return <MachineOverview machine={machine} setView={setView} />;
            case "logs":
              if (machine?.status === "building") {
                return (
                  <MachineBuildLog
                    machine={machine}
                    instance_id={machine.build_machine_instance_id!}
                    machine_id={params.machine_id}
                    endpoint={machineEndpoint}
                  />
                );
              }

              if (!machine?.build_log) return <div>No logs</div>;

              return (
                <BuildStepsUI
                  machine={machine}
                  logs={JSON.parse(machine.build_log)}
                />
              );
            case "deployments":
              return <MachineDeployment machine={machine} setView={setView} />;
          }
        })()}
      </div>
    </div>
  );
}
