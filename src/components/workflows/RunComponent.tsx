"use client";

import { LoadingWrapper } from "@/components/loading-wrapper";
import { CardContent } from "@/components/ui/card";
import { useWorkflowIdInWorkflowPage } from "@/hooks/hook";
import { RunsTable } from "./RunsTable";

import { motion } from "framer-motion";
import { RunWorkflowButton } from "../run/VersionSelect";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";

export default function RunComponent(props: {
  defaultData?: any;
}) {
  const workflow_id = useWorkflowIdInWorkflowPage();
  const [runId, _] = useQueryState("run-id");

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
          <h2 className="mb-4 font-bold text-2xl">Requests</h2>
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
