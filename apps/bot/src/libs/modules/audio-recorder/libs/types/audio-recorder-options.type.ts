import {
	type BaseConfig,
	type BaseSocketClient,
	type Logger,
	type OpenAI,
	type S3,
} from "~/libs/types/types.js";

type AudioRecorderOptions = {
	chunkDuration: number;
	config: BaseConfig;
	ffmpegPath: string;
	logger: Logger;
	openAI: OpenAI;
	outputDir: string;
	s3: S3;
	socketClient: BaseSocketClient;
};

export { type AudioRecorderOptions };
