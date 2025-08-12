import { type ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

import { TIMEOUTS } from "~/libs/constants/constants.js";
//mport { delay } from "~/libs/helpers/helpers.js";
import { type UploadResult } from "~/libs/modules/s3/libs/types/types.js";
import { type Logger, type OpenAI, type S3 } from "~/libs/types/types.js";

import { AudioRecorderEvent } from "./libs/enums/enums.js";
import {
	type AudioRecorder,
	type AudioRecorderOptions,
	type FinalizeOptions,
	type FinalizeResult,
} from "./libs/types/types.js";

class BaseAudioRecorder implements AudioRecorder {
	private chunkDuration: number;
	private ffmpegPath: string;
	private fullPath: null | string = null;
	private fullProc: ChildProcessWithoutNullStreams | null = null;
	private isRecording = false;
	private logger: Logger;
	private openAI: OpenAI;
	private outputDir: string;
	private s3: S3;
	private useMp3 = true;
	private VOLUME_RE = /mean[_ ]volume:\s*(-?\d+(?:\.\d+)?)\s*dB/i;

	public constructor({
		chunkDuration,
		ffmpegPath,
		logger,
		openAI,
		outputDir,
		s3,
	}: AudioRecorderOptions) {
		this.chunkDuration = chunkDuration;
		this.ffmpegPath = ffmpegPath;
		this.outputDir = outputDir;
		this.openAI = openAI;
		this.logger = logger;
		this.s3 = s3;
	}

	private logChunkStart(filePath: string, type: string): void {
		this.logger.info(
			`[+] New chunk - ${filePath} | type=${type.toUpperCase()} | duration=${String(this.chunkDuration)}s`,
		);
	}

	private logVolume(line: string): void {
		const message = this.VOLUME_RE.exec(line);
		const ONE = 1;

		if (message) {
			this.logger.info(`[VOL] ${String(message[ONE])} dB`);
		}
	}

	private recordNextChunk(): void {
		if (!this.isRecording) {
			return;
		}

		const timestamp = Date.now().toString();
		const fileExtension = this.useMp3 ? "mp3" : "wav";
		const filePath = path.join(
			this.outputDir,
			`chunk-${timestamp}.${fileExtension}`,
		);

		const ffmpegArguments = [
			"-hide_banner",
			"-fflags",
			"+genpts+igndts",
			"-use_wallclock_as_timestamps",
			"1",
			"-f",
			"pulse",
			"-i",
			"virtual_sink.monitor",
			"-t",
			String(this.chunkDuration),
			"-af",
			"astats=metadata=1:reset=1",
		];

		if (this.useMp3) {
			ffmpegArguments.push("-acodec", "libmp3lame", "-b:a", "128k");
		} else {
			ffmpegArguments.push("-acodec", "pcm_s16le", "-ar", "44100", "-ac", "2");
		}

		ffmpegArguments.push(filePath);

		this.logChunkStart(filePath, fileExtension);

		const ffmpeg = spawn(this.ffmpegPath, ffmpegArguments);

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

		ffmpeg.on(AudioRecorderEvent.EXIT, (code, signal) => {
			this.logger.info(
				`[+] Chunk done | path=${filePath} | code=${String(code)} signal=${String(signal)}`,
			);

			if (this.isRecording) {
				this.recordNextChunk();
			}

			this.openAI.transcribe(filePath).catch((error: unknown) => {
				this.logger.error(String(error));
			});
		});
	}

	public async finalize(options: FinalizeOptions): Promise<FinalizeResult> {
		this.isRecording = false;

		const extension = this.useMp3 ? "mp3" : "wav";
		const expectedName = `${options.meetingId}-audio.${extension}`;
		const outPath = this.fullPath ?? path.join(this.outputDir, expectedName);

		const fs = await import("node:fs/promises");

		try {
			await fs.access(outPath);
		} catch {
			throw new Error("[finalize] full-session file not found");
		}

		const prefix = options.prefix;
		const contentType = options.contentType;

		this.logger.info(
			`[S3] Uploading ${outPath} -> s3://${prefix}/${expectedName}`,
		);

		const buffer = await fs.readFile(outPath);

		const uploaded: UploadResult = await this.s3.upload({
			body: buffer,
			contentType,
			fileName: expectedName,
			prefix,
		});

		return {
			localPath: outPath,
			s3: uploaded,
		};
	}

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

	public startFull(meetingId: string): void {
		if (this.fullProc) {
			this.logger.warn("[full] already running, ignore startFull()");

			return;
		}

		const extension = this.useMp3 ? "mp3" : "wav";
		this.fullPath = path.join(
			this.outputDir,
			`${meetingId}-audio.${extension}`,
		);

		const ffmpegArguments = [
			"-hide_banner",
			"-fflags",
			"+genpts+igndts",
			"-use_wallclock_as_timestamps",
			"1",
			"-f",
			"pulse",
			"-i",
			"virtual_sink.monitor",
		];

		if (this.useMp3) {
			ffmpegArguments.push("-acodec", "libmp3lame", "-b:a", "128k");
		} else {
			ffmpegArguments.push("-acodec", "pcm_s16le", "-ar", "44100", "-ac", "2");
		}

		ffmpegArguments.push(this.fullPath);

		this.logger.info(`[full] start -> ${this.fullPath}`);

		this.fullProc = spawn(this.ffmpegPath, ffmpegArguments);

		this.fullProc.stderr.on(AudioRecorderEvent.DATA, (data) => {
			const lines = String(data)
				.trim()
				.split("\n")
				.map((l) => l.trim());

			for (const line of lines) {
				if (/error|invalid|failed|no such/i.test(line)) {
					this.logger.error(`[FFMPEG][full][ERROR?] ${line}`);
				}
			}
		});
	}

	public stop(): void {
		this.logger.info("[-] Chunk recording stopped by caller");
		this.isRecording = false;
	}

	public async stopFull(): Promise<void> {
		if (!this.fullProc) {
			return;
		}

		try {
			this.fullProc.stdin.write("q");
		} catch {
			this.fullProc.kill("SIGINT");
		}

		await Promise.race([
			new Promise<void>((resolve) => this.fullProc?.once("exit", resolve)),
			new Promise<void>((resolve) =>
				setTimeout(resolve, TIMEOUTS.FIVE_SECONDS),
			),
		]);

		this.logger.info("[-] Full recording stopped by caller");
		this.fullProc = null;
	}
}

export { BaseAudioRecorder };
