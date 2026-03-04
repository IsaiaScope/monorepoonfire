import type { UseQueryOptions as TanstackUseQueryOptions } from "@tanstack/react-query";

import { useQuery } from "@tanstack/react-query";

import { APP_PORTFOLIO, DEFAULT_USE_QUERY_OPTIONS } from "../../../constant";
import { getSkills } from "./skills";

type UseQueryOptions = Omit<TanstackUseQueryOptions<Awaited<ReturnType<typeof getSkills>>, Error>, "queryFn" | "queryKey">;

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
