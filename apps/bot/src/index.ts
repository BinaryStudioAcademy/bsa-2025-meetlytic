import { config } from "~/libs/modules/config/config.js";
import { openAI } from "~/libs/modules/open-ai/open-ai.js";
import { zoomBot } from "~/libs/modules/zoom/zoom-bot.js";

const init = async (): Promise<void> => {
	if (!config.ENV.OPEN_AI.KEY) {
		await openAI.transcribe("audio.mp3");
	}

	if (config.ENV.ZOOM.MEETING_LINK) {
		await zoomBot.run();
	}
};

await init();
