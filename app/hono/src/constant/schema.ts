import * as HttpStatusPhases from "stoker/http-status-phrases";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhases.NOT_FOUND);
