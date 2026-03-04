import type { UseQueryOptions as TanstackUseQueryOptions } from "@tanstack/react-query";

import { useQuery } from "@tanstack/react-query";

import { APP_PORTFOLIO, DEFAULT_USE_QUERY_OPTIONS } from "../../../constant";
import { getWorkExperience } from "./work-experiences";

type UseQueryOptions = Omit<TanstackUseQueryOptions<Awaited<ReturnType<typeof getWorkExperience>>, Error>, "queryFn" | "queryKey">;

export function useGetWorkExperience(
  useQueryOptions?: UseQueryOptions,
) {
  return useQuery({
    queryKey: [
      APP_PORTFOLIO.TANSTACK.QUERY_KEY.GET_WORK_EXPERIENCES,
    ],
    queryFn: getWorkExperience,
    ...{ ...DEFAULT_USE_QUERY_OPTIONS, ...useQueryOptions },
  });
}
