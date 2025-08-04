import { config } from "~/libs/modules/config/config.js";

import { BaseAudioRecorder } from "./base-audio-recorder.module.js";

const { AUDIO_CHUNK_DURATION, AUDIO_OUTPUT_DIR, FFMPEG_PATH } =
	config.ENV.AUDIO_RECORDER;

const audioRecorder = new BaseAudioRecorder({
	chunkDuration: AUDIO_CHUNK_DURATION,
	ffmpegPath: FFMPEG_PATH,
	outputDir: AUDIO_OUTPUT_DIR,
});

export { audioRecorder };
