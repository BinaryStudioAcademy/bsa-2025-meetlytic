import { config } from "~/libs/modules/config/config.js";

import { BaseSocket } from "./base-socket.module.js";

const { PROXY_SERVER_URL } = config.ENV.API;

const socketClient = new BaseSocket(String(PROXY_SERVER_URL));

export { socketClient };
