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

type SourceConfig = {
  /** Source set for this media condition */
  srcset: string;
  /** Media query condition (e.g., "(width < 800px)" or "(prefers-color-scheme: dark)") */
  media?: string;
  /** MIME type for format-based selection (e.g., "image/webp", "image/avif") */
  type?: string;
  /** Pixel density descriptor (e.g., "1x", "2x") */
  sizes?: string;
};

const DEFAULT_SOURCES: SourceConfig[] = [];

type Props = {
  className?: string;
  /** Primary/fallback image source for the img element */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Array of source configurations for picture element */
  sources?: SourceConfig[];
  /** Callback when image fails to load */
  onError?: () => void;
  /** Callback when image successfully loads */
  onLoad?: () => void;
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "onError" | "onLoad"> &
VariantProps<typeof imageVariants>;

export default function UIImage({
  src,
  alt,
  sources = DEFAULT_SOURCES,
  onError,
  onLoad,
  className,
  ...props
}: Props) {
  const [state, setState] = useState({ isLoading: true, hasError: false });

  const handleLoad = () => {
    setState({ isLoading: false, hasError: false });
    onLoad?.();
  };

  const handleError = () => {
    setState({ isLoading: false, hasError: true });
    onError?.();
  };

  // If no sources provided, render simple img element
  if (sources.length === 0) {
    return (
      <img
        {...props}
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(imageVariants({ className }))}
        data-loading={state.isLoading}
        data-error={state.hasError}
      />
    );
  }

  // Render picture element with sources
  return (
    <picture>
      {sources.map((source, index) => {
        // Create a unique key based on source properties
        const key = `${source.srcset}-${index}`;
        return (
          <source
            key={key}
            srcSet={source.srcset}
            media={source.media}
            type={source.type}
            sizes={source.sizes}
          />
        );
      })}
      <img
        {...props}
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(imageVariants({ className }))}
        data-loading={state.isLoading}
        data-error={state.hasError}
      />
    </picture>
  );
}
