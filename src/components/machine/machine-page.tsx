import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Portal } from "@/components/ui/custom/portal";

type View = "settings" | "overview" | "logs";

export default function MachinePage({
  params,
  endpoint,
}: {
  params: { machine_id: string };
  endpoint?: string;
}) {
  const navigate = useNavigate();
  const { view } = useSearch({ from: "/machines/$machineId" });

  const { data: machine, isLoading } = useQuery<any>({
    queryKey: ["machine", params.machine_id],
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (machine?.status === "building" && view !== "logs") {
      navigate({
        to: "/machines/$machineId",
        params: { machineId: params.machine_id },
        search: { view: "logs" }
      });
    }
  }, [machine?.status, view, navigate, params.machine_id]);

  const setView = (newView: View) => {
    navigate({
      to: "/machines/$machineId",
      params: { machineId: params.machine_id },
      search: { view: newView }
    });
  };

  const isDockerCommandStepsNull =
    machine?.docker_command_steps === null &&
    machine?.type === "comfy-deploy-serverless";

  const routes = ["Overview", "Settings", "Logs"]
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
      <div className="w-full max-w-[1500px] mx-auto md:p-4">
        <Skeleton className="h-10 w-48 m-4 rounded-[8px]" />
        <div className="flex flex-row gap-3 p-4 pb-2">
          <Skeleton className="h-10 w-24 rounded-[8px]" />
          <Skeleton className="h-10 w-24 rounded-[8px]" />
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
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
    <div>
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

      <div className="w-full max-w-[1500px] mx-auto md:p-4">
        <h1 className="text-2xl font-medium p-4">{machine.name}</h1>

        {(() => {
          switch (view) {
            case "settings":
              return <div>Settings</div>;
            case "overview":
              return <div>Overview</div>;
            case "logs":
              return <div>Logs</div>;
          }
        })()}
      </div>
    </div>
  );
}
