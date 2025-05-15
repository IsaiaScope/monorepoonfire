import type { QueryClient } from "@tanstack/react-query";

import { TanstackRouterDevtoolsProvider } from "@package/utility/provider";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import Header from "../components/header.tsx";
import { env } from "../environment/env.ts";

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <TanstackRouterDevtoolsProvider showDevtool={env.VITE_SHOW_TANSTACK_DEVTOOLS}>

      <Header />

      <Outlet />

    </TanstackRouterDevtoolsProvider>
  ),
});
