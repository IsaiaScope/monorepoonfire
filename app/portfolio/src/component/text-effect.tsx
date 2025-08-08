/* eslint-disable react/no-array-index-key */
"use client";

// =============================================================================
// TEXT EFFECT COMPONENT - Advanced Text Animation System
// =============================================================================
// This component provides a flexible text animation system that can animate
// text character-by-character, word-by-word, or line-by-line using Framer Motion.
// It supports multiple animation presets and allows for extensive customization
// of animation timing, transitions, and visual effects.
//
// Key Features:
// - Multiple animation presets (blur, fade, scale, slide, etc.)
// - Granular animation control (per character, word, or line)
// - Custom animation variants and transitions
// - Staggered animation timing with customizable delays
// - Entrance and exit animations with AnimatePresence
// - Accessibility support with screen reader content
// =============================================================================

import type {
  TargetAndTransition,
  Transition,
  Variant,
  Variants,
} from "motion/react";

import { cn } from "@package/utility/tailwind";
import {
  AnimatePresence,
  motion,
} from "motion/react";
import React from "react";

// =============================================================================
// TYPE DEFINITIONS - Component Configuration and Animation Options
// =============================================================================

// Animation presets that define different visual effects
// Each preset combines container and item animation variants
export type PresetType = "blur" | "fade-in-blur" | "scale" | "fade" | "slide";

// Text segmentation options - determines how text is split for animation
// - "word": Animates each word individually (good for sentences)
// - "char": Animates each character individually (good for dramatic effect)
// - "line": Animates each line individually (good for multi-line text)
export type PerType = "word" | "char" | "line";

// Main component props with extensive customization options
export type TextEffectProps = {
  children: string; // The text content to animate
  per?: PerType; // How to segment the text for animation
  as?: keyof React.JSX.IntrinsicElements; // HTML tag to render (p, h1, span, etc.)
  variants?: {
    container?: Variants; // Custom container animation variants
    item?: Variants; // Custom item animation variants
  };
  className?: string; // CSS classes for styling
  preset?: PresetType; // Pre-built animation preset
  delay?: number; // Initial delay before animation starts
  speedReveal?: number; // Speed multiplier for stagger timing (higher = faster)
  speedSegment?: number; // Speed multiplier for individual segment duration
  trigger?: boolean; // Whether animation should play (useful for conditional animations)
  onAnimationComplete?: () => void; // Callback when animation finishes
  onAnimationStart?: () => void; // Callback when animation starts
  segmentWrapperClassName?: string; // Additional classes for segment wrappers
  containerTransition?: Transition; // Custom transition for container
  segmentTransition?: Transition; // Custom transition for individual segments
  style?: React.CSSProperties; // Inline styles
};

// =============================================================================
// ANIMATION TIMING CONSTANTS - Default Stagger Delays by Segmentation Type
// =============================================================================
// These values control the delay between each animated segment
// Smaller values = faster stagger, larger values = slower stagger
// Character animation needs shorter delays since there are more segments
// Line animation needs longer delays since lines contain more content
const defaultStaggerTimes: Record<PerType, number> = {
  char: 0.03, // 30ms between each character (fast for readability)
  word: 0.05, // 50ms between each word (natural reading pace)
  line: 0.1, // 100ms between each line (allows line comprehension)
};

// =============================================================================
// DEFAULT ANIMATION VARIANTS - Base Animation Behaviors
// =============================================================================

// Container variants control the parent element that wraps all text segments
// The container manages the staggered timing of child animations
const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Delay between animating each child segment
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1, // Animate in reverse order when exiting
    },
  },
};

// Item variants control individual text segments (characters, words, or lines)
// These are applied to each segment that gets animated
const defaultItemVariants: Variants = {
  hidden: { opacity: 0 }, // Start invisible
  visible: { opacity: 1 }, // Fade in to full visibility
  exit: { opacity: 0 }, // Fade out when exiting
};

// =============================================================================
// PRESET ANIMATION VARIANTS - Pre-built Animation Effects
// =============================================================================
// Each preset defines both container and item variants for complete animations
// Container variants are shared (defaultContainerVariants) since timing is consistent
// Item variants vary to create different visual effects

const presetVariants: Record<
  PresetType,
  { container: Variants; item: Variants }
> = {
  // Blur effect: Text starts blurry and becomes sharp
  "blur": {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(12px)" }, // Start blurred and invisible
      visible: { opacity: 1, filter: "blur(0px)" }, // Become visible and sharp
      exit: { opacity: 0, filter: "blur(12px)" }, // Exit with blur
    },
  },
  // Fade-in-blur: Combines vertical movement with blur effect
  "fade-in-blur": {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20, filter: "blur(12px)" }, // Start below, blurred
      visible: { opacity: 1, y: 0, filter: "blur(0px)" }, // Move up and sharpen
      exit: { opacity: 0, y: 20, filter: "blur(12px)" }, // Move down and blur
    },
  },
  // Scale effect: Text grows from nothing to full size
  "scale": {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0 }, // Start tiny and invisible
      visible: { opacity: 1, scale: 1 }, // Grow to normal size
      exit: { opacity: 0, scale: 0 }, // Shrink back to nothing
    },
  },
  // Fade effect: Simple opacity transition (same as default)
  "fade": {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },
  // Slide effect: Text slides up from below
  "slide": {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 }, // Start below and invisible
      visible: { opacity: 1, y: 0 }, // Slide up to position
      exit: { opacity: 0, y: 20 }, // Slide down when exiting
    },
  },
};

// =============================================================================
// ANIMATION COMPONENT - Renders Individual Text Segments with Animation
// =============================================================================
// This component handles the rendering of each text segment (character, word, or line)
// It applies the appropriate animation variants and handles different segmentation types
// Memoized to prevent unnecessary re-renders during staggered animations

const AnimationComponent: React.FC<{
  segment: string;
  variants: Variants;
  per: "line" | "word" | "char";
  segmentWrapperClassName?: string;
}> = React.memo(({ segment, variants, per, segmentWrapperClassName }) => {
  // Different rendering strategies based on segmentation type
  const content
    = per === "line"
      ? (
          // Line segments: Use block display for proper line breaks
          <motion.span variants={variants} className="block">
            {segment}
          </motion.span>
        )
      : per === "word"
        ? (
            // Word segments: Preserve whitespace, animate as inline-block
            <motion.span
              aria-hidden="true" // Hide from screen readers (main text is provided separately)
              variants={variants}
              className="inline-block whitespace-pre" // Preserve spaces between words
            >
              {segment}
            </motion.span>
          )
        : (
            // Character segments: Split word/space into individual characters
            <motion.span className="inline-block whitespace-pre">
              {segment.split("").map((char, charIndex) => (
                <motion.span
                  key={`char-${charIndex}`}
                  aria-hidden="true"
                  variants={variants}
                  className="inline-block whitespace-pre" // Each character maintains spacing
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
          );

  // Optional wrapper for additional styling control
  if (!segmentWrapperClassName) {
    return content;
  }

  // Apply wrapper with appropriate default display type
  const defaultWrapperClassName = per === "line" ? "block" : "inline-block";

  return (
    <span className={cn(defaultWrapperClassName, segmentWrapperClassName)}>
      {content}
    </span>
  );
});

AnimationComponent.displayName = "AnimationComponent";

// =============================================================================
// TEXT PROCESSING UTILITIES - Text Segmentation Logic
// =============================================================================

// Splits text into segments based on the specified segmentation type
// The segmentation strategy affects both animation timing and visual flow
const splitText = (text: string, per: PerType) => {
  if (per === "line")
    return text.split("\n"); // Split on newline characters for line-by-line animation
  return text.split(/(\s+)/); // Split on whitespace but preserve spaces in the array
  // This regex captures the delimiters, so spaces remain as separate segments
  // Result: "hello world" -> ["hello", " ", "world"]
};

// Type guard to check if a variant object contains transition properties
// Used to safely merge custom transitions with existing variant transitions
const hasTransition = (
  variant?: Variant,
): variant is TargetAndTransition & { transition?: Transition } => {
  if (!variant)
    return false;
  return (
    typeof variant === "object" && "transition" in variant
  );
};

// =============================================================================
// VARIANT MERGING UTILITY - Combines Base Variants with Custom Transitions
// =============================================================================
// This function merges custom transition objects with existing animation variants
// while preserving the original variant structure and adding new timing controls

const createVariantsWithTransition = (
  baseVariants: Variants,
  transition?: Transition & { exit?: Transition },
): Variants => {
  if (!transition)
    return baseVariants;

  // Extract exit transition separately since it needs special handling
  const { exit: _, ...mainTransition } = transition;

  return {
    ...baseVariants,
    visible: {
      ...baseVariants.visible,
      transition: {
        // Merge existing visible transition with new transition
        ...(hasTransition(baseVariants.visible)
          ? baseVariants.visible.transition
          : {}),
        ...mainTransition,
      },
    },
    exit: {
      ...baseVariants.exit,
      transition: {
        // Merge existing exit transition with new transition
        ...(hasTransition(baseVariants.exit)
          ? baseVariants.exit.transition
          : {}),
        ...mainTransition,
        staggerDirection: -1, // Always reverse stagger direction for exit animations
      },
    },
  };
};
// =============================================================================
// MAIN TEXT EFFECT COMPONENT - Orchestrates Text Animation System
// =============================================================================
// 📝 NOTE: Based on https://motion-primitives.com/docs/text-effect
// This is the main component that coordinates all the animation logic,
// text processing, and rendering to create smooth, customizable text animations

export function TextEffect({
  children,
  per = "word",
  as = "p",
  variants,
  className,
  preset = "fade",
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  trigger = true,
  onAnimationComplete,
  onAnimationStart,
  segmentWrapperClassName,
  containerTransition,
  segmentTransition,
  style,
}: TextEffectProps) {
  // =============================================================================
  // TEXT PROCESSING - Split text into animatable segments
  // =============================================================================
  const segments = splitText(children, per);

  // Create dynamic motion component based on the desired HTML element
  // This allows rendering as any HTML element (p, h1, div, etc.) with motion capabilities
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  // =============================================================================
  // ANIMATION VARIANT SELECTION - Choose base animation patterns
  // =============================================================================
  // Use preset variants if specified, otherwise fall back to basic defaults
  const baseVariants = preset
    ? presetVariants[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants };

  // =============================================================================
  // TIMING CALCULATIONS - Compute animation speeds and delays
  // =============================================================================
  // Calculate stagger delay between segments based on segmentation type and speed
  const stagger = defaultStaggerTimes[per] / speedReveal;

  // Calculate duration for individual segment animations
  const baseDuration = 0.3 / speedSegment;

  // Extract custom timing from user-provided variants (if any)
  // Check if custom container variants have stagger timing specified
  const customStagger = hasTransition(variants?.container?.visible ?? {})
    ? (variants?.container?.visible as TargetAndTransition).transition?.staggerChildren
    : undefined;

  // Check if custom container variants have delay timing specified
  // Check if custom container variants have delay timing specified
  const customDelay = hasTransition(variants?.container?.visible ?? {})
    ? (variants?.container?.visible as TargetAndTransition).transition?.delayChildren
    : undefined;

  // =============================================================================
  // VARIANT ASSEMBLY - Build final animation variants with custom timing
  // =============================================================================
  // Combine base variants with custom transitions and computed timing values
  // This creates the final animation configuration for both container and items
  const computedVariants = {
    // Container variants control the overall animation orchestration
    container: createVariantsWithTransition(
      variants?.container || baseVariants.container,
      {
        staggerChildren: customStagger ?? stagger, // Use custom stagger or computed default
        delayChildren: customDelay ?? delay, // Use custom delay or prop delay
        ...containerTransition, // Merge any additional container transition props
        exit: {
          staggerChildren: customStagger ?? stagger,
          staggerDirection: -1, // Always reverse stagger for exit animations
        },
      },
    ),
    // Item variants control individual segment animations
    item: createVariantsWithTransition(variants?.item || baseVariants.item, {
      duration: baseDuration, // Apply computed duration based on speedSegment
      ...segmentTransition, // Merge any additional segment transition props
    }),
  };

  // =============================================================================
  // COMPONENT RENDERING - Orchestrate the complete animation system
  // =============================================================================
  return (
    // AnimatePresence enables enter/exit animations when trigger changes
    // mode="wait" ensures smooth transitions by waiting for exit before enter
    <AnimatePresence mode="wait">
      {trigger && (
        <MotionTag
          key={children} // Key based on content triggers re-animation when text changes
          initial="hidden" // Start in hidden state
          animate="visible" // Animate to visible state
          exit="exit" // Use exit animation when leaving
          variants={computedVariants.container} // Apply container animation variants
          className={className}
          onAnimationComplete={onAnimationComplete}
          onAnimationStart={onAnimationStart}
          style={style}
        >
          {/* Accessibility: Provide complete text for screen readers */}
          {/* Only add screen reader text for word/char animations since they split content */}
          {per !== "line" ? <span className="sr-only">{children}</span> : null}

          {/* Render each text segment with its animation */}
          {segments.map((segment, index) => (
            <AnimationComponent
              key={`${per}-${index}-${segment}`} // Unique key per segment and type
              segment={segment}
              variants={computedVariants.item} // Apply item animation variants
              per={per}
              segmentWrapperClassName={segmentWrapperClassName}
            />
          ))}
        </MotionTag>
      )}
    </AnimatePresence>
  );
}
