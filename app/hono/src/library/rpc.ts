import { hc } from "hono/client";

import type { Routes } from "../app";

const _honoClient = hc<Routes>("");
type HonoClient = typeof _honoClient;

const honoClientWithType = (...args: Parameters<typeof hc>): HonoClient => hc<Routes>(...args);

export default honoClientWithType;
