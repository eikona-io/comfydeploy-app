import { WorkflowList } from "@/components/workflow-list";
import { useAuth } from "@clerk/clerk-react";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/workflows/")({
	component: RouteComponent,
	beforeLoad: ({ context, location }) => {
		// if (!context.auth?.isSignedIn) {
		// 	throw redirect({
		// 		to: "/auth/sign-in",
		// 		search: {
		// 			redirect: location.href,
		// 		},
		// 	});
		// }
	},
});

function RouteComponent() {
	return <WorkflowList />;
}
