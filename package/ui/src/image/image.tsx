import type { VariantProps } from "class-variance-authority";

import { cn } from "@package/utility/tailwind";
import { cva } from "class-variance-authority";
import { useState } from "react";

const imageVariants = cva("", {
  variants: {
    variant: {
      default: "",
      link: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type Props = {
  className?: string;
  fallbackSrc?: string; // Fallback image URL
} & React.ImgHTMLAttributes<HTMLImageElement> &
VariantProps<typeof imageVariants>;

export default function UIImage({
  src,
  fallbackSrc,
  className,
  ...props
}: Props) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);

  const handleError = () => {
    if (fallbackSrc && !hasErrored) {
      setImgSrc(fallbackSrc);
      setHasErrored(true);
    }
  };

  // Reset error state when src changes
  const currentSrc = hasErrored ? imgSrc : src;

  return (
    <img
      {...props}
      loading="lazy"
      src={currentSrc}
      onError={handleError}
      className={cn(imageVariants({ className }))}
    />
  );
}
