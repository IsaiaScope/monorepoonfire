import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const TANSTACK = {
  QUERY_CLIENT: queryClient,
  QUERY_KEY: {
    GET_SKILLS: "get-skills",
    GET_WORK_EXPERIENCES: "get-work-experiences",
  },
};
