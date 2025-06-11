import type { QueryClient } from "@tanstack/react-query";

import { UIWrapper } from "@package/ui";
import { TanstackRouterDevtoolsProvider } from "@package/utility/provider";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import Footer from "../components/footer.tsx";
import Header from "../components/header.tsx";
import { env } from "../environment/env.ts";

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <TanstackRouterDevtoolsProvider showDevtool={env.VITE_SHOW_TANSTACK_DEVTOOLS}>
      <UIWrapper tag="main" variant="secondary">
        <Header />
        <UIWrapper tag="section" className="grow">
          <Outlet />
        </UIWrapper>
        <Footer />
      </UIWrapper>
    </TanstackRouterDevtoolsProvider>
  ),
});
