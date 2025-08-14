import { config } from "../config/config.js";
import { BaseSocketClient } from "./base-socket.module.js";

const { HOST, PORT } = config.ENV.APP;

const url = `ws://${HOST}:${String(PORT)}`;

const socketClient = new BaseSocketClient(url);

export { socketClient };
export { type BaseSocketClient } from "./base-socket.module.js";
