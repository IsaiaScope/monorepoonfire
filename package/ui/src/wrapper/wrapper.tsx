import type { VariantProps } from "class-variance-authority";

import { cn } from "@package/utility/tailwind";
import { cva } from "class-variance-authority";

const containerVariantsProp = cva("", {
  variants: {
    variant: {
      default: "",
      primary: "top-0 left-0 right-0 bottom-0 absolute",
      secondary: "flex flex-col min-h-dvh",

    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type Props = {
  children: React.ReactNode;
  className?: string;
  tag: "main" | "section" | "article" | "aside" | "nav" | "header" | "footer";
} & VariantProps<typeof containerVariantsProp> &
React.HTMLAttributes<HTMLDivElement>;

export default function UIWrapper({
  children,
  className,
  variant,
  tag,
  ...props
}: Props) {
  const Comp = tag;
  return (
    <Comp
      className={cn(containerVariantsProp({ variant, className }))}
      {...props}
    >
      {children}
    </Comp>
  );
}
