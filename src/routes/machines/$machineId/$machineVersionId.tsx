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

  const { openMobile: isSidebarOpen } = useSidebar();

  return (
    <>
      <Portal targetId="sidebar-panel-machines" trigger={isSidebarOpen}>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                navigate({
                  to: "/machines/$machineId",
                  params: { machineId },
                  search: { view: "deployments" as View },
                });
              }}
            >
              <span>
                Deployments{" "}
                <Badge variant={"outline"} className="ml-2">
                  v{machineVersion?.version}
                </Badge>
              </span>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </Portal>

      <MachineVersionDetail
        machineId={machineId}
        machineVersionId={machineVersionId}
      />
    </>
  );
}
