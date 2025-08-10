import { audioRecorder } from "~/libs/modules/audio-recorder/audio-recorder.js";
import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { BaseZoomBot } from "~/libs/modules/zoom/base-zoom-bot.js";

const zoomBot = new BaseZoomBot(config, logger, audioRecorder);

export { zoomBot };
