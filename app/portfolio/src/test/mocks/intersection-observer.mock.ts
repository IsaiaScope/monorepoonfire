// =============================================================================
// INTERSECTION OBSERVER MOCK - Simulating Viewport Detection for Testing
// =============================================================================
// IntersectionObserver is a browser API that detects when elements enter
// or leave the viewport (visible area of the screen). It's commonly used for:
// - Lazy loading images when they come into view
// - Triggering animations when elements become visible
// - Infinite scrolling features
// - Performance optimizations (only render what's visible)

/**
 * Mock IntersectionObserver for testing viewport-based animations
 *
 * Why we need this mock:
 * 1. Test environments (like Node.js) don't have browser APIs
 * 2. Framer Motion uses IntersectionObserver for viewport animations
 * 3. Without this mock, tests would crash when components use viewport triggers
 *
 * What this mock does:
 * - Provides a "fake" IntersectionObserver that does nothing
 * - Prevents crashes when components try to use viewport detection
 * - Allows tests to run without actual viewport calculations
 *
 * Simple analogy: Like having a fake security camera that always says
 * "nothing to report" instead of actually watching for movement
 */

/**
 * Basic IntersectionObserver mock implementation
 *
 * This is a minimal implementation that satisfies the API requirements
 * without actually performing any intersection calculations.
 */
export class MockIntersectionObserver {
  // Configuration properties (set but not used in mock)
  root = null; // The viewport root element (usually null for browser viewport)
  rootMargin = ""; // Margin around the root (like "10px 20px")
  thresholds = []; // Array of visibility percentages that trigger callbacks

  /**
   * Constructor - normally would set up the observer configuration
   * In our mock, we just accept the parameters but don't use them
   */
  constructor(
    _callback?: IntersectionObserverCallback, // Function to call when intersections change
    _options?: IntersectionObserverInit, // Configuration options
  ) {
    // Mock constructor - accepts parameters but doesn't set up real observation
  }

  /**
   * disconnect() - normally stops observing all elements
   * In our mock, this does nothing since we're not actually observing
   */
  disconnect() {
    // Mock method - no actual cleanup needed since we're not observing anything
  }

  /**
   * observe() - normally starts watching an element for viewport changes
   * In our mock, this does nothing since we can't actually detect viewport changes
   */
  observe(_target: Element) {
    // Mock method - accepts element but doesn't actually observe it
  }

  /**
   * unobserve() - normally stops watching a specific element
   * In our mock, this does nothing since we weren't observing in the first place
   */
  unobserve(_target: Element) {
    // Mock method - accepts element but no actual cleanup needed
  }

  /**
   * takeRecords() - normally returns pending intersection records
   * In our mock, always returns empty array since no real observations happen
   */
  takeRecords(): IntersectionObserverEntry[] {
    return []; // Always return empty array - no observations to report
  }
}

/**
 * Setup the global IntersectionObserver mock
 *
 * This replaces the browser's real IntersectionObserver with our mock version
 * so that any code trying to use IntersectionObserver will get our safe mock instead.
 */
export function setupIntersectionObserverMock() {
  // Replace the global IntersectionObserver with our mock
  // This ensures all code using IntersectionObserver gets our mock instead
  globalThis.IntersectionObserver = MockIntersectionObserver;
}
