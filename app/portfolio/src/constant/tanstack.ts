import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const TANSTACK = {
  QUERY_CLIENT: queryClient,
  QUERY_KEY: {},
};
