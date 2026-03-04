import "@testing-library/jest-dom";

import type { RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render } from "@testing-library/react";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { i18n, setLanguage } from "./mocks/i18n.mock";
import { setupIntersectionObserverMock } from "./mocks/intersection-observer.mock";
import { setViewport } from "./mocks/media-query.mock";
import { mockRouterContext } from "./mocks/router.mock";
import { server } from "./mocks/server";

setupIntersectionObserverMock();

export type TestRenderOptions = Omit<RenderOptions, "wrapper"> & {
  location?: { pathname: string };
  viewport?: "mobile" | "tablet" | "desktop";
  language?: string;
};

const defaultOptions: TestRenderOptions = {};

// eslint-disable-next-line react-refresh/only-export-components
function TestProviders({
  children,
  options = defaultOptions,
}: {
  children: React.ReactNode;
  options?: TestRenderOptions;
}) {
  const {
    location = { pathname: "/" },
    viewport = "mobile", // mobile-first default
    language = "en-GB",
  } = options;

  mockRouterContext.location = location;
  setViewport(viewport);
  setLanguage(language);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }, // no retries in tests
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </QueryClientProvider>
  );
}

const customRender = (
  ui: ReactElement,
  options?: TestRenderOptions,
) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <TestProviders options={options}>{children}</TestProviders>
    ),
    ...options,
  });
};

export {
  cleanup,
  findByRole,
  findByTestId,
  findByText,
  fireEvent,
  getByRole,
  getByTestId,
  getByText,
  queryByRole,
  queryByTestId,
  queryByText,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";

export { customRender as render };

beforeAll(() => {
  server.listen({ onUnhandledRequest: "warn" });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  server.close();
});
