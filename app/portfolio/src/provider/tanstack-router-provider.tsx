// UI components for loading states and error handling
import { UIFullPageDotsLoaderOnFire, UIRouterError } from "@package/ui";
// TanStack Router core components and utilities
import { createRouter, Navigate, RouterProvider } from "@tanstack/react-router";

// Application constants including TanStack Query client
import { APP_PORTFOLIO } from "../constant";
// Auto-generated route tree configuration
import { routeTree } from "./routeTree.gen";

// Create the main router instance with configuration
const router = createRouter({
  routeTree, // The complete route configuration tree
  context: { queryClient: APP_PORTFOLIO.TANSTACK.QUERY_CLIENT }, // Shared context available to all routes (includes TanStack Query client)
  defaultErrorComponent: UIRouterError, // Component to render when route errors occur
  defaultNotFoundComponent: () => <Navigate to="/" />, // Redirect to home page for 404s
  defaultPendingComponent: UIFullPageDotsLoaderOnFire, // Loading component shown during route transitions
});

// TypeScript module augmentation to register router type globally
declare module "@tanstack/react-router" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Register {
    router: typeof router; // Makes router type available throughout the app for type safety
  }
}

// React component that provides routing functionality to the entire app
export default function TanstackRouterProvider() {
  return <RouterProvider router={router} />; // Wraps the app with TanStack Router context
}
