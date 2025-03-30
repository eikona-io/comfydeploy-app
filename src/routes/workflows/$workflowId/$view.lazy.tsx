import { GalleryView } from "@/components/GalleryView";
import { PaddingLayout } from "@/components/PaddingLayout";
import { DeploymentPage } from "@/components/deployment/deployment-page";
import { MachineSettingsWrapper } from "@/components/machine/machine-settings";
import { useIsAdminAndMember } from "@/components/permissions";
import { Playground } from "@/components/run/SharePageComponent";
import { SessionItem } from "@/components/sessions/SessionItem";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/ui/custom/portal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { RealtimeWorkflowProvider } from "@/components/workflows/RealtimeRunUpdate";
import RunComponent from "@/components/workflows/RunComponent";
import WorkflowComponent from "@/components/workflows/WorkflowComponent";
import { ContainersTable } from "@/components/workspace/ContainersTable";
import { LogDisplay } from "@/components/workspace/LogDisplay";
import { useSelectedVersion } from "@/components/workspace/Workspace";
import { WorkspaceClientWrapper } from "@/components/workspace/WorkspaceClientWrapper";
import { WorkspaceStatusBar } from "@/components/workspace/WorkspaceStatusBar";
import { useCurrentWorkflow } from "@/hooks/use-current-workflow";
import { useMachine } from "@/hooks/use-machine";
import { useSessionAPI } from "@/hooks/use-session-api";
import { cn } from "@/lib/utils";
import { Link, createLazyFileRoute, useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

// const pages = [
//   "workspace",
//   "requests",
//   // "containers",
//   "deployment",
//   "playground",
//   "gallery",
// ];

const workspace = ["workspace", "playground", "gallery", "machine"];
const deployment = ["deployment", "requests"];

export const Route = createLazyFileRoute("/workflows/$workflowId/$view")({
  component: WorkflowPageComponent,
});

function WorkflowPageComponent() {
  const { workflowId, view: currentView } = Route.useParams();

  const [mountedViews, setMountedViews] = useState<Set<string>>(
    new Set([currentView]),
  );

  useEffect(() => {
    if (currentView === "gallery") {
      return;
    }
    setMountedViews((prev) => {
      const newSet = new Set(prev);
      newSet.add(currentView);
      return newSet;
    });
  }, [currentView]);

  let view: React.ReactNode;

  const { workflow } = useCurrentWorkflow(workflowId);
  const { data: machine } = useMachine(workflow?.selected_machine_id);

  const { value: version } = useSelectedVersion(workflowId);
  const isAdminAndMember = useIsAdminAndMember();

  switch (currentView) {
    case "requests":
      view = (
        <PaddingLayout>
          <RequestPage />
        </PaddingLayout>
      );
      break;
    case "containers":
      view = (
        <PaddingLayout className="mt-10">
          <ContainersTable workflow_id={workflowId} />
        </PaddingLayout>
      );
      break;
    case "deployment":
      view = (
        <PaddingLayout>
          <DeploymentPage />
        </PaddingLayout>
      );
      break;
    case "playground":
      view = (
        <PaddingLayout>
          <div className={cn("h-full w-full")}>
            {workflow?.selected_machine_id && version?.id && (
              <RealtimeWorkflowProvider workflowId={workflowId}>
                <Playground runOrigin={"manual"} workflow={workflow} />
              </RealtimeWorkflowProvider>
            )}
          </div>
        </PaddingLayout>
      );
      break;
    case "gallery":
      view = <GalleryView workflowID={workflowId} />;
      break;
    case "machine":
      view = (
        <div className="relative p-4">
          {machine && (
            <MachineSettingsWrapper
              machine={machine}
              readonly={!isAdminAndMember}
              className="top-0"
            />
          )}
        </div>
      );
      break;
  }

  const tabs = isAdminAndMember ? workspace : ["playground", "gallery"];

  const { createSession, listSession, deleteSession } = useSessionAPI(
    workflow?.selected_machine_id,
  );

  const { data: sessions } = listSession;

  const { openMobile: isMobileSidebarOpen, isMobile } = useSidebar();

  const router = useRouter();

  const [sessionId, setSessionId] = useQueryState("sessionId");
  const sessionSelected = sessions?.find(
    (session) => session.session_id === sessionId,
  );

  return (
    <div className="relative flex h-full w-full flex-col">
      <Portal
        targetId="sidebar-panel"
        trigger={isMobile || !!sessionId ? isMobileSidebarOpen : true}
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="px-1">
                  {tabs.map((tab) => (
                    <SidebarMenuItem key={tab}>
                      <SidebarMenuButton
                        onClick={() => {
                          router.navigate({
                            to: "/workflows/$workflowId/$view",
                            params: { workflowId, view: tab },
                          });
                        }}
                        className={cn(
                          currentView === tab && "bg-gray-200 text-gray-900",
                          "transition-colors capitalize",
                        )}
                      >
                        {tab === "workspace"
                          ? "ComfyUI"
                          : tab === "machine"
                            ? "Environment"
                            : tab}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {isAdminAndMember && (
              <SidebarGroup>
                <SidebarGroupLabel>API</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="px-1">
                    {deployment.map((tab) => (
                      <SidebarMenuItem key={tab}>
                        <SidebarMenuButton
                          onClick={() => {
                            router.navigate({
                              to: "/workflows/$workflowId/$view",
                              params: { workflowId, view: tab },
                            });
                          }}
                          className={cn(
                            currentView === tab && "bg-gray-200 text-gray-900",
                            "transition-colors",
                          )}
                          asChild
                        >
                          <button className="w-full capitalize" type="button">
                            {tab}
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </motion.div>
        </AnimatePresence>
      </Portal>
      {mountedViews.has("workspace") ? (
        <div
          className="h-full w-full"
          style={{
            display: currentView === "workspace" ? "block" : "none",
          }}
        >
          <WorkspaceClientWrapper workflow_id={workflowId} />
        </div>
      ) : null}
      {view}
    </div>
  );
}

function RequestPage() {
  const { workflowId, view: currentView } = Route.useParams();
  const [deploymentId, setDeploymentId] = useQueryState("filter-deployment-id");
  const [status, setStatus] = useQueryState("filter-status");

  return (
    <>
      <motion.div
        layout
        className={cn("flex h-full w-full flex-col gap-4 pt-4 lg:flex-row")}
      >
        <RealtimeWorkflowProvider
          workflowId={workflowId}
          status={status ?? undefined}
          deploymentId={deploymentId ?? undefined}
        >
          <RunComponent />
          <WorkflowComponent />
        </RealtimeWorkflowProvider>
      </motion.div>
    </>
  );
}

export function WorkflowsBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/">Home</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <span>Workflows</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <Link href="/machines">Machines</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/storage">Storage</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
