# Work Feature

Work experience timeline display.

## Files

| File | Purpose |
|------|---------|
| `work.tsx` | Main component — timeline layout |
| `work.test.tsx` | Integration tests |
| `api/work-experiences.ts` | `getWorkExperiences()` — fetches from `GET /api/work-experience` |
| `api/use-work-experiences.ts` | `useGetWorkExperiences()` — TanStack Query hook |
| `component/timeline.tsx` | Timeline visualization component |
| `component/timeline.test.tsx` | Timeline tests |

## Data Flow

`useGetWorkExperiences()` → fetches from backend → filters by current language → renders as vertical timeline

## Key Dependencies

- Work experiences have multilingual content — filtered by i18n locale
- Timeline is a custom component, not from shadcn
