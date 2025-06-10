export const LANGUAGE = {
  "en-GB": "en-GB",
  "it-IT": "it-IT",
} as const;

export type Language = (typeof LANGUAGE)[keyof typeof LANGUAGE];
