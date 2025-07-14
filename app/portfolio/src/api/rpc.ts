import honoClientWithType from "@app/hono/rpc";

import { env } from "../environment/env";

const honoClient = honoClientWithType(`${env.VITE_BASE_URL}`);

export default honoClient;
