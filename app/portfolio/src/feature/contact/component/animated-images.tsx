"use client";

import { Button } from "@package/shadcn";
import { UIImage } from "@package/ui";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type image = {
  src: string;
};

// 📝 NOTE: https://ui.aceternity.com/components/animated-images
export const AnimatedImages = ({
  images,
  autoplay = false,
}: {
  images: image[];
  autoplay?: boolean;
}) => {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  const handleNext = useCallback(() => {
    setActive(prev => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = () => {
    setActive(prev => (prev - 1 + images.length) % images.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, handleNext]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };
  return (
    <div className="mx-auto w-xs  lg:w-sm px-4 lg:py-20 antialiased md:w-md md:px-8 lg:px-12">
      <div className="relative flex flex-col items-center">
        <div className="relative h-80  lg:h-90 w-full">
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={image.src}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  z: -100,
                  rotate: randomRotateY(),
                }}
                animate={{
                  opacity: isActive(index) ? 1 : 0.7,
                  scale: isActive(index) ? 1 : 0.95,
                  z: isActive(index) ? 0 : -100,
                  rotate: isActive(index) ? 0 : randomRotateY(),
                  zIndex: isActive(index)
                    ? 40
                    : images.length + 2 - index,
                  y: isActive(index) ? [0, -80, 0] : 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  z: 100,
                  rotate: randomRotateY(),
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 origin-bottom"
              >
                <UIImage
                  src={image.src}
                  alt=""
                  width={500}
                  height={600}
                  draggable={false}
                  className="h-full w-full rounded-3xl object-cover object-top"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex gap-4 pt-8">
          <Button
            size="icon"
            variant="outline"
            onClick={handlePrev}
            className="rounded-full"
            aria-label={t("Previous Image")}
          >
            <ArrowBigLeft />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={handleNext}
            className="rounded-full"
            aria-label={t("Next Image")}
          >
            <ArrowBigRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnimatedImages;
