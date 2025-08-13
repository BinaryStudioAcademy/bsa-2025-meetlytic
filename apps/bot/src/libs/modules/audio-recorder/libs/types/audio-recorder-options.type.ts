import { type Logger } from "~/libs/types/types.js";

type AudioRecorderOptions = {
	chunkDuration: number;
	ffmpegPath: string;
	logger: Logger;
	outputDir: string;
};

export { type AudioRecorderOptions };
