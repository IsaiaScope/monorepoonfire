# Hero Feature

Landing section with animated text effects. No backend API — purely presentational.

## Files

| File | Purpose |
|------|---------|
| `hero.tsx` | Main component — assembles hero section |
| `component/hero-text.tsx` | Animated heading text |
| `component/hero-text.test.tsx` | Text render tests |
| `component/hero-background.tsx` | Animated background effects |
| `component/hero-background.test.tsx` | Background tests |
| `component/flip-words.tsx` | Word flip/rotate animation |
| `component/flip-words.test.tsx` | Animation tests |
| `component/alien.tsx` | Decorative alien graphic |

## Notes

- No API calls — all content from i18n translations
- Heavy use of CSS animations and Framer Motion
- `flip-words.tsx` cycles through translated word arrays
