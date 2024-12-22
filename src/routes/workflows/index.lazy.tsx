import WorkflowImport from "@/components/onboarding/workflow-import";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WorkflowList } from "@/components/workflow-list";
import { useCurrentPlan } from "@/hooks/use-current-plan";
import {
  createFileRoute,
  createLazyFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createLazyFileRoute("/workflows/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: "/workflows" });
  const { view } = Route.useSearch();
  const sub = useCurrentPlan();

  // console.log(view);

  return (
    <>
      {view === "import" ? <WorkflowImport /> : <WorkflowList />}

      {!view && (
        <div className="fixed right-6 bottom-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={"icon"}
                  className={`h-14 w-14 shadow-lg ${
                    sub?.features.workflowLimited
                      ? "cursor-not-allowed opacity-70"
                      : ""
                  }`}
                  onClick={() => {
                    if (!sub?.features.workflowLimited) {
                      navigate({
                        search: { view: "import" },
                      });
                    }
                  }}
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              {sub?.features.workflowLimited && (
                <TooltipContent side="left">
                  <p>Workflows Limited Exceeded. </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </>
  );
}
