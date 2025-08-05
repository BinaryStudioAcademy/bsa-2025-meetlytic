import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { BaseAudioRecorder } from "./base-audio-recorder.module.js";

const { AUDIO_CHUNK_DURATION, AUDIO_OUTPUT_DIRECTORY, FFMPEG_PATH } =
	config.ENV.AUDIO_RECORDER;

const audioRecorder = new BaseAudioRecorder({
	chunkDuration: AUDIO_CHUNK_DURATION,
	ffmpegPath: FFMPEG_PATH,
	logger,
	outputDir: AUDIO_OUTPUT_DIRECTORY,
});

export { audioRecorder };
export { type AudioRecorder } from "./libs/types/types.js";
