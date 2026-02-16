// =============================================================================
// TANSTACK QUERY CONFIGURATION - Query Client & Cache Key Management
// =============================================================================
// This file centralizes TanStack Query configuration and provides standardized
// query keys for consistent caching and invalidation across the application.
// TanStack Query manages server state, caching, background updates, and
// synchronization between server and client data.

import { QueryClient } from "@tanstack/react-query";

// Create a global QueryClient instance with default configuration
// This client manages all server state caching, background refetching,
// and data synchronization throughout the application lifecycle
const queryClient = new QueryClient();

// Export centralized TanStack Query configuration and constants
// This pattern ensures consistent query key naming and prevents typos
// that could lead to cache misses or unwanted cache behavior
export const TANSTACK = {
  // Global QueryClient instance used by the QueryClientProvider
  // This client handles all query caching, invalidation, and background updates
  QUERY_CLIENT: queryClient,

  // Standardized query keys for consistent cache management
  // Using string constants prevents typos and makes refactoring safer
  // Query keys are used for cache identification, invalidation, and prefetching
  QUERY_KEY: {
    // Curriculum URL query key - used for fetching CV download URL
    GET_CURRICULUM: "get-curriculum",

    // Skills data query key - used for fetching user's technical skills
    GET_SKILLS: "get-skills",

    // Work experience data query key - used for fetching employment history
    GET_WORK_EXPERIENCES: "get-work-experiences",

    // Projects data query key - used for fetching portfolio project information
    GET_PROJECTS: "get-projects",

    // Email sending mutation key - used for contact form submissions
    // Note: Mutations typically don't need keys, but this might be used for loading states
    SEND_EMAIL: "send-email",
  },
};
