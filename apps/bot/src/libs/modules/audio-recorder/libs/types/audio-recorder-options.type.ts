import { type Logger, type OpenAI } from "~/libs/types/types.js";

type AudioRecorderOptions = {
	chunkDuration: number;
	ffmpegPath: string;
	logger: Logger;
	openAI: OpenAI;
	outputDir: string;
};

export { type AudioRecorderOptions };
