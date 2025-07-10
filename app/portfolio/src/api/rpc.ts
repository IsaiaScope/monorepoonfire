import { APP_HONO } from "@app/hono/constant";
import honoClientWithType from "@app/hono/rpc";

const honoClient = honoClientWithType(`http://localhost:${APP_HONO.PORT}`);

export default honoClient;
