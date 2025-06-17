import type { VariantProps } from "class-variance-authority";

import { cn } from "@package/utility/tailwind";
import { cva } from "class-variance-authority";

const anchorVariants = cva("", {
  variants: {
    variant: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type Props = {
  children: React.ReactNode;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement> &
VariantProps<typeof anchorVariants>;

export default function UILink({
  children,
  className,
  variant,

  /* target="_blank"
  What it does:
  Opens the linked document in a new browser tab or window.
  Why used:
  Useful when you want users to keep your site open while visiting another page.
  Accessibility:
  Not directly an accessibility feature, but opening new tabs/windows can be disorienting for some users. It’s best practice to inform users when a link opens in a new tab. */
  target = "_blank",

  /*   rel="noopener noreferrer"
  What it does:
  noopener: Prevents the new page from being able to access the window.opener property, which protects against certain types of security vulnerabilities (like tabnabbing).
  noreferrer: Prevents the browser from sending the current page’s address as the referrer via the HTTP header.
  Why used:
  For security and privacy when using target="_blank". */
  rel = "noopener noreferrer",

  /*   What it does:
  Explicitly tells assistive technologies (like screen readers) that the element should be treated as a link. */
  role = "link",

  /* tabIndex={0}
  What it does:
  Makes the element focusable via keyboard navigation (Tab key). */
  tabIndex = 0,
  ...props
}: Props) {
  return (
    <a
      {...props}
      rel={rel}
      target={target}
      role={role}
      tabIndex={tabIndex}
      className={cn(anchorVariants({ variant, className }))}
    >
      {children}
    </a>
  );
}
