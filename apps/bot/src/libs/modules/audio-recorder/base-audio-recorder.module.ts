import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

import { SocketEvent } from "~/libs/enums/enums.js";
import {
	type BaseConfig,
	type BaseSocketClient,
	type Logger,
	type OpenAI,
} from "~/libs/types/types.js";

import { AudioRecorderEvent } from "./libs/enums/enums.js";
import {
	type AudioRecorder,
	type AudioRecorderOptions,
} from "./libs/types/types.js";

class BaseAudioRecorder implements AudioRecorder {
	private chunkDuration: number;
	private config: BaseConfig;
	private ffmpegPath: string;
	private isRecording = false;
	private logger: Logger;
	private openAI: OpenAI;
	private outputDir: string;
	private socketClient: BaseSocketClient;
	private useMp3 = true;
	private VOLUME_RE = /mean[_ ]volume:\s*(-?\d+(?:\.\d+)?)\s*dB/i;

	public constructor({
		chunkDuration,
		config,
		ffmpegPath,
		logger,
		openAI,
		outputDir,
		socketClient,
	}: AudioRecorderOptions) {
		this.chunkDuration = chunkDuration;
		this.config = config;
		this.ffmpegPath = ffmpegPath;
		this.outputDir = outputDir;
		this.logger = logger;
		this.openAI = openAI;
		this.socketClient = socketClient;
	}

	private logChunkStart(chunkName: string, type: string): void {
		this.logger.info(
			`[+] New chunk - ${chunkName} | type=${type.toUpperCase()} | duration=${String(this.chunkDuration)}s`,
		);
	}

	private logVolume(line: string): void {
		const match = this.VOLUME_RE.exec(line);
		if (match) {
			this.logger.info(`[VOL] ${String(match[1])} dB`);
		}
	}

	private recordNextChunk(): void {
		if (!this.isRecording) {
			return;
		}

		const timestamp = Date.now().toString();
		const fileExtension = this.useMp3 ? "mp3" : "wav";
		const chunkName = `chunk-${timestamp}.${fileExtension}`;

		this.logChunkStart(chunkName, fileExtension);

		// Ensure output directory exists
		mkdirSync(this.outputDir, { recursive: true });

		const ffmpegArguments: string[] = [
			"-hide_banner",
			"-fflags",
			"+genpts+igndts",
			"-use_wallclock_as_timestamps",
			"1",
			"-f",
			"pulse",
			"-i",
			"auto_null.monitor",
			"-t",
			String(this.chunkDuration),
		];

		// Output format to memory
		if (this.useMp3) {
			ffmpegArguments.push("-acodec", "libmp3lame", "-b:a", "128k", "pipe:1");
		} else {
			ffmpegArguments.push(
				"-acodec",
				"pcm_s16le",
				"-ar",
				"16000",
				"-ac",
				"1",
				"pipe:1",
			);
		}

		const ffmpeg = spawn(this.ffmpegPath, ffmpegArguments);

		const audioChunks: Buffer[] = [];

		ffmpeg.stdout.on("data", (chunk) => {
			audioChunks.push(chunk as Buffer);
		});

		ffmpeg.stderr.on(AudioRecorderEvent.DATA, (data) => {
			const lines = String(data)
				.trim()
				.split("\n")
				.map((l) => l.trim());

			for (const line of lines) {
				this.logVolume(line);

				if (/error|invalid|failed|no such/i.test(line)) {
					this.logger.error(`[FFMPEG][ERROR?] ${line}`);
				} else if (line && !line.startsWith("size=")) {
					this.logger.debug(`[FFMPEG][INFO] ${line}`);
				}
			}
		});

		ffmpeg.on(AudioRecorderEvent.EXIT, async (code, signal) => {
			this.logger.info(
				`[+] Chunk done | name=${chunkName} | code=${String(code)} | signal=${String(signal)}`,
			);

			const audioBuffer = Buffer.concat(audioChunks);
			await this.transcribeBuffer(audioBuffer);

			if (this.isRecording) {
				this.recordNextChunk();
			}
		});
	}

	private transcribeBuffer = async (buffer: Buffer): Promise<void> => {
		try {
			const chunkText = await this.openAI.transcribe(buffer);

			this.socketClient.emit(SocketEvent.TRANSCRIBE, {
				chunkText,
				meetingId: this.config.ENV.ZOOM.MEETING_ID,
			});
		} catch (error: unknown) {
			this.logger.error(`[OPENAI][TRANSCRIBE_ERROR] ${String(error)}`);
		}
	};

	public start(): void {
		if (this.isRecording) {
			this.logger.warn("[+] Already recording: ignoring start()");
			return;
		}

		mkdirSync(this.outputDir, { recursive: true });

		this.logger.info(
			`[+] Start recording | dir=${this.outputDir} | chunk=${String(this.chunkDuration)}s | format=${this.useMp3 ? "MP3" : "WAV"}`,
		);

		this.isRecording = true;
		this.recordNextChunk();
	}

	public stop(): void {
		this.logger.info("[-] Recording stopped by caller");
		this.isRecording = false;
	}
}

export { BaseAudioRecorder };
