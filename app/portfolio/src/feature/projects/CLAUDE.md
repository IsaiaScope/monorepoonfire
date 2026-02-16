# Projects Feature

Project showcase with card grid and detail modal.

## Files

| File | Purpose |
|------|---------|
| `projects.tsx` | Main component — project grid layout |
| `projects.test.tsx` | Integration tests |
| `api/projects.ts` | `getProjects()` — fetches from `GET /api/projects` |
| `api/use-projects.ts` | `useGetProjects()` — TanStack Query hook |
| `component/project.tsx` | Individual project card |
| `component/project.test.tsx` | Card tests |
| `component/project-details.tsx` | Project detail modal/dialog |
| `component/project-details.test.tsx` | Detail modal tests |
| `component/projects-list.tsx` | Project list container |
| `component/projects-preview.tsx` | Project preview/thumbnail |
| `hooks/use-mouse-position.ts` | Mouse tracking for hover effects |

## Data Flow

`useGetProjects()` → fetches projects from backend → filters by current language → renders as cards → click opens detail dialog

## Key Dependencies

- `@package/shadcn` — Card, Dialog, Badge, Skeleton components
- Projects have multilingual content — `language` field filters by current i18n locale
- `tags` and `subDescription` stored as JSON strings in the database, parsed in handlers
