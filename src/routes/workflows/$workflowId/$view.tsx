import { PaddingLayout } from "@/components/PaddingLayout";
import { useIsAdminAndMember } from "@/components/permissions";
import { SessionItem } from "@/components/sessions/SessionItem";
import { Portal } from "@/components/ui/custom/portal";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { RealtimeWorkflowProvider } from "@/components/workflows/RealtimeRunUpdate";
import RunComponent from "@/components/workflows/RunComponent";
import WorkflowComponent from "@/components/workflows/WorkflowComponent";
import { WorkspaceClientWrapper } from "@/components/workspace/WorkspaceClientWrapper";
import { useCurrentWorkflow } from "@/hooks/use-current-workflow";
import { useSessionAPI } from "@/hooks/use-session-api";
import { cn } from "@/lib/utils";
import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
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

export const Route = createFileRoute("/workflows/$workflowId/$view")({
  component: WorkflowPageComponent,
  beforeLoad(ctx) {
    const { view } = ctx.params;

    if (!pages.includes(view)) {
      throw notFound();
    }
  },
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

  switch (currentView) {
    case "requests":
      view = (
        <PaddingLayout>
          <RequestPage />
        </PaddingLayout>
      );
      break;
    case "workspace":
      view = <WorkspaceClientWrapper workflow_id={workflowId} />;
      break;
  }

  const isAdminAndMember = useIsAdminAndMember();

  const tabs = isAdminAndMember ? pages : ["playground", "gallery"];

  const { workflow } = useCurrentWorkflow(workflowId);

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
