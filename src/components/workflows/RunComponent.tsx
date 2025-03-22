import { LoadingWrapper } from "@/components/loading-wrapper";
import { CardContent } from "@/components/ui/card";
import { useWorkflowIdInWorkflowPage } from "@/hooks/hook";
import { FilterDropdown, RunsTable } from "./RunsTable";

import { motion } from "framer-motion";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Play } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export default function RunComponent(props: {
  defaultData?: any;
}) {
  const workflow_id = useWorkflowIdInWorkflowPage();
  const [runId, _] = useQueryState("run-id");
  const navigate = useNavigate();

  if (!workflow_id) {
    return null;
  }

  return (
    <motion.div className="w-full" layout>
      <div
        className={cn(
          "relative h-fit w-full transition-all duration-300",
          runId && "xl:w-[calc(100%-594px)]",
        )}
      >
        <CardContent className="px-0 pt-6">
          <div className="flex items-center justify-between px-2 pb-4">
            <h2 className="font-bold text-2xl">Requests</h2>
            <div className="flex items-center gap-2">
              <FilterDropdown workflowId={workflow_id} />
              <Button
                onClick={() => {
                  navigate({
                    to: "/workflows/$workflowId/$view",
                    params: { workflowId: workflow_id, view: "playground" },
                  });
                }}
              >
                <Play className="mr-2 h-4 w-4" /> Run
              </Button>
            </div>
          </div>
          <LoadingWrapper tag="runs">
            <RunsTable
              workflow_id={workflow_id}
              defaultData={props.defaultData}
            />
          </LoadingWrapper>
        </CardContent>
      </div>
    </motion.div>
  );
}
