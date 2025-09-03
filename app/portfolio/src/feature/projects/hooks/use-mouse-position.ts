import { useCallback, useRef, useState } from "react";

type MousePosition = {
  x: number;
  y: number;
};

/**
 * Custom hook for tracking mouse position with throttling
 * Returns the current mouse position and a throttled mouse move handler
 */
export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Cancel previous frame if it hasn't executed yet
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    // Schedule update for next frame
    frameRef.current = requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      frameRef.current = null;
    });
  }, []);

  return { mousePosition, handleMouseMove };
};
