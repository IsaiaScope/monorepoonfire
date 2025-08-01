import type { UseMutationOptions as TanstackUseMutationOptions } from "@tanstack/react-query";

import emailjs from "@emailjs/browser";
import { useMutation } from "@tanstack/react-query";

import { APP_PORTFOLIO } from "../../../constant";

type EmailParams = Parameters<typeof emailjs.send>;

type UseMutationOptions = Omit<TanstackUseMutationOptions<Awaited<ReturnType<typeof emailjs.send>>, Error, EmailParams>, "mutationFn" | "mutationKey">;

const DEFAULT_USE_MUTATION_OPTIONS: UseMutationOptions = {
};
export function useSendEmail(
  useMutationOptions?: UseMutationOptions,
) {
  return useMutation({
    mutationKey: [APP_PORTFOLIO.TANSTACK.QUERY_KEY.SEND_EMAIL],
    mutationFn: (params: EmailParams) => emailjs.send(...params),
    ...{ ...DEFAULT_USE_MUTATION_OPTIONS, ...useMutationOptions },
  });
}
