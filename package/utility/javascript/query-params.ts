import type { Maybe } from "../@types";

import { ObjectKeys } from "./object-keys";

export function createParamsArray(
  params: Maybe<Record<string, string | number>>,
) {
  if (!params) {
    return [];
  }

  if (ObjectKeys(params).length === 0) {
    return [];
  }

  const paramsArray = ObjectKeys(params).map((key) => {
    return `${key}=${params[key]}`;
  });
  return paramsArray;
}
