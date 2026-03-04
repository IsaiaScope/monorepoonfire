import type { UseQueryOptions as TanstackUseQueryOptions } from "@tanstack/react-query";

import { useQuery } from "@tanstack/react-query";

import { APP_PORTFOLIO, DEFAULT_USE_QUERY_OPTIONS } from "../../../constant";
import { getCurriculum } from "./curriculum";

type UseQueryOptions = Omit<TanstackUseQueryOptions<Awaited<ReturnType<typeof getCurriculum>>, Error>, "queryFn" | "queryKey">;

export function useGetCurriculum(
  useQueryOptions?: UseQueryOptions,
) {
  return useQuery({
    queryKey: [
      APP_PORTFOLIO.TANSTACK.QUERY_KEY.GET_CURRICULUM,
    ],
    queryFn: getCurriculum,
    ...{ ...DEFAULT_USE_QUERY_OPTIONS, ...useQueryOptions },
  });
}
