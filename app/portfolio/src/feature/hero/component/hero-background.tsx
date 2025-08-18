// Import motion utilities from framer-motion for scroll-based animations and transforms
import { motion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * HeroBackground Component
 *
 * Creates a parallax scrolling background effect with multiple layered images that move at different speeds
 * when the user scrolls. This creates a depth illusion and immersive visual experience.
 *
 * The component uses:
 * - useScroll: Tracks scroll progress as a value between 0 and 1
 * - useSpring: Adds smooth, spring-like animation to scroll progress
 * - useTransform: Maps scroll values to CSS transform properties for parallax movement
 * - motion.div: Framer Motion components that can be animated with transform values
 *
 * Z-index layering (back to front):
 * - z-14: Sky background (static, no parallax)
 * - z-13: Mountain 3 (furthest mountains, slowest movement)
 * - z-12: Planets (middle layer, horizontal movement)
 * - z-11: Mountain 2 (closer mountains, moderate movement)
 * - z-10: Mountain 1 (closest mountains, minimal movement)
 */
const HeroBackground = () => {
  // Track scroll progress from 0 (top) to 1 (bottom of scrollable content)
  const { scrollYProgress } = useScroll();

  // Apply spring physics to scroll progress for smoother, more natural movement
  // damping: 50 creates a moderate spring effect (higher = less bouncy, lower = more bouncy)
  const x = useSpring(scrollYProgress, { damping: 50 });

  // Transform scroll progress into vertical movement for the furthest mountain layer
  // Maps scroll progress from 0-0.5 to vertical position "0%" to "70%"
  // This creates the strongest parallax effect as it moves the most
  const mountain3Y = useTransform(x, [0, 0.5], ["0%", "70%"]);

  // Transform scroll progress into horizontal movement for planets
  // Maps scroll progress from 0-0.5 to horizontal position "0%" to "-20%"
  // Negative value moves planets to the left, creating lateral parallax
  const planetsX = useTransform(x, [0, 0.5], ["0%", "-20%"]);

  // Transform scroll progress into vertical movement for middle mountain layer
  // Maps scroll progress from 0-0.5 to vertical position "0%" to "30%"
  // Less movement than mountain3Y to create depth layering
  const mountain2Y = useTransform(x, [0, 0.5], ["0%", "30%"]);

  // Transform scroll progress for the closest mountain layer
  // Maps scroll progress from 0-0.5 to vertical position "0%" to "0%"
  // No movement creates the illusion that closest objects move least in parallax
  const mountain1Y = useTransform(x, [0, 0.5], ["0%", "0%"]);

  return (
    // Main container section with absolute positioning to fill the hero area
    <section className="absolute inset-0">
      {/*
        Inner container with relative positioning for proper stacking context
        - overflow-y-hidden: Prevents vertical scrollbars within the hero
        - bg-clip-border: Ensures background clips to border edges
      */}
      <div className="relative w-full h-full overflow-y-hidden bg-clip-border">

        {/*
          SKY BACKGROUND LAYER (Static)
          - Positioned at the back with z-index -14
          - No motion component as it remains fixed during scroll
          - backgroundPosition: "bottom" aligns image to bottom of container
          - backgroundSize: "cover" ensures image covers entire area without distortion
        */}
        <div
          className="absolute inset-0 -z-14"
          style={{
            backgroundImage: "url(/assets/sky.webp)",
            backgroundPosition: "bottom",
            backgroundSize: "cover",
          }}
        />

        {/*
          MOUNTAIN 3 LAYER (Furthest Mountains)
          - Uses motion.div for scroll-based animation
          - Z-index -13 places it in front of sky but behind other mountains
          - Animated with mountain3Y transform for strongest parallax effect
          - Moves vertically from 0% to 70% as user scrolls
        */}
        <motion.div
          className="absolute inset-0 -z-13"
          style={{
            backgroundImage: "url(/assets/mountain-3.webp)",
            backgroundPosition: "bottom",
            backgroundSize: "cover",
            y: mountain3Y, // Framer Motion's y transform property
          }}
        />

        {/*
          PLANETS LAYER (Middle Layer)
          - Z-index -12 places it in front of mountains but behind closer elements
          - Animated with planetsX transform for horizontal parallax movement
          - Moves horizontally from 0% to -20% (leftward) as user scrolls
          - Creates unique lateral movement different from vertical mountain parallax
        */}
        <motion.div
          className="absolute inset-0 -z-12"
          style={{
            backgroundImage: "url(/assets/planets.webp)",
            backgroundPosition: "bottom",
            backgroundSize: "cover",
            x: planetsX, // Framer Motion's x transform property
          }}
        />

        {/*
          MOUNTAIN 2 LAYER (Middle Mountains)
          - Z-index -11 places it closer to viewer than previous layers
          - Animated with mountain2Y transform for moderate parallax effect
          - Moves vertically from 0% to 30% as user scrolls
          - Less movement than mountain3Y to create proper depth perception
        */}
        <motion.div
          className="absolute inset-0 -z-11"
          style={{
            backgroundImage: "url(/assets/mountain-2.webp)",
            backgroundPosition: "bottom",
            backgroundSize: "cover",
            y: mountain2Y, // Framer Motion's y transform property
          }}
        />

        {/*
          MOUNTAIN 1 LAYER (Closest Mountains)
          - Z-index -10 places it closest to viewer (highest z-index of background layers)
          - Animated with mountain1Y transform but with no actual movement (0% to 0%)
          - This creates the realistic parallax effect where closest objects appear to move least
          - Acts as the "anchor" layer that other layers move relative to
        */}
        <motion.div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: "url(/assets/mountain-1.webp)",
            backgroundPosition: "bottom",
            backgroundSize: "cover",
            y: mountain1Y, // Framer Motion's y transform property (no movement)
          }}
        />

        {/*
          GRADIENT OVERLAY (Top Layer)
          - Z-index -9 places it on top of all background layers
          - Creates a subtle gradient effect to enhance visual depth
          - Opacity set to x% for a semi-transparent overlay
        */}
        <div
          className="absolute inset-0 -z-9  bg-gray-950/50"

        />

      </div>
    </section>
  );
};

/**
 * Export the HeroBackground component as default
 *
 * This component creates a sophisticated parallax scrolling effect with:
 * 1. Multiple layered background images
 * 2. Different scroll speeds for each layer to create depth
 * 3. Smooth spring-based animations
 * 4. Proper z-index stacking for realistic layering
 * 5. Responsive design that works across all screen sizes
 *
 * Usage:
 * - Place within a hero section container
 * - Ensure proper positioning context (relative/absolute parent)
 * - Images should be optimized for web performance
 * - Works best with scroll-based page layouts
 */
export default HeroBackground;
