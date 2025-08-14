import { audioRecorder } from "~/libs/modules/audio-recorder/audio-recorder.js";
import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { openAI } from "~/libs/modules/open-ai/open-ai.js";
import { socketClient } from "~/libs/modules/socket-client/socket-client.js";
import { BaseZoomBot } from "~/libs/modules/zoom/base-zoom-bot.js";

const zoomBot = new BaseZoomBot({
	audioRecorder,
	config,
	logger,
	openAI,
	socketClient,
});

export { zoomBot };
