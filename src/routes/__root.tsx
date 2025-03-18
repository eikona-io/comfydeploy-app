import {
  Outlet,
  createRootRouteWithContext,
  redirect,
  useLocation,
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
import { AppSidebar } from "@/components/app-sidebar";
import { ComfyCommand } from "@/components/comfy-command";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SignedIn, type useClerk, type useAuth } from "@clerk/clerk-react";
import { RedirectToSignIn, SignedOut } from "@clerk/clerk-react";
import React from "react";
import { Toaster } from "sonner";
import { Providers } from "../lib/providers";

type Context = {
  auth?: ReturnType<typeof useAuth>;
  clerk?: ReturnType<typeof useClerk>;
};

const publicRoutes = [
  "/home",
  "/auth/sign-in",
  "/auth/sign-up",
  "/waitlist",
  { path: "/share", wildcard: true },
];

export const Route = createRootRouteWithContext<Context>()({
  component: RootComponent,
  beforeLoad: async ({ context, location }) => {
    while (!context.clerk?.loaded) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const isPublicRoute = publicRoutes.some((route) => {
      if (typeof route === "string") {
        return location.pathname === route;
      }
      return route.wildcard && location.pathname.startsWith(route.path);
    });

    if (!context.clerk?.session && !isPublicRoute) {
      throw redirect({
        to: "/auth/sign-in",
        search: {
          redirect: location.href,
        },
      });
    }

    // Only redirect from root to home if user is signed in
    if (context.clerk?.session && location.pathname === "/") {
      throw redirect({
        to: "/workflows",
      });
    }
  },
});

function RootComponent() {
  // useEffect(() => {
  // 	if (!isSignedIn) {
  // 		// navigate({ to: "/" });
  // 	} else {
  // 		navigate({ to: "/workflows" });
  // 	}
  // }, [isSignedIn, navigate]);

  const { pathname } = useLocation();
  const isSessionPage = pathname.includes("/sessions/");
  const isAuthPage = pathname.includes("/auth/");

  return (
    <SidebarProvider>
      <Providers>
        {/* <SignedOut>
          <RedirectToSignIn />
        </SignedOut> */}
        {!isSessionPage && (
          <SignedIn>
            <AppSidebar />
          </SignedIn>
        )}
        <div className="flex max-h-[100dvh] w-full flex-col items-center justify-start overflow-x-auto">
          <div className="fixed z-[-1] h-full w-full bg-white">
            <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          </div>
          <SidebarTrigger className="fixed top-4 left-2 z-50 h-8 w-8 rounded-full bg-secondary p-2 md:hidden" />
          {!isAuthPage && (
            <SignedIn>
              <Outlet />
            </SignedIn>
          )}
          {isAuthPage && <Outlet />}
          {!isAuthPage && (
            <SignedOut>
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-2xl font-bold">You are signed out</p>
              </div>
            </SignedOut>
          )}
          <ComfyCommand />
          <Toaster richColors closeButton={true} />
        </div>
      </Providers>
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </SidebarProvider>
  );
}
