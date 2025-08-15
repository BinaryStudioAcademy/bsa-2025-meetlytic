import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { openAI } from "~/libs/modules/open-ai/open-ai.js";
import { s3 } from "~/libs/modules/s3/s3.js";
import { socketClient } from "~/libs/modules/socket-client/socket-client.js";

import { BaseAudioRecorder } from "./base-audio-recorder.module.js";

const { CHUNK_DURATION, FFMPEG_PATH, OUTPUT_DIRECTORY } =
	config.ENV.AUDIO_RECORDER;

const audioRecorder = new BaseAudioRecorder({
	chunkDuration: CHUNK_DURATION,
	config,
	ffmpegPath: FFMPEG_PATH,
	logger,
	openAI,
	outputDir: OUTPUT_DIRECTORY,
	s3,
	socketClient,
});

export { audioRecorder };
export { type AudioRecorder } from "./libs/types/types.js";
