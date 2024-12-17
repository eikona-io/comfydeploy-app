import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ClerkProvider } from "@clerk/clerk-react";
import { Providers } from "./lib/providers";
import "./globals.css";

// Set up a Router instance
const router = createRouter({
	routeTree,
	defaultPreload: "intent",
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

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<ClerkProvider
			publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
			afterSignOutUrl="/"
			// signInUrl="/sign-in"
			// signUpUrl="/sign-up"
		>
			<RouterProvider router={router} />
		</ClerkProvider>,
	);
}
