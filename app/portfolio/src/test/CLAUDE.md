# Test Utilities

## Custom Render

`set-up-test.tsx` exports a custom `render()` that wraps components with all providers:

```typescript
import { render } from "../test/set-up-test";

render(<MyComponent />, {
  viewport: "mobile",     // "mobile" | "tablet" | "desktop"
  location: { pathname: "/contact" },
  language: "it-IT",
});
```

**Wrapped providers:** QueryClient (retry: false) + I18nextProvider

## MSW (Mock Service Worker)

```
mocks/
├── server.ts          # MSW server setup (beforeAll/afterAll/afterEach)
├── handlers.ts        # Default API handlers for all endpoints
├── data/              # Mock response data
│   ├── skills.ts
│   ├── projects.ts
│   └── work-experiences.ts
├── i18n.mock.ts       # i18next mock with real locale data
├── intersection-observer.mock.ts  # IntersectionObserver polyfill
├── media-query.mock.ts            # matchMedia mock for viewport testing
└── router.mock.ts     # TanStack Router context mock
```

## Global Setup (runs before all tests)

- `server.listen()` starts MSW
- `cleanup()` runs after each test
- `server.resetHandlers()` clears custom handlers after each test
- `vi.clearAllMocks()` resets all mocks

## Writing Tests

```typescript
import { render, screen } from "../test/set-up-test";

it("renders skills section", async () => {
  render(<About />);
  expect(await screen.findByText("Skills")).toBeInTheDocument();
});
```

For API-dependent tests, MSW auto-intercepts requests via handlers. To override for a specific test:

```typescript
import { server } from "../test/mocks/server";
import { http, HttpResponse } from "msw";

server.use(
  http.get("*/api/skills", () => HttpResponse.json([], { status: 200 }))
);
```
