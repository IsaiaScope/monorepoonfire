# About Feature

Displays skills, frameworks, CV download, and an animated globe visualization.

## Files

| File | Purpose |
|------|---------|
| `about.tsx` | Main component — assembles sub-components |
| `about.test.tsx` | Integration tests |
| `api/skills.ts` | `getSkills()` — fetches from `GET /api/skills` |
| `api/use-skills.ts` | `useGetSkills()` — TanStack Query hook |
| `component/download.tsx` | CV download button (links to OneDrive) |
| `component/frameworks.tsx` | Framework/tech stack display |
| `component/globe.tsx` | Animated 3D globe (cobe library) |
| `component/orbiting-circle.tsx` | Orbiting circle animation |
| `component/skill.tsx` | Individual skill badge |
| `component/wobble-card.tsx` | Wobble animation card container |

## Data Flow

`useGetSkills()` → fetches skills from backend → renders as `Skill` badges grouped by category

## Key Dependencies

- `cobe` — 3D globe rendering
- `@package/shadcn` — Badge, Skeleton, Tooltip components
