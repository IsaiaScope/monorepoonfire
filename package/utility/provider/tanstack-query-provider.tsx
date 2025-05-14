import type { QueryClient } from "@tanstack/react-query";

import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// https://tanstack.com/query/v4/docs/framework/react/devtools#devtools-in-production
const ReactQueryDevtoolsProduction = React.lazy(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then(
    d => ({
      default: d.ReactQueryDevtools,
    }),
  ),
);

type Props = {
  children: React.ReactNode;
  queryClient: QueryClient;
  showDevtool: boolean;
};

export default function TanstackQueryProvider({ children, queryClient, showDevtool }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {
        showDevtool
          ? (
              <React.Suspense fallback={null}>
                <ReactQueryDevtoolsProduction />
              </React.Suspense>
            )
          : null
      }
    </QueryClientProvider>
  );
}
