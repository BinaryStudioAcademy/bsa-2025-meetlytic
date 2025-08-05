import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { openAI } from "~/libs/modules/open-ai/open-ai.js";

import { BaseAudioRecorder } from "./base-audio-recorder.module.js";

const { CHUNK_DURATION, FFMPEG_PATH, OUTPUT_DIRECTORY } =
	config.ENV.AUDIO_RECORDER;

const audioRecorder = new BaseAudioRecorder({
	chunkDuration: CHUNK_DURATION,
	ffmpegPath: FFMPEG_PATH,
	logger,
	openAI,
	outputDir: OUTPUT_DIRECTORY,
});

export { audioRecorder };
export { type AudioRecorder } from "./libs/types/types.js";
