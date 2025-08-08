import type { VariantProps } from "class-variance-authority";

import { cn } from "@package/utility/tailwind";
import { cva } from "class-variance-authority";

const dotsContainerVariantsProp = cva("z-100 bg-background", {
  variants: {
    variant: {
      default: "absolute inset-0 flex items-center justify-center gap-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const dotVariantsProp = cva("bg-primary", {
  variants: {
    variant: {
      pulse: "animate-pulse rounded-full",
    },
    size: {
      default: "w-8 h-8",
    },
  },
  defaultVariants: {
    variant: "pulse",
    size: "default",
  },
});

type Props = {
  dotProps?: VariantProps<typeof dotVariantsProp> & {
    className?: string;
  } & React.HTMLAttributes<HTMLDivElement>;
  dotsContainerProps?: VariantProps<typeof dotsContainerVariantsProp> & {
    className?: string;
  } & React.HTMLAttributes<HTMLDivElement>;
  dotsCount?: 3 | 4 | 5;
  srLabel?: string;
};

const defaultDotsContainerProps = {};
const defaultDotProps = {};

export default function UIFullPageDotsLoaderOnFire({
  dotsContainerProps = defaultDotsContainerProps,
  dotProps = defaultDotProps,
  dotsCount = 3,
  srLabel = "loading",
}: Props) {
  const {
    variant: dotsContainerVariant,
    className: dotsContainerClassName,
    ...restOfDotsContainerProps
  } = dotsContainerProps;

  const {
    variant: dotVariant,
    className: dotClassName,
    size: dotSize,
    ...restOfDotsProps
  } = dotProps;

  return (
    <div
      className={cn(
        dotsContainerVariantsProp({
          variant: dotsContainerVariant,
          className: dotsContainerClassName,
        }),
      )}
      {...restOfDotsContainerProps}
    >
      {Array.from({ length: dotsCount }).map((_, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className={cn(
            dotVariantsProp({
              variant: dotVariant,
              size: dotSize,
              className: dotClassName,
            }),
          )}
          data-testid="dot"
          {...restOfDotsProps}
        >
        </div>
      ))}
      <span className="sr-only">{srLabel}</span>
    </div>
  );
}
