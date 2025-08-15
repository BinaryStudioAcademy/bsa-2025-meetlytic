import { convertHttpToWs } from "~/libs/helpers/helpers.js";

import { config } from "../config/config.js";
import { BaseSocketClient } from "./base-socket.module.js";

const { ORIGIN } = config.ENV.APP;

const socketClient = new BaseSocketClient(convertHttpToWs(ORIGIN));

export { socketClient };
export { type BaseSocketClient } from "./base-socket.module.js";
