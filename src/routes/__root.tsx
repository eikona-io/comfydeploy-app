import {
	Link,
	Outlet,
	createRootRoute,
	createRootRouteWithContext,
	redirect,
	useBlocker,
	useRouter,
} from "@tanstack/react-router";
const TanStackRouterDevtools =
	process.env.NODE_ENV === "production"
		? () => null // Render nothing in production
		: React.lazy(() =>
				// Lazy load in development
				import("@tanstack/router-devtools").then((res) => ({
					default: res.TanStackRouterDevtools,
					// For Embedded Mode
					// default: res.TanStackRouterDevtoolsPanel
				})),
			);
import { Providers } from "../lib/providers";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React, { useEffect } from "react";
import { SignedIn, useAuth } from "@clerk/clerk-react";
import { RedirectToSignIn, SignedOut, SignIn } from "@clerk/clerk-react";

type Context = {
	auth?: ReturnType<typeof useAuth>;
};

export const Route = createRootRouteWithContext<Context>()({
	component: RootComponent,
	beforeLoad: ({ context, location }) => {
		if (
			context.auth &&
			!context.auth.isSignedIn &&
			location.pathname !== "/auth/sign-in"
		) {
			throw redirect({
				to: "/auth/sign-in",
				// search: {
				// 	redirect: location.href,
				// },
			});
		} else if (
			context.auth &&
			context.auth.isSignedIn &&
			location.pathname === "/"
		) {
			throw redirect({
				to: "/workflows",
			});
		}
	},
});

function RootComponent() {
	const { navigate } = useRouter();
	const { isSignedIn } = useAuth();

	// useEffect(() => {
	// 	if (!isSignedIn) {
	// 		// navigate({ to: "/" });
	// 	} else {
	// 		navigate({ to: "/workflows" });
	// 	}
	// }, [isSignedIn, navigate]);

	return (
		<SidebarProvider>
			<Providers>
				<SignedOut>
					<RedirectToSignIn />
				</SignedOut>
				<SignedIn>
					<AppSidebar />
				</SignedIn>
				<div className="w-full flex max-h-[100dvh] flex-col items-center justify-start overflow-x-auto">
					<SidebarTrigger className="md:hidden fixed top-4 left-2 z-50 bg-secondary rounded-full p-2 w-8 h-8" />
					<Outlet />
				</div>
			</Providers>
			<TanStackRouterDevtools position="bottom-right" />
		</SidebarProvider>
	);
}
