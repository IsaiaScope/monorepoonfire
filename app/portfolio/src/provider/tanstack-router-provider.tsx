import { UIRouterError } from "@package/ui";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { APP_PORTFOLIO } from "../constant";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  context: { queryClient: APP_PORTFOLIO.TANSTACK.QUERY_CLIENT },
  defaultErrorComponent: UIRouterError,
  // defaultNotFoundComponent: NotFoundOnFire,
  // defaultPendingComponent: FullPageDotsLoaderOnFire,
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
