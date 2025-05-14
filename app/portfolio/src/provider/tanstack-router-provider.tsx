import { createRouter, RouterProvider } from "@tanstack/react-router";

import { APP_PORTFOLIO_VITE } from "../constant";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  context: { queryClient: APP_PORTFOLIO_VITE.TANSTACK.QUERY_CLIENT },
});

declare module "@tanstack/react-router" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Register {
    router: typeof router;
  }
}

export default function TanstackRouterProvider() {
  return <RouterProvider router={router} />;
}
