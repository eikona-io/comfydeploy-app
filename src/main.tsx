import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import "./globals.css";
// Set up a Router instance
const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	context: {
		auth: undefined as ReturnType<typeof useAuth> | undefined,
	},
});

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

	// We can use a loading state here to show a loading screen
	if (!auth.isLoaded) {
		return null;
	}

	return <RouterProvider router={router} context={{ auth }} />;
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
