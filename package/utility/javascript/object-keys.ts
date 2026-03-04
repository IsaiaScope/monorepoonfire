import type { StringKeys } from "../@types";

export function ObjectKeys<T extends Record<string, unknown>>(obj: T): StringKeys<T>[] {
  return Object.keys(obj) as StringKeys<T>[];
}
