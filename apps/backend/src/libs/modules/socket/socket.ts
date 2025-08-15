import { logger } from "../logger/logger.js";
import { BaseSocketService } from "./base-socket.module.js";

const socketService = new BaseSocketService(logger);

export { socketService };
export { type BaseSocketService } from "./base-socket.module.js";
