import {
	type BaseConfig,
	type BaseSocketClient,
	type Logger,
	type OpenAI,
} from "~/libs/types/types.js";

type AudioRecorderOptions = {
	chunkDuration: number;
	config: BaseConfig;
	ffmpegPath: string;
	logger: Logger;
	openAI: OpenAI;
	outputDir: string;
	socketClient: BaseSocketClient;
};

export { type AudioRecorderOptions };
