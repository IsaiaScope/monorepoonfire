import { TanstackQueryProvider } from "@package/utility/provider";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "./styles.css";
import { APP_PORTFOLIO_VITE } from "./constant/index.ts";
import { env } from "./environment/env.ts";
import TanstackRouterProvider from "./provider/tanstack-router-provider.tsx";
import reportWebVitals from "./reportWebVitals.ts";

console.warn("ENV", Object.entries(env).reduce((acc: Record<string, string | boolean>, [key, value]) => {
  acc[key] = value;
  return acc;
}, {}));

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
      <TanstackQueryProvider
        queryClient={APP_PORTFOLIO_VITE.TANSTACK.QUERY_CLIENT}
        showDevtool={env.VITE_SHOW_TANSTACK_DEVTOOLS}
      >

        <TanstackRouterProvider />
      </TanstackQueryProvider>
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
