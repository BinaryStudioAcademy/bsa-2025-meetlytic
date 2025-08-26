import { config } from "~/libs/modules/config/config.js";
import { logCpuMemoryUsage } from "~/libs/modules/system-monitor/system-monitor.js";
import { zoomBot } from "~/libs/modules/zoom/zoom-bot.js";

const init = async (): Promise<void> => {
	logCpuMemoryUsage();

	if (config.ENV.ZOOM.MEETING_LINK) {
		await zoomBot.run();
	}
};

await init();
