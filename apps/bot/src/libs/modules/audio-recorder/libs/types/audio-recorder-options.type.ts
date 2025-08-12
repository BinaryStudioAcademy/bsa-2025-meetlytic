import { type Logger, type OpenAI, type S3 } from "~/libs/types/types.js";

type AudioRecorderOptions = {
	chunkDuration: number;
	ffmpegPath: string;
	logger: Logger;
	openAI: OpenAI;
	outputDir: string;
	s3: S3;
};

export { type AudioRecorderOptions };
