/* eslint-disable react-web-api/no-leaked-timeout */
/* eslint-disable react-hooks/exhaustive-deps */

import type { COBEOptions } from "cobe";

import { cn } from "@package/utility/tailwind";
import createGlobe from "cobe";
import { useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

const MOVEMENT_DAMPING = 1400;

const GLOBE_CONFIG: COBEOptions = {
  width: 500, // Further reduced from 600
  height: 500, // Further reduced from 600
  onRender: () => {},
  devicePixelRatio: 1, // Adjusted to 1 to ensure full visibility at low pixel ratios
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 0.4,
  mapSamples: 4000, // Reduced from 8000 (50% further reduction)
  mapBrightness: 1.2,
  scale: 1,
  opacity: 0.5,
  baseColor: [1, 1, 1],
  markerColor: [59 / 255, 130 / 255, 246 / 255],
  glowColor: [0.4, 0.4, 0.4],
  markers: [
    { location: [34.6937, 135.5023], size: 0.10 }, // Osaka, Japan
    { location: [43.6532, -79.3832], size: 0.10 }, // Toronto, Canada
    { location: [33.7490, -84.3880], size: 0.10 }, // Atlanta, USA
    { location: [45.4642, 9.1900], size: 0.10 }, // Milan, Italy
    { location: [51.7592, 19.4560], size: 0.10 }, // Lodz, Poland
    { location: [52.5200, 13.4050], size: 0.10 }, // Berlin, Germany
    { location: [51.5074, -0.1278], size: 0.10 }, // London, England
    { location: [-33.8688, 151.2093], size: 0.10 }, // Sydney, Australia
    { location: [41.3851, 2.1734], size: 0.10 }, // Barcelona, Spain
    { location: [38.9067, 1.4206], size: 0.10 }, // Ibiza, Spain
  ],
};

// 📝 NOTE: https://magicui.design/docs/components/globe
export default function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  let phi = 0;
  let width = 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 50, // Increased damping for less bouncy physics
    stiffness: 70, // Reduced stiffness for smoother motion
  });

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width,
      height: width,
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phi += 0.001; // Reduced from 0.003 - 70% slower rotation
        }
        state.phi = phi + rs.get();
        state.width = width;
        state.height = width;
      },
    });

    setTimeout(() => (canvasRef.current!.style.opacity = "1"), 0);
    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [rs, config]);

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-[500px] translate-y-6 translate-x-1/12 lg:translate-x-3/12",
        className,
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]",
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={e => updateMovement(e.clientX)}
        onTouchMove={e =>
          e.touches[0] && updateMovement(e.touches[0].clientX)}
      />
    </div>
  );
}
