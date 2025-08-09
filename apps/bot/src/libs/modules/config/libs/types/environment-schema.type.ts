import { type AppEnvironment } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

type EnvironmentSchema = {
	APP: {
		ENVIRONMENT: ValueOf<typeof AppEnvironment>;
	};
	AUDIO_RECORDER: {
		CHUNK_DURATION: number;
		FFMPEG_PATH: string;
		OUTPUT_DIRECTORY: string;
	};
	OPEN_AI: {
		KEY: string;
		TEXT_GENERATION_MODEL: string;
		TRANSCRIPTION_MODEL: string;
	};
	ZOOM: {
		BOT_NAME: string;
		MEETING_ID: string;
		MEETING_PASSWORD: string;
	};
};

export { type EnvironmentSchema };
