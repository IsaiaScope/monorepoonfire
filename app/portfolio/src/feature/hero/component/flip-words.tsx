/* eslint-disable react/no-array-index-key */

import { cn } from "@package/utility/tailwind";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

/**
 * FlipWords Component
 *
 * A React component that creates an animated text effect where words flip/transition
 * between different options in a cyclic manner. Each word appears with a letter-by-letter
 * animation and exits with a blur and scale effect.
 *
 * Based on: https://ui.aceternity.com/components/flip-words
 *
 * @param props - Component props
 * @param props.words - Array of strings to cycle through
 * @param props.duration - Time in milliseconds between word transitions (default: 2000ms)
 * @param props.className - Optional CSS class names to apply to the component
 */
export default function FlipWords({
  words,
  duration = 2000,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
}) {
  // State to track the currently displayed word from the words array
  const [currentWord, setCurrentWord] = useState(words[0]);

  // State to track whether the component is currently animating a transition
  // Used to prevent multiple simultaneous transitions
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  /**
   * Handles the transition to the next word in the array
   * Cycles back to the first word when reaching the end of the array
   */
  const startAnimation = useCallback(() => {
    // Calculate the next word index, cycling back to 0 if at the end
    const word = words[words.indexOf(currentWord) + 1] || words[0];
    setCurrentWord(word);
    setIsAnimating(true);
  }, [currentWord, words]);

  /**
   * Effect to handle the timing of word transitions
   * Sets up a timeout to trigger the next animation after the specified duration
   */
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    // Only set timeout when not currently animating to avoid overlapping transitions
    if (!isAnimating) {
      timeoutId = setTimeout(() => {
        startAnimation();
      }, duration);
    }

    // Cleanup function to clear timeout on component unmount or dependency changes
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isAnimating, duration, startAnimation]);

  return (
    // AnimatePresence enables exit animations for components that are removed from the React tree
    <AnimatePresence
      onExitComplete={() => {
        // Reset animation state when exit animation completes
        setIsAnimating(false);
      }}
    >
      {/* Main container for the animated word with entry/exit animations */}
      <motion.div
        initial={{
          // Start with opacity 0 and slight downward offset
          opacity: 0,
          y: 10,
          position: "relative",
        }}
        animate={{
          // Animate to full opacity and original position
          opacity: 1,
          y: 0,
          position: "relative",
        }}
        transition={{
          // Use spring animation for smooth, natural movement
          type: "spring",
          stiffness: 100,
          damping: 10,
        }}
        exit={{
          // Exit animation: fade out, move up-right, blur, and scale up
          opacity: 0,
          y: -40,
          x: 40,
          filter: "blur(8px)",
          scale: 2,
          position: "absolute",
        }}
        className={cn(
          "z-10 inline-block relative text-center text-neutral-900 dark:text-neutral-100",
          className,
        )}
        key={currentWord} // Key ensures component re-mounts when word changes
      >
        {/* Split current word into individual words for staggered animation */}
        {currentWord.split(" ").map((word, wordIndex) => (
          <motion.span
            key={word + wordIndex}
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              // Stagger word animations by 0.3s each
              delay: wordIndex * 0.3,
              duration: 0.3,
            }}
            className="inline-block whitespace-nowrap"
          >
            {/* Split word into individual letters for letter-by-letter animation */}
            {word.split("").map((letter, letterIndex) => (
              <motion.span
                key={word + letterIndex}
                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  // Combine word delay with letter delay for cascading effect
                  delay: wordIndex * 0.3 + letterIndex * 0.05,
                  duration: 0.2,
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
