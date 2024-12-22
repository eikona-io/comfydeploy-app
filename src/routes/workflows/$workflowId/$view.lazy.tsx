import { GalleryView } from "@/components/GalleryView";
import { PaddingLayout } from "@/components/PaddingLayout";
import { LoadingWrapper } from "@/components/loading-wrapper";
import { useIsAdminAndMember } from "@/components/permissions";
import { SharePageComponent } from "@/components/run/SharePageComponent";
import { SessionItem } from "@/components/sessions/SessionItem";
import { Portal } from "@/components/ui/custom/portal";
import {
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { RealtimeWorkflowProvider } from "@/components/workflows/RealtimeRunUpdate";
import RunComponent from "@/components/workflows/RunComponent";
import WorkflowComponent from "@/components/workflows/WorkflowComponent";
import { ContainersTable } from "@/components/workspace/ContainersTable";
import { APIDocs } from "@/components/workspace/DeploymentDisplay";
import { MachineSelect } from "@/components/workspace/MachineSelect";
import { useSelectedVersion } from "@/components/workspace/Workspace";
import { WorkspaceClientWrapper } from "@/components/workspace/WorkspaceClientWrapper";
import { useCurrentWorkflow } from "@/hooks/use-current-workflow";
import { useSessionAPI } from "@/hooks/use-session-api";
import {
  getInputsFromWorkflowAPI,
  getInputsFromWorkflowJSON,
} from "@/lib/getInputsFromWorkflow";
import { cn } from "@/lib/utils";
import {
  createLazyFileRoute,
  notFound,
  useRouter,
} from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

const pages = [
  "workspace",
  "requests",
  "containers",
  "deployment",
  "playground",
  "gallery",
];

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

  const { value: version } = useSelectedVersion(workflowId);

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
          <div className="relative mx-auto my-10 w-full max-w-screen-lg">
            <LoadingWrapper tag="api">
              <APIDocs
                domain={process.env.NEXT_PUBLIC_CD_API_URL!}
                workflow_id={workflowId}
              />
            </LoadingWrapper>
          </div>
        </PaddingLayout>
      );
      break;
    case "playground":
      view = (
        <PaddingLayout>
          <div className={cn("h-full w-full")}>
            {workflow?.selected_machine_id && version?.id && (
              <SharePageComponent
                runOrigin={"manual"}
                machine_id={workflow?.selected_machine_id}
                workflow_version_id={version?.id}
                inputs={getInputsFromWorkflowAPI(version?.workflow_api)}
              />
            )}
          </div>
        </PaddingLayout>
      );
      break;
    case "gallery":
      view = <GalleryView workflowID={workflowId} />;
      break;
  }

  const isAdminAndMember = useIsAdminAndMember();

  const tabs = isAdminAndMember ? pages : ["playground", "gallery"];

  const { createSession, listSession, deleteSession } = useSessionAPI(
    workflow?.selected_machine_id,
  );

  const { data: sessions } = listSession;

  const { openMobile: isMobileSidebarOpen } = useSidebar();

  const router = useRouter();

  const [sessionId, setSessionId] = useQueryState("sessionId");

  return (
    <div className="relative flex h-full w-full flex-col">
      <Portal targetId="sidebar-panel" trigger={isMobileSidebarOpen}>
        <SidebarMenuSub>
          {tabs.map((tab) => (
            <SidebarMenuSubItem key={tab}>
              <SidebarMenuSubButton
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
                // role="button"
              >
                <button className="w-full capitalize" type="button">
                  {tab}
                </button>
              </SidebarMenuSubButton>

              {tab === "workspace" && sessions && sessions.length > 0 && (
                <SidebarMenuSub>
                  {sessions?.map((session, index) => (
                    <SidebarMenuSubItem key={session.id}>
                      <SidebarMenuSubButton className="w-44">
                        <SessionItem
                          key={session.id}
                          session={session}
                          index={index}
                          isActive={sessionId === session.session_id}
                          onSelect={(selectedSessionId) => {
                            setSessionId(selectedSessionId);
                            // setView("workspace"); // Switch to workspace view
                            // setActiveTabIndex(tabs.indexOf("workspace")); // Update active tab
                            router.navigate({
                              to: "/workflows/$workflowId/$view",
                              params: { workflowId, view: "workspace" },
                            });
                          }}
                          onDelete={async (sessionIdToDelete) => {
                            setSessionId(null);
                            await deleteSession.mutateAsync({
                              sessionId: sessionIdToDelete,
                            });
                          }}
                        />
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}

              {/* TODO: Add share options */}
              {/* {tab === "playground" && isAdminAndMember && (
                <DropdownMenu>
                  {dialog}
                  {privateDialog}
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction className="mr-4">
                      <MoreHorizontal />
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>˝
                  <DropdownMenuContent className="w-56" forceMount>
                    {menuItem}
                    <span className="pointer-events-none opacity-30">
                      {privateMenuItem}
                    </span>
                  </DropdownMenuContent>
                </DropdownMenu>
              )} */}
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </Portal>
      {mountedViews.has("workspace") ? (
        <div
          className="h-full w-full"
          style={{ display: currentView === "workspace" ? "block" : "none" }}
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

  return (
    <>
      <motion.div
        layout
        className={cn("flex h-full w-full flex-col gap-4 pt-4 lg:flex-row")}
      >
        <RealtimeWorkflowProvider workflowId={workflowId}>
          <RunComponent />
          <WorkflowComponent />
        </RealtimeWorkflowProvider>
      </motion.div>
    </>
  );
}
