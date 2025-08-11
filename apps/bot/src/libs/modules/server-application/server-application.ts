import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { socketService } from "~/libs/modules/socket/socket.js";
import { zoomBot } from "~/libs/modules/zoom/zoom-bot.js";

import { BaseServerApplication } from "./base-server-application.js";

const serverApplication = new BaseServerApplication({
	config,
	logger,
	socketService,
	zoomBot,
});

export { serverApplication };
