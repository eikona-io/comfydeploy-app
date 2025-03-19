import {
  ClerkProvider,
  useAuth,
  useClerk,
  useOrganizationList,
} from "@clerk/clerk-react";
import {
  RouterProvider,
  createRouter,
  redirect,
  useRouter,
  createFileRoute,
  createRoute,
  type Route as RouteType,
  useLocation,
} from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import "./globals.css";
import { LoadingIcon } from "@/components/ui/custom/loading-icon";
import { useEffect } from "react";
// Set up a Router instance
import { type RootRouteContext, Route } from "./routes/__root";
import { orgPrefixPaths } from "./orgPrefixPaths";

// Add this function before creating the orgRoute
function updateRoutePaths(route: RouteType) {
  // console.log(route.options);
  if (
    route.options.path &&
    orgPrefixPaths.some((prefix) => route.options.path.startsWith(prefix))
  ) {
    // Remove leading slash and add $orgId prefix
    const newPath = route.options.path.startsWith("/")
      ? route.options.path.slice(1)
      : route.options.path;
    // route.options.path = `$orgId/${newPath}`;
    // const existingBeforeLoad = route.options.beforeLoad;
    route.update({
      path: `$orgId/${newPath}`,
    });
  }

  // Recursively update children if they exist
  if (route.children) {
    route.children.forEach(updateRoutePaths);
  }
}

// Update all routes in the routeTree that match orgPrefixPaths
(routeTree.children as unknown as any[])?.forEach(updateRoutePaths);

const existingBeforeLoad = routeTree.options.beforeLoad;
routeTree.update({
  beforeLoad: async (ctx) => {
    await existingBeforeLoad?.(ctx);

    const location = ctx.location;
    console.log("location", location);

    if (location.pathname.includes("$orgId")) {
      location.pathname = location.pathname.replace("$orgId", "");
    }

    const context: RootRouteContext = ctx.context;

    // Guard against redirect loops
    if (location.pathname === "/org-not-found") return;

    const memberships = context.clerk?.user?.organizationMemberships;
    const personalOrg = context.clerk?.user?.username ?? "personal";
    let currentOrg = context.clerk?.organization?.slug || null;

    // Check if path matches any org prefix paths
    const case1Match = orgPrefixPaths.some((path) =>
      location.pathname.startsWith(path),
    );

    const pathParts = location.pathname.split("/");
    const pathWithoutOrg = `/${pathParts.slice(2).join("/")}`;
    const case2Match = orgPrefixPaths.some((path) =>
      pathWithoutOrg.startsWith(path),
    );

    const currentRouteIncomingOrg =
      (case2Match ? pathParts[1] : case1Match ? currentOrg : null) ?? null;

    const inPathWithOrgPrefix = case1Match || case2Match;

    // Check if the incoming org exists in user memberships
    const isValidOrg = memberships?.some(
      (membership) => membership.organization.slug === currentRouteIncomingOrg,
    );
    const notPersonalOrg =
      currentRouteIncomingOrg !== personalOrg &&
      currentRouteIncomingOrg !== null;

    // log all items
    // console.log("shit", {
    //   inPathWithOrgPrefix,
    //   pathParts,
    //   currentRouteIncomingOrg,
    //   currentOrg,
    //   isValidOrg,
    //   notPersonalOrg,
    // });

    if (inPathWithOrgPrefix && currentRouteIncomingOrg !== currentOrg) {
      // If org doesn't exist and it's not personal org, redirect to org-not-found
      if (!isValidOrg && notPersonalOrg) {
        throw redirect({
          to: "/org-not-found",
          search: {
            org: currentRouteIncomingOrg,
          },
        });
      }

      if (currentRouteIncomingOrg !== currentOrg) {
        console.log("setting org", currentRouteIncomingOrg);
        currentOrg = currentRouteIncomingOrg;
        context.clerk?.setActive({
          organization: currentRouteIncomingOrg,
        });
      }
    }

    // Add org prefix to path if needed
    currentOrg = currentOrg ?? personalOrg;

    if (
      inPathWithOrgPrefix &&
      currentOrg &&
      !location.pathname.includes(`/${currentOrg}/`)
    ) {
      // const shouldHaveOrgPrefix = orgPrefixPaths.some((path) =>
      //   location.pathname.startsWith(path),
      // );

      // if (shouldHaveOrgPrefix) {
      throw redirect({
        to: `/${currentOrg}${location.pathname}`,
        search: location.search,
      });
      // }
    }
  },
});

// Add the org route and its children
// routeTree.addChildren([orgRoute]);

// Create a router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined as ReturnType<typeof useAuth> | undefined,
    clerk: undefined as ReturnType<typeof useClerk> | undefined,
  },
});

const existingGetMatchedRoutes = router.getMatchedRoutes;
router.getMatchedRoutes = (next, opts) => {
  if (
    next.pathname &&
    orgPrefixPaths.some((prefix) => next.pathname.startsWith(prefix))
  ) {
    // Remove leading slash and add $orgId prefix
    const newPath = next.pathname.startsWith("/")
      ? next.pathname.slice(1)
      : next.pathname;

    next.pathname = `$orgId/${newPath}`;
    next.href = `$orgId/${newPath}`;

    console.log(next, opts);
  }
  // if (
  //   opts?.to &&
  //   typeof opts.to === "string" &&
  //   orgPrefixPaths.some((prefix) => opts.to?.startsWith(prefix))
  // ) {
  //   // Remove leading slash and add $orgId prefix
  //   const newPath = opts.to.startsWith("/") ? opts.to.slice(1) : opts.to;

  //   opts.to = `$orgId/${newPath}`;

  //   console.log(next, opts);
  // }

  const result = existingGetMatchedRoutes(next, opts);
  return result;
};

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set");
}

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element not found");
}

function InnerApp() {
  const auth = useAuth();
  const clerk = useClerk();

  return <RouterProvider router={router} context={{ auth, clerk }} />;
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/"
    >
      <InnerApp />
    </ClerkProvider>,
  );
}
