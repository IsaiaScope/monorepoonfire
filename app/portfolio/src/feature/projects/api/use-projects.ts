import type { UseQueryOptions as TanstackUseQueryOptions } from "@tanstack/react-query";

import { useQuery } from "@tanstack/react-query";

import { APP_PORTFOLIO, DEFAULT_USE_QUERY_OPTIONS } from "../../../constant";
import { getProjects } from "./projects";

type UseQueryOptions = Omit<TanstackUseQueryOptions<Awaited<ReturnType<typeof getProjects>>, Error>, "queryFn" | "queryKey">;

export function useGetProjects(
  useQueryOptions?: UseQueryOptions,
) {
  return useQuery({
    queryKey: [
      APP_PORTFOLIO.TANSTACK.QUERY_KEY.GET_PROJECTS,
    ],
    queryFn: getProjects,
    ...{ ...DEFAULT_USE_QUERY_OPTIONS, ...useQueryOptions },
  });
}
