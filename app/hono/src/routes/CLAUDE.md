# Routes — API Route Modules

## 3-File Pattern

Every entity follows this strict convention:

```
{entity}/
├── {entity}.index.ts      # Router assembly
├── {entity}.routes.ts     # OpenAPI route definitions
├── {entity}.handlers.ts   # Business logic
└── {entity}.test.ts       # Integration tests
```

### `{entity}.routes.ts` — Route Definitions
```typescript
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

export const getProjectsRoute = createRoute({
  path: "/projects",
  tags: ["Projects"],
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(selectSchema), "Description"),
  },
});
```

### `{entity}.handlers.ts` — Handlers
```typescript
import type { AppRouterHandler } from "../../@types/open-api-hono";
import type * as routes from "./{entity}.routes";

export const getProjectsHandler: AppRouterHandler<typeof routes.getProjectsRoute> = async (c) => {
  const result = await database.query.projects.findMany();
  return c.json(result, HttpStatusCodes.OK);
};
```

### `{entity}.index.ts` — Router
```typescript
import { APP_HONO } from "../../constant";
import { createApp } from "../../library/create-app";
import * as handlers from "./{entity}.handlers";
import * as routes from "./{entity}.routes";

const router = createApp()
  .basePath(APP_HONO.BASE_PATH)
  .openapi(routes.getRoute, handlers.getHandler);

export default router;
```

## Existing Modules

| Module | Endpoints | Schema Source |
|--------|-----------|--------------|
| `curriculum/` | GET, POST, GET/:id, PATCH/:id, DELETE/:id | `database/schema/curriculum-schema.ts` |
| `projects/` | GET, POST, GET/:id, PATCH/:id, DELETE/:id, DELETE all | `database/schema/projects-schema.ts` |
| `skills/` | GET, POST, GET/:id, PATCH/:id, DELETE/:id, DELETE all | `database/schema/skills-schema.ts` |
| `work-experience/` | GET, POST, GET/:id, PATCH/:id, DELETE/:id, DELETE all | `database/schema/work-experience-schema.ts` |

## Adding a New Route Module

1. Create schema in `../database/schema/{entity}-schema.ts` (Drizzle table + Zod schemas)
2. Create folder `{entity}/` with the 3 files + test
3. Register in `../app.ts`: `app.route("/", entityRouter)`
4. Add route constant to `../constant/index.ts` under `ROUTES`
