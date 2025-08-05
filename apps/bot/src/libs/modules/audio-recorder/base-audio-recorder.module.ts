import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

import { openAI } from "~/libs/modules/open-ai/open-ai.js";
import { type Logger } from "~/libs/types/types.js";

import {
	type AudioRecorder,
	type AudioRecorderOptions,
} from "./libs/types/types.js";

class BaseAudioRecorder implements AudioRecorder {
	private chunkDuration: number;
	private ffmpegPath: string;
	private isRecording = false;
	private logger: Logger;
	private outputDir: string;

	public constructor({
		chunkDuration,
		ffmpegPath,
		logger,
		outputDir,
	}: AudioRecorderOptions) {
		this.chunkDuration = chunkDuration;
		this.ffmpegPath = ffmpegPath;
		this.outputDir = outputDir;
		this.logger = logger;
	}

	private recordNextChunk(): void {
		if (!this.isRecording) {
			return;
		}

		const timestamp = Date.now().toString();
		const filePath = path.join(this.outputDir, `chunk-${timestamp}.mp3`);

		const ffmpegArguments = [
			"-f",
			"pulse",
			"-i",
			"virtual_sink.monitor",
			"-t",
			String(this.chunkDuration),
			"-acodec",
			"libmp3lame",
			"-b:a",
			"128k",
			filePath,
		];

		const process = spawn(this.ffmpegPath, ffmpegArguments);

		process.on("exit", () => {
			if (this.isRecording) {
				openAI.transcribe(filePath).catch((error: unknown) => {
					this.logger.error(String(error));
				});
				this.recordNextChunk();
			}
		});
	}

	public start(): void {
		if (this.isRecording) {
			return;
		}

		mkdirSync(this.outputDir, { recursive: true });

		this.isRecording = true;
		this.recordNextChunk();
	}

	public stop(): void {
		this.isRecording = false;
	}
}

export { BaseAudioRecorder };
