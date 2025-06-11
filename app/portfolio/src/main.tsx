import { BoundaryUIError } from "@package/ui";
import { DarkModeProvider, TanstackQueryProvider } from "@package/utility/provider";
import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";

import "./global.css";

import { ErrorBoundary } from "react-error-boundary";

import { APP_PORTFOLIO } from "./constant/index.ts";
import { env } from "./environment/env.ts";
import TanstackRouterProvider from "./provider/tanstack-router-provider.tsx";
import reportWebVitals from "./reportWebVitals.ts";
import "./library/i18next.ts";

console.warn("ENV", Object.entries(env).reduce((acc: Record<string, string | boolean>, [key, value]) => {
  acc[key] = value;
  return acc;
}, {}));

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary FallbackComponent={BoundaryUIError}>
        <DarkModeProvider>

          <Suspense fallback={<div className="bg-amber-500">Loading...</div>}>
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
