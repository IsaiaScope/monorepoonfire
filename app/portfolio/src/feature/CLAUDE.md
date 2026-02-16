# Features — Self-Contained UI Modules

## Structure Convention

Each feature is a self-contained module:

```
{feature}/
├── {feature}.tsx           # Main component (exported, used in routes)
├── {feature}.test.tsx      # Feature-level tests
├── api/                    # Data fetching (if feature needs backend data)
│   ├── {resource}.ts       # Raw API call: honoClient.api.{resource}.$get()
│   └── use-{resource}.ts   # TanStack Query hook wrapper
├── component/              # Sub-components specific to this feature
│   ├── {name}.tsx
│   └── {name}.test.tsx
├── hooks/                  # Feature-specific hooks (optional)
└── utility/                # Feature-specific helpers (optional)
```

## Features

| Feature | Backend API | Description |
|---------|-------------|-------------|
| `about/` | `GET /api/skills` | Skills display, CV download, animated globe |
| `contact/` | EmailJS (client-side) | Contact form with email sending |
| `hero/` | None | Landing section with animated text |
| `projects/` | `GET /api/projects` | Project cards with detail modal |
| `work/` | `GET /api/work-experience` | Work experience timeline |

## Query Hook Pattern

Every API-connected feature uses this 2-file approach:

**`api/{resource}.ts`** — Raw fetch:
```typescript
export const getSkills = async () => {
  const res = await honoClient.api.skills.$get();
  return await res.json();
};
```

**`api/use-{resource}.ts`** — Query hook:
```typescript
export function useGetSkills(options?: UseQueryOptions) {
  return useQuery({
    queryKey: [APP_PORTFOLIO.TANSTACK.QUERY_KEY.GET_SKILLS],
    queryFn: getSkills,
    ...{ ...DEFAULT_USE_QUERY_OPTIONS, ...options },
  });
}
```

Default query options disable all refetching (staleTime: Infinity) — portfolio data is static.

## Adding a Feature

1. Create folder `src/feature/{name}/`
2. Create main component `{name}.tsx`
3. If needs backend data: create `api/` folder with fetch + hook
4. Add feature component to the appropriate route in `src/routes/`
5. Add query key to `src/constant/tanstack.ts`
