import { motion } from "motion/react";
import { useMemo, useState } from "react";

/* React
TypeScript
JavaScript
AWS
Angular
CSS3
SCSS
Redux
NextJS
VS Code",
Google Drive */

/**
 * Props interface for the Skill component
 */
type Props = {
  /** The skill name/text to display (e.g., "React", "TypeScript") */
  text: string;
  /** Reference to the container element that constrains the draggable area */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Zero-based index of this skill in the skills array */
  index: number;
  /** Total number of skills being rendered */
  total: number;
};

/**
 * List of available skills with their corresponding SVG icons
 * Icons should be placed in the assets folder with lowercase, hyphenated names
 * Examples:
 * - "React" → assets/react.svg
 * - "VS Code" → assets/vs-code.svg
 * - "Google Drive" → assets/google-drive.svg
 */

/**
 * Skill Component - Renders an individual draggable skill badge
 *
 * This component creates a draggable skill badge with:
 * - Grid-based positioning with controlled randomness
 * - Optional skill icon (SVG)
 * - Hover animations and drag interactions
 * - Automatic fallback when icon is missing
 *
 * The positioning algorithm distributes skills across the container using a grid pattern
 * with randomized offsets to create an organic, non-rigid appearance while ensuring
 * even distribution across the available space.
 *
 * @param props - Component props
 * @returns JSX element representing a draggable skill badge
 */

const Skill = ({ text, containerRef, index, total }: Props) => {
  // Track whether the skill icon exists and should be displayed
  const [imageExists, setImageExists] = useState(true);

  /**
   * Calculate positioning and styling for the skill badge
   * Uses a grid-based algorithm with randomized offsets for natural distribution
   *
   * Algorithm breakdown:
   * 1. Calculate grid dimensions based on total number of skills
   * 2. Determine this skill's position within the grid
   * 3. Convert grid position to percentage-based coordinates
   * 4. Add random offsets to avoid rigid grid appearance
   * 5. Apply rotation for visual variety
   * 6. Ensure positions stay within container bounds
   */
  const randomStyle = useMemo(() => {
    // Create a more evenly distributed grid-like pattern with some randomness

    // Calculate grid dimensions - aim for roughly square grid
    const cols = Math.ceil(Math.sqrt(total)); // Number of columns
    const rows = Math.ceil(total / cols); // Number of rows

    // Determine this skill's position in the grid
    const col = index % cols; // Column index (0 to cols-1)
    const row = Math.floor(index / cols); // Row index (0 to rows-1)

    // Calculate base positions with even distribution across container
    const baseLeft = (col / (cols - 1 || 1)) * 65; // 0% to 65% horizontal
    const baseTop = (row / (rows - 1 || 1)) * 70; // 0% to 70% vertical

    // Add controlled randomness to avoid perfect grid appearance
    const randomOffsetX = (Math.random() - 0.5) * 15; // ±7.5% horizontal offset
    const randomOffsetY = (Math.random() - 0.5) * 15; // ±7.5% vertical offset

    return {
      // Random rotation between -30 and +30 degrees
      rotate: `${(Math.random() - 0.5) * 60}deg`,
      // Vertical position with bounds checking (0% to 80%)
      top: `${Math.max(0, Math.min(80, baseTop + randomOffsetY))}%`,
      // Horizontal position with bounds checking (0% to 85%)
      left: `${Math.max(0, Math.min(85, baseLeft + randomOffsetX))}%`,
    };
  }, [index, total]); // Recalculate when index or total changes

  // Early return if container reference is not available
  if (!containerRef || !containerRef.current)
    return null;

  return (
    <motion.div
      // Styling: Dark badge with light text, rounded corners, and subtle ring border
      className="flex items-center absolute py-2 px-3 text-[#f3f4f6] bg-[#262626]/90 text-xl text-center rounded-md cursor-grab m-2 ring-1 ring-[#f3f4f6] "
      // Apply calculated positioning and rotation
      style={randomStyle}

      // Framer Motion animations
      whileHover={{ scale: 1.05 }} // Slight scale increase on hover
      drag // Enable dragging
      dragConstraints={containerRef} // Constrain dragging to container bounds
      dragElastic={1} // Elastic drag behavior at boundaries
    >
      {/* Skill icon - only render if image exists */}
      {imageExists && (
        <img
          // Icon path: converts skill name to lowercase with hyphens
          // Example: "VS Code" → "assets/vs-code.svg"
          src={`assets/${text.toLowerCase().replaceAll(" ", "-")}.svg`}
          alt="" // Decorative image, no alt text needed
          tabIndex={-1} // Remove from tab order
          className="duration-200 rounded-sm hover:scale-110 w-7 mr-2 pointer-events-none"
          loading="lazy" // Lazy load the image
          // Hide icon if it fails to load
          onError={() => setImageExists(false)}
        />
      )}
      {/* Skill name text */}
      {text}
    </motion.div>
  );
};

/**
 * Export the Skill component as default
 *
 * Usage example:
 * ```tsx
 * const skills = ["React", "TypeScript", "JavaScript"];
 * const containerRef = useRef<HTMLDivElement>(null);
 *
 * return (
 *   <div ref={containerRef} className="relative w-full h-96">
 *     {skills.map((skill, index) => (
 *       <Skill
 *         key={skill}
 *         text={skill}
 *         containerRef={containerRef}
 *         index={index}
 *         total={skills.length}
 *       />
 *     ))}
 *   </div>
 * );
 * ```
 *
 * Requirements:
 * - Container must have relative positioning
 * - SVG icons should be placed in assets/ folder with lowercase, hyphenated names
 * - Container should have defined dimensions for proper constraint behavior
 */
export default Skill;
