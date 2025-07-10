import type { UseQueryOptions as TanstackUseQueryOptions } from "@tanstack/react-query";

import { useQuery } from "@tanstack/react-query";

import { APP_PORTFOLIO } from "../../../constant";
import { getSkills } from "./skills";

type UseQueryOptions = Omit<TanstackUseQueryOptions<Awaited<ReturnType<typeof getSkills>>, Error>, "queryFn" | "queryKey">;

const DEFAULT_USE_QUERY_OPTIONS: UseQueryOptions = {
  staleTime: Infinity,
  refetchInterval: false,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchIntervalInBackground: false,
};

export function useGetSkills(
  useQueryOptions?: UseQueryOptions,
) {
  return useQuery({
    queryKey: [
      APP_PORTFOLIO.TANSTACK.QUERY_KEY.GET_SKILLS,
    ],
    queryFn: getSkills,
    ...{ ...DEFAULT_USE_QUERY_OPTIONS, ...useQueryOptions },
  });
}
