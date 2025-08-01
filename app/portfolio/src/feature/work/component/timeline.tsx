/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
/**
 * Timeline Component for Work Experience Display
 *
 * This component creates an interactive timeline with:
 * - Individual work experience items that fade in when viewed
 * - A dynamic gradient line that grows to reach visible timeline dots
 * - Smooth animations for both item visibility and gradient progression
 */

import {
  motion,
  useInView,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { useGetWorkExperience } from "../api/use-work-experiences";

// Type definition for the timeline data structure
type TimelineEntry = NonNullable<ReturnType<typeof useGetWorkExperience>["data"]>;

// Props interface for individual timeline items
type TimelineItemProps = {
  item: TimelineEntry[0]; // Single work experience entry
  index: number; // Position in the timeline (used for tracking visibility)
  onVisibilityChange: ( // Callback to notify parent when item visibility changes
    index: number,
    isVisible: boolean,
    element: HTMLDivElement | null,
    dotElement: HTMLDivElement | null
  ) => void;
};

/**
 * Individual Timeline Item Component
 *
 * Renders a single work experience entry with:
 * - Visibility detection using Motion's useInView hook
 * - Fade-in animation when scrolled into view
 * - Timeline dot (circular indicator) with company/role information
 * - Responsive layout (different layouts for mobile/desktop)
 */
const TimelineItem = ({ item, index, onVisibilityChange }: TimelineItemProps) => {
  // Ref to track the main container element for visibility detection
  const ref = useRef<HTMLDivElement>(null);

  // Ref to track the timeline dot element for gradient positioning
  const dotRef = useRef<HTMLDivElement>(null);

  // Hook to detect when this item is visible in the viewport
  // margin: "0px 0px -20% 0px" means trigger when item is 20% from bottom of viewport
  const isInView = useInView(ref, {
    margin: "0px 0px -20% 0px",
  });

  // Effect to notify parent component when visibility changes
  // This allows the parent to track which items are visible for gradient calculation
  useEffect(() => {
    onVisibilityChange(index, isInView, ref.current, dotRef.current);
  }, [index, isInView, onVisibilityChange]);

  return (
    <motion.div
      ref={ref}
      className="flex justify-start pt-10 lg:pt-30 lg:gap-4 first:pt-0"
      // Initial state: invisible
      initial={{
        opacity: 0,
      }}
      // Animate to visible when scrolled into view
      whileInView={{
        opacity: 1,
      }}
      // Viewport settings for animation trigger
      viewport={{
        once: true, // Only animate once (don't re-animate when scrolling back)
        amount: 0.3, // Trigger when 30% of element is visible
      }}
      // Animation timing and easing
      transition={{
        duration: 0.6, // 600ms fade-in
        delay: 0.1, // 100ms delay for staggered effect
        ease: "easeOut", // Smooth deceleration
      }}
    >
      {/* Left side: Timeline dot and desktop title */}
      <div className="sticky ml-4 lg:ml-0 flex flex-col lg:flex-row z-10 items-center top-40 self-start max-w-sm lg:w-full">
        {/* Timeline dot - the circular indicator */}
        <div ref={dotRef} className="h-10 absolute w-10 rounded-full bg-secondary/80 flex items-center justify-center">
          {/* Inner dot with primary color */}
          <div className="h-4 w-4 rounded-full bg-primary border border-accent p-2" />
        </div>

        {/* Desktop-only title section (hidden on mobile with lg:block) */}
        <h3 className="hidden lg:block text-xl lg:pl-16 lg:text-2xl  overflow-hidden text-ellipsis">
          {/* Date range with muted color */}
          <span className="text-secondary-foreground/80">{`${item.startDate}/${item.endDate}`}</span>
          <br />
          {/* Company name */}
          <span>
            {item.company}
          </span>
          <br />
          {/* Job role with emphasis */}
          <span className="text-2xl font-LibreFranklin font-bold">
            {item.role}
          </span>
        </h3>
      </div>

      {/* Right side: Content area with job details */}
      <div className="relative pl-8 lg:pl-0 w-full">
        {/* Mobile-only title section (visible only on mobile with lg:hidden) */}
        <h3 className="lg:hidden text-xl lg:pl-16 lg:text-2xl  overflow-hidden text-ellipsis mb-2">
          {/* Date range - same content as desktop but in mobile layout */}
          <span className="text-secondary-foreground/80">{`${item.startDate}/${item.endDate}`}</span>
          <br />
          {/* Company name */}
          <span>
            {item.company}
          </span>
          <br />
          {/* Job role */}
          <span className="text-2xl font-LibreFranklin font-bold">
            {item.role}
          </span>
        </h3>

        {/* Short description - visible on all screen sizes */}
        <h4 className="block text-xl mb-4 text-left lg:font-bold ">
          {item.shortDescription}
        </h4>

        {/* Long description - visible only on desktop (hidden on mobile) */}
        <p className="hidden lg:block text-secondary-foreground text-lg">
          {item.longDescription}
        </p>
      </div>
    </motion.div>
  );
};

/**
 * Main Timeline Component
 *
 * Orchestrates the entire timeline display including:
 * - Rendering all timeline items
 * - Managing visibility state for gradient calculation
 * - Rendering the animated gradient line that grows to visible items
 * - Handling responsive layout and smooth animations
 */
export const Timeline = ({ data }: { data: TimelineEntry }) => {
  // Ref for the main timeline container (used for height calculation)
  const ref = useRef<HTMLDivElement>(null);

  // Ref for the outer container (currently used for structural purposes)
  const containerRef = useRef<HTMLDivElement>(null);

  // State to track the total height of the timeline for background gradient
  const [height, setHeight] = useState(0);

  // Set to track which timeline items are currently visible
  // Using Set for O(1) lookup performance when checking visibility
  const [visibleItems, setVisibleItems] = useState<Set<number>>(() => new Set());

  // Map to store references to timeline item DOM elements
  // Key: item index, Value: the item's DOM element
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Map to store references to timeline dot DOM elements
  // Key: item index, Value: the dot's DOM element (used for gradient positioning)
  const dotRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Effect to calculate and update the total height of the timeline
  // This is used to set the background gradient line height
  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref, data]); // Re-run when data changes (new timeline items added/removed)

  // Effect to reset visibility state when data changes (e.g., language change)
  // This prevents visual bugs from stale references and indices
  useEffect(() => {
    // Clear all visibility tracking when data changes
    setVisibleItems(new Set());
    // Clear all element references
    itemRefs.current.clear();
    dotRefs.current.clear();
  }, [data]); // Reset when timeline data changes

  /**
   * Callback function to handle visibility changes from timeline items
   *
   * This function is called by each TimelineItem when its visibility changes
   * It updates the visibility tracking state and stores element references
   * for gradient height calculation
   *
   * @param index - The index of the timeline item
   * @param isVisible - Whether the item is currently visible
   * @param element - Reference to the item's main DOM element
   * @param dotElement - Reference to the item's dot DOM element
   */
  const handleVisibilityChange = useCallback((
    index: number,
    isVisible: boolean,
    element: HTMLDivElement | null,
    dotElement: HTMLDivElement | null,
  ) => {
    setVisibleItems((prev) => {
      // Create a new Set to avoid mutating the previous state
      const newSet = new Set(prev);

      if (isVisible) {
        // Item became visible: add to visible set and store references
        newSet.add(index);
        if (element) {
          itemRefs.current.set(index, element);
        }
        if (dotElement) {
          dotRefs.current.set(index, dotElement);
        }
      }
      else {
        // Item became invisible: remove from visible set and clean up references
        newSet.delete(index);
        itemRefs.current.delete(index);
        dotRefs.current.delete(index);
      }
      return newSet;
    });
  }, []); // Empty dependency array - function never changes

  /**
   * Calculate the height for the animated gradient line
   *
   * This function determines how tall the gradient fill should be
   * based on the position of the furthest visible timeline item.
   * The gradient grows from 0 to reach the center of the last visible dot.
   *
   * @returns The height in pixels for the gradient fill
   */
  const calculateGradientHeight = () => {
    // If no items are visible, gradient should have zero height
    if (visibleItems.size === 0)
      return 0;

    // Find the index of the furthest down visible item
    // Math.max works on the visible item indices
    const maxVisibleIndex = Math.max(...Array.from(visibleItems));

    // Safety check: ensure the index is valid for current data
    if (maxVisibleIndex >= data.length) {
      return 0;
    }

    // Get the DOM element for the furthest visible item's dot
    const lastVisibleDot = dotRefs.current.get(maxVisibleIndex);

    // Safety check: ensure we have both the dot element and container
    if (!lastVisibleDot || !ref.current)
      return 0;

    // Calculate relative positioning between container and target dot
    const containerRect = ref.current.getBoundingClientRect();
    const dotRect = lastVisibleDot.getBoundingClientRect();

    // Position to reach the center of the timeline dot
    // (dotRect.height / 2) centers the gradient on the dot
    const relativePosition = dotRect.top - containerRect.top + (dotRect.height / 2);

    // Ensure we never return negative values (shouldn't happen, but safety first)
    return Math.max(0, relativePosition);
  };

  return (
    <div
      className="w-full"
      ref={containerRef}
      key={`timeline-${data.length}-${data[0]?.language || "default"}`} // Force re-render on data/language change
    >
      <div ref={ref} className="relative mx-auto">
        {/* Render all timeline items */}
        {data.map((item, index) => (
          <TimelineItem
            key={`${item.company}-${item.role}-${item.startDate}-${item.language}`} // Stable key based on content
            item={item}
            index={index}
            onVisibilityChange={handleVisibilityChange}
          />
        ))}

        {/* Background gradient line (the static gray line behind everything) */}
        <motion.div
          style={{
            height: `${height}px`, // Set to full timeline height
          }}
          className="absolute lg:left-5 left-4 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
          // Animation: fade in/out based on whether any items are visible
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: visibleItems.size > 0 ? 1 : 0,
          }}
          transition={{
            opacity: {
              duration: 0.6, // 600ms fade transition
              ease: "easeOut", // Smooth deceleration
            },
          }}
        >
          {/* Animated gradient fill (the colored line that grows) */}
          <motion.div
            className="absolute inset-x-0 top-0 w-[3px] bg-gradient-to-t from-primary via-lavender/50 to-transparent from-[0%] via-[10%] rounded-full"
            // Start with zero height
            initial={{
              height: 0,
            }}
            // Animate to calculated height based on visible items
            animate={{
              height: `${calculateGradientHeight()}px`,
            }}
            transition={{
              height: {
                duration: 0.8, // 800ms for smooth growth
                ease: "easeOut", // Smooth deceleration
                delay: 0.2, // 200ms delay after background appears
              },
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

// Export the Timeline component as the default export
// This allows importing with: import Timeline from './timeline'
export default Timeline;
