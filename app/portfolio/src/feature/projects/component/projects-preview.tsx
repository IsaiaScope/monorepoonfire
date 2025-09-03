import { motion, useMotionValue, useSpring } from "motion/react";
import { memo, useCallback, useEffect, useRef } from "react";

type ProjectsPreviewProps = {
  preview: string | null;
  mousePosition: { x: number; y: number };
};

// Separate component for the preview image to isolate motion updates
const ProjectsPreview = memo(({ preview, mousePosition }: ProjectsPreviewProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 30, stiffness: 80, restSpeed: 2 });
  const springY = useSpring(y, { damping: 30, stiffness: 80, restSpeed: 2 });

  // Track if we need to update position
  const lastPosition = useRef({ x: 0, y: 0 });

  // Update motion values when mouse position changes
  const updatePosition = useCallback(() => {
    if (
      mousePosition.x !== lastPosition.current.x
      || mousePosition.y !== lastPosition.current.y
    ) {
      lastPosition.current = mousePosition;
      requestAnimationFrame(() => {
        x.set(mousePosition.x + 20);
        y.set(mousePosition.y + 20);
      });
    }
  }, [mousePosition, x, y]);

  // Update position when mousePosition changes
  useEffect(() => {
    updatePosition();
  }, [updatePosition]);

  // Show preview if image exists, regardless of cache status for immediate feedback
  if (!preview) {
    return null;
  }

  return (
    <motion.img
      key={preview} // Force re-mount when image changes for better cache handling
      className="fixed top-0 left-0 z-[9999] object-cover h-56 rounded-lg shadow-2xl pointer-events-none w-80 will-change-transform"
      src={preview}
      style={{
        x: springX,
        y: springY,
        transform: "translate3d(0, 0, 0)",
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        duration: 0.15,
        ease: "easeOut",
      }}
      // Force eager loading and prevent lazy loading
      loading="eager"
      decoding="async"
      // Add crossorigin for better caching compatibility
      crossOrigin="anonymous"
    />
  );
});

ProjectsPreview.displayName = "ProjectsPreview";

export default ProjectsPreview;
