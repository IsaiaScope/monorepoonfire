import type { StringKeys } from "@package/utility/@types";

export const LANGUAGE = {
  "en-GB": "en-GB",
  "it-IT": "it-IT",
} as const;

export type Language = StringKeys<typeof LANGUAGE>;
