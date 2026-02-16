# Contact Feature

Contact form with email sending via EmailJS (client-side, no backend API).

## Files

| File | Purpose |
|------|---------|
| `contact.tsx` | Main component — form layout |
| `component/contact-form.tsx` | Form implementation (react-hook-form + zod validation) |
| `component/contact-form.test.tsx` | Form tests |
| `component/animated-images.tsx` | Background animated images |
| `component/background-lines.tsx` | Background decoration |
| `utility/use-send-email.ts` | `useSendEmail()` — TanStack Mutation hook wrapping EmailJS |

## Data Flow

Form submit → `useSendEmail()` mutation → `emailjs.send()` → email sent directly from browser

## Key Dependencies

- `@emailjs/browser` — Client-side email sending
- `react-hook-form` + `@hookform/resolvers/zod` — Form state + validation
- `@package/shadcn` — Form, Input, Textarea, Button, Toaster components
