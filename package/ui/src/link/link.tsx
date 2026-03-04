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
  target = "_blank",
  rel = "noopener noreferrer",
  role = "link",
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
