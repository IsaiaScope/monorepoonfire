// =============================================================================
// ROUTER MOCKS - TanStack Router Mocking
// =============================================================================

import React from "react";

// Mock context object that simulates router state
// This object will be mutated by tests to simulate different routes/states
export const mockRouterContext = {
  location: { pathname: "/" }, // Current route path (default to home)
  navigate: vi.fn(), // Mock navigation function (Vitest mock function)
  search: {}, // URL search parameters (query strings)
  params: {}, // Route parameters (e.g., /user/:id -> { id: "123" })
};

// Mock the entire @tanstack/react-router module
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router"); // Import real module first
  return {
    ...actual, // Spread all actual exports
    // Override specific hooks with mocked versions:
    useLocation: vi.fn(() => mockRouterContext.location), // Returns mocked location
    useNavigate: vi.fn(() => mockRouterContext.navigate), // Returns mocked navigate function
    useSearch: vi.fn(() => mockRouterContext.search), // Returns mocked search params
    useParams: vi.fn(() => mockRouterContext.params), // Returns mocked route params
    // Mock Link component to render as simple anchor tag for testing
    Link: ({ to, children, className, ...props }: any) =>
      React.createElement("a", { href: to, className, ...props }, children),
  };
});
