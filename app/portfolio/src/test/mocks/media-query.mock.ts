// =============================================================================
// MEDIA QUERY MOCKS - Responsive Design Testing
// =============================================================================

// Mock function for react-responsive's useMediaQuery hook
// Mobile-first approach: Default returns false (mobile doesn't match min-width queries)
export const mockUseMediaQuery = vi.fn(() => false);

// Mock the react-responsive module used for responsive design
vi.mock("react-responsive", () => ({
  useMediaQuery: mockUseMediaQuery, // Replace real hook with our mock
}));

// Helper function to configure media query responses based on viewport
export const setViewport = (viewport: "mobile" | "tablet" | "desktop") => {
  // MOBILE-FIRST: Configure media query responses based on viewport
  // Mobile-first approach: media queries check for min-width, so larger viewports match
  //
  // Breakpoint behavior:
  // Mobile (default): isBiggerThanMedium=false, isBiggerThanLarge=false
  // Tablet (768px+): isBiggerThanMedium=true, isBiggerThanLarge=false
  // Desktop (1024px+): isBiggerThanMedium=true, isBiggerThanLarge=true
  //
  // Example component usage:
  // - Navbar uses isBiggerThanLarge (1024px+) to switch desktop/mobile layouts
  // - Projects uses isBiggerThanMedium (768px+) for modal vs external link behavior
  // - Footer uses CSS-only responsiveness (lg:block = 1024px+) without JS media queries
  mockUseMediaQuery.mockImplementation((query?: { minWidth?: number; query?: string }) => {
    // Handle string-based CSS media queries like "(hover: hover)"
    if (query?.query === "(hover: hover)") {
      // Only desktop and tablet devices typically support hover
      // Mobile devices (touchscreen) generally don't support hover
      return viewport !== "mobile";
    }

    // Handle minWidth-based responsive breakpoint queries
    if (!query || typeof query.minWidth !== "number") {
      return false; // Default behavior for invalid queries
    }

    const minWidth = query.minWidth;

    if (viewport === "mobile") {
      return false; // Mobile doesn't match any min-width breakpoints
    }
    else if (viewport === "tablet") {
      return minWidth <= 768; // Tablet matches md (768px) but not lg (1024px)
    }
    else if (viewport === "desktop") {
      return minWidth <= 1024; // Desktop matches both md (768px) and lg (1024px)
    }

    return false; // Fallback to mobile behavior
  });
};
