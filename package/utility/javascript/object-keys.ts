import type { StringKeys } from "../@types";

// Wrapping the Object.keys function to ensure type safety
// This function returns an array of keys of the object, typed as (keyof T)
export function ObjectKeys<T extends Record<string, unknown>>(obj: T): StringKeys<T>[] {
  return Object.keys(obj) as StringKeys<T>[];
}
