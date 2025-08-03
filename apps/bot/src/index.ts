import { config } from "~/libs/modules/config/config.js";
import { zoomBot } from "~/libs/modules/zoom/zoom-bot.js";

const init = async (): Promise<void> => {
	if (config.ENV.ZOOM.MEETING_ID) {
		await zoomBot.run();
	}
};

await init();
