import { UIBoundaryError, UIFullPageDotsLoaderOnFire } from "@package/ui";
import { DarkModeProvider, TanstackQueryProvider } from "@package/utility/provider";
import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";

import "./global.css";

import { ErrorBoundary } from "react-error-boundary";

import { APP_PORTFOLIO } from "./constant/index.ts";
import { env } from "./environment/env.ts";
import TanstackRouterProvider from "./provider/tanstack-router-provider.tsx";
import "./library/i18next.ts";

console.warn("ENV", Object.entries(env).reduce((acc: Record<string, string | boolean>, [key, value]) => {
  acc[key] = value;
  return acc;
}, {}));

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary FallbackComponent={UIBoundaryError}>
        <DarkModeProvider defaultTheme="dark">

          <Suspense fallback={<UIFullPageDotsLoaderOnFire />}>
            <TanstackQueryProvider

              queryClient={APP_PORTFOLIO.TANSTACK.QUERY_CLIENT}
              showDevtool={env.VITE_SHOW_TANSTACK_DEVTOOLS}
            >

              <TanstackRouterProvider />
            </TanstackQueryProvider>
          </Suspense>

        </DarkModeProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
}
