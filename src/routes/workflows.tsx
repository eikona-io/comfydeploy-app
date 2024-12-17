import { WorkflowList } from "@/components/workflow-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workflows")({
	component: RouteComponent,
});

function RouteComponent() {
	return <WorkflowList />;
}
