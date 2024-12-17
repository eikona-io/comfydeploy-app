import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workflow/$workflowId")({
	component: WorkflowComponent,
});

function WorkflowComponent() {
	const workflowId = Route.useParams().workflowId;

	return (
		<div className="p-2">
			<h3>Workflow {workflowId}</h3>
		</div>
	);
}
