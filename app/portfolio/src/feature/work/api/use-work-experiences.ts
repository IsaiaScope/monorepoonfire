import type { UseQueryOptions as TanstackUseQueryOptions } from "@tanstack/react-query";

import { useQuery } from "@tanstack/react-query";

import { APP_PORTFOLIO } from "../../../constant";
import { getWorkExperience } from "./work-experiences";

type UseQueryOptions = Omit<TanstackUseQueryOptions<Awaited<ReturnType<typeof getWorkExperience>>, Error>, "queryFn" | "queryKey">;

const DEFAULT_USE_QUERY_OPTIONS: UseQueryOptions = {
  staleTime: Infinity,
  refetchInterval: false,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchIntervalInBackground: false,
};

export function useGetWorkExperience(
  useQueryOptions?: UseQueryOptions,
) {
  return useQuery({
    queryKey: [
      APP_PORTFOLIO.TANSTACK.QUERY_KEY.GET_SKILLS,
    ],
    queryFn: getWorkExperience,
    ...{ ...DEFAULT_USE_QUERY_OPTIONS, ...useQueryOptions },
  });
}
