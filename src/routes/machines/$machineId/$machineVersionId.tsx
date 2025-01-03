import { MachineVersionDetail } from "@/components/machine/machine-version-detail";
import { Badge } from "@/components/ui/badge";
import { Portal } from "@/components/ui/custom/portal";
import {
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/machines/$machineId/$machineVersionId")({
  component: RouteComponent,
});

type View = "settings" | "deployments" | undefined;

function RouteComponent() {
  const { machineId, machineVersionId } = Route.useParams();
  const { data: machine } = useQuery<any>({
    queryKey: ["machine", machineId],
    refetchInterval: 5000,
  });
  const { data: machineVersion } = useQuery<any>({
    queryKey: [
      "machine",
      "serverless",
      machineId,
      "versions",
      machineVersionId,
    ],
  });
  const navigate = useNavigate();

  const isDockerCommandStepsNull =
    machine?.docker_command_steps === null &&
    machine?.type === "comfy-deploy-serverless";

  const { openMobile: isSidebarOpen } = useSidebar();

  const routes = ["Overview", "Settings", "Deployments"]
    .filter((name) => !isDockerCommandStepsNull || name !== "Settings")
    .map((name) => ({
      name,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        navigate({
          to: "/machines/$machineId",
          params: { machineId },
          search: {
            view:
              name === "Overview" ? undefined : (name.toLowerCase() as View),
          },
        });
      },
    }));

  return (
    <>
      <Portal targetId="sidebar-panel-machines" trigger={isSidebarOpen}>
        <SidebarMenuSub>
          {routes.map((route) => (
            <SidebarMenuSubItem key={route.name}>
              <SidebarMenuSubButton
                onClick={route.onClick}
                className={route.name === "Deployments" ? "" : "opacity-50"}
              >
                <span>
                  {route.name === "Deployments" ? (
                    <>
                      Deployments{" "}
                      <Badge variant={"outline"} className="ml-2">
                        v{machineVersion?.version}
                      </Badge>
                    </>
                  ) : (
                    route.name
                  )}
                </span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </Portal>

      <MachineVersionDetail
        machineId={machineId}
        machineVersionId={machineVersionId}
      />
    </>
  );
}
