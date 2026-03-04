import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const DEFAULT_USE_QUERY_OPTIONS = {
  staleTime: Infinity,
  refetchInterval: false,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchIntervalInBackground: false,
} as const;

export const TANSTACK = {
  QUERY_CLIENT: queryClient,
  QUERY_KEY: {
    GET_CURRICULUM: "get-curriculum",
    GET_SKILLS: "get-skills",
    GET_WORK_EXPERIENCES: "get-work-experiences",
    GET_PROJECTS: "get-projects",
    SEND_EMAIL: "send-email",
  },
};
