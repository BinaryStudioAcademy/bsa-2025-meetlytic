import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { ZoomBot } from "~/libs/modules/zoom/base-zoom-bot.js";

const zoomBot = new ZoomBot(config, logger);

export { zoomBot };
