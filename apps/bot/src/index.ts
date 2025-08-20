import { config } from "~/libs/modules/config/config.js";
import { zoomBot } from "~/libs/modules/zoom/zoom-bot.js";

const init = (): void => {
	if (config.ENV.ZOOM.MEETING_LINK) {
		zoomBot.run();
	}
};

init();
