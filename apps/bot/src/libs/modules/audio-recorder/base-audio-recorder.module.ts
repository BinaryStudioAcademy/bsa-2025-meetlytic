import chokidar from "chokidar";
import { type ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { accessSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { Extension, SocketEvent, Timeout } from "~/libs/enums/enums.js";
import { type UploadResult } from "~/libs/modules/s3/s3.js";
import {
	type BaseConfig,
	type BaseSocketClient,
	type Logger,
	type OpenAI,
	type S3,
} from "~/libs/types/types.js";

import {
	AudioFileType,
	AudioRecorderEvent,
	WatcherEvent,
} from "./libs/enums/enums.js";
import {
	type AudioRecorder,
	type AudioRecorderOptions,
	type FinalizeOptions,
	type FinalizeResult,
	type MeetingAudioSaveDto,
} from "./libs/types/types.js";

class BaseAudioRecorder implements AudioRecorder {
	private chunkDuration: number;
	private config: BaseConfig;
	private currentFfmpegProcess: null | ReturnType<typeof spawn> = null;
	private ffmpegPath: string;
	private fullPath: null | string = null;
	private fullRecordingProccess: ChildProcessWithoutNullStreams | null = null;
	private isRecording = false;
	private lastFile: null | string = null;
	private logger: Logger;
	private openAI: OpenAI;
	private outputDir: string;
	private s3: S3;
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
		s3,
		socketClient,
	}: AudioRecorderOptions) {
		this.chunkDuration = chunkDuration;
		this.config = config;
		this.ffmpegPath = ffmpegPath;
		this.outputDir = outputDir;
		this.logger = logger;
		this.s3 = s3;
		this.openAI = openAI;
		this.socketClient = socketClient;
	}

	private async flushLastChunk(): Promise<void> {
		if (this.lastFile) {
			await this.transcribeFile(this.lastFile);
			this.lastFile = null;
		}
	}

	private logVolume(line: string): void {
		const message = this.VOLUME_RE.exec(line);
		const ONE = 1;

		if (message) {
			this.logger.info(`[VOL] ${String(message[ONE])} dB`);
		}
	}

	private async transcribeFile(filePath: string): Promise<void> {
		try {
			this.logger.info(`[TRANSCRIBE] Processing chunk: ${filePath}`);

			const chunkText = await this.openAI.transcribe(filePath);

			this.logger.info(`[TRANSCRIBE] Transcribed chunk: ${chunkText}`);

			this.socketClient.emit(SocketEvent.TRANSCRIBE, {
				chunkText,
				meetingId: this.config.ENV.ZOOM.MEETING_ID,
			});

			this.logger.info(`[TRANSCRIBE] Sent transcription for: ${filePath}`);
		} catch (error: unknown) {
			this.logger.error(`[TRANSCRIBE_ERROR] ${String(error)}`);
		}
	}

	private watchOutputFolder(): void {
		const watcher = chokidar.watch(this.outputDir, {
			ignoreInitial: true,
			persistent: true,
		});

		watcher.on(WatcherEvent.ADD, (filePath) => {
			if (filePath.includes(AudioFileType.FULL_RECORDING)) {
				return;
			}

			if (this.lastFile) {
				void this.transcribeFile(this.lastFile);
			}

			this.lastFile = filePath;
		});

		watcher.on(WatcherEvent.ERROR, (error) => {
			this.logger.error(`[WATCHER_ERROR] ${String(error)}`);
		});
	}

	public async finalize(options: FinalizeOptions): Promise<FinalizeResult> {
		this.isRecording = false;

		const extension = this.useMp3 ? Extension.MP3 : Extension.WAV;
		const expectedName = `${options.meetingId}-audio.${extension}`;
		const filePath = this.fullPath ?? path.join(this.outputDir, expectedName);

		try {
			accessSync(filePath);
		} catch {
			throw new Error("[finalize] full-session file not found");
		}

		const { contentType, prefix } = options;

		this.logger.info(
			`[S3] Uploading ${filePath} -> s3://${prefix}/${expectedName}`,
		);

		const buffer = readFileSync(filePath);

		const uploadResult: UploadResult = await this.s3.upload({
			body: buffer,
			contentType,
			fileName: expectedName,
			prefix,
		});

		if (uploadResult.url && uploadResult.key) {
			const meetingId = Number(this.config.ENV.ZOOM.MEETING_ID);

			const audioFile: MeetingAudioSaveDto = {
				contentType,
				key: uploadResult.key,
				meetingId,
				url: uploadResult.url,
			};

			this.socketClient.emit(SocketEvent.AUDIO_SAVE, audioFile);

			this.logger.info(
				`[WS] Emitted audio:save meetingId=${String(meetingId)} key=${uploadResult.key} url=${uploadResult.url} contentType=${contentType}`,
			);
		} else {
			this.logger.warn(
				"[WS] AUDIO_SAVE not emitted: missing url or key from S3 upload result",
			);
		}

		return {
			localPath: filePath,
			s3: uploadResult,
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

		const fileExtension = this.useMp3 ? Extension.MP3 : Extension.WAV;

		const chunkOutputPattern = path.join(
			this.outputDir,
			`${AudioFileType.CHUNK}.${fileExtension}`,
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
			"auto_null.monitor",
			"-af",
			"astats=metadata=1:reset=1",
			"-f",
			"segment",
			"-segment_time",
			String(this.chunkDuration),
			"-reset_timestamps",
			"1",
			"-strftime",
			"1",
		];

		if (this.useMp3) {
			ffmpegArguments.push("-acodec", "libmp3lame", "-b:a", "128k");
		} else {
			ffmpegArguments.push("-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1");
		}

		ffmpegArguments.push(chunkOutputPattern);

		this.watchOutputFolder();

		const ffmpeg = spawn(this.ffmpegPath, ffmpegArguments);
		this.currentFfmpegProcess = ffmpeg;

		ffmpeg.stderr.on(AudioRecorderEvent.DATA, (data) => {
			const lines = String(data)
				.trim()
				.split("\n")
				.map((l) => l.trim());

			for (const line of lines) {
				this.logVolume(line);
			}
		});

		ffmpeg.on(AudioRecorderEvent.EXIT, (code, signal) => {
			this.logger.info(
				`[FFMPEG] exited | code=${String(code)} | signal=${String(signal)}`,
			);
			this.currentFfmpegProcess = null;

			void this.flushLastChunk();
		});
	}

	public startFullMeetingRecording(meetingId: string): void {
		if (this.fullRecordingProccess) {
			this.logger.warn("[full] already running, ignore startFull()");

			return;
		}

		mkdirSync(this.outputDir, { recursive: true });

		const extension = this.useMp3 ? Extension.MP3 : Extension.WAV;
		this.fullPath = path.join(
			this.outputDir,
			`${meetingId}-audio.${extension}`,
		);

		const ffmpegArguments = [
			"-hide_banner",
			"-loglevel",
			"info",
			"-y",
			"-fflags",
			"+genpts+igndts",
			"-use_wallclock_as_timestamps",
			"1",
			"-f",
			"pulse",
			"-i",
			"auto_null.monitor",
			"-vn",
		];

		if (this.useMp3) {
			ffmpegArguments.push(
				"-acodec",
				"libmp3lame",
				"-b:a",
				"128k",
				"-ar",
				"44100",
				"-ac",
				"2",
			);
		} else {
			ffmpegArguments.push("-acodec", "pcm_s16le", "-ar", "44100", "-ac", "2");
		}

		ffmpegArguments.push(this.fullPath);

		this.logger.info(`[full] start -> ${this.fullPath}`);

		this.fullRecordingProccess = spawn(this.ffmpegPath, ffmpegArguments);

		this.fullRecordingProccess.stderr.on(AudioRecorderEvent.DATA, (data) => {
			const lines = String(data).split("\n");

			for (const raw of lines) {
				const line = raw.trim();

				if (!line) {
					continue;
				}

				this.logger.info(`[FFMPEG][full] ${line}`);
			}
		});

		this.fullRecordingProccess.once(AudioRecorderEvent.EXIT, (code, signal) => {
			this.logger.warn(
				`[full] ffmpeg exited early code=${String(code)} signal=${String(signal)}`,
			);
		});
	}

	public stop(): void {
		this.logger.info("[-] Chunk recording stopped by caller");
		this.isRecording = false;
		this.logger.info("[-] Sending SIGINT to FFmpeg process");
		this.currentFfmpegProcess?.kill("SIGINT");
	}

	public async stopFullMeetingRecording(): Promise<void> {
		if (!this.fullRecordingProccess) {
			return;
		}

		try {
			this.fullRecordingProccess.stdin.write("q");
		} catch {
			this.fullRecordingProccess.kill("SIGINT");
		}

		await Promise.race([
			new Promise<void>((resolve) =>
				this.fullRecordingProccess?.once(AudioRecorderEvent.EXIT, resolve),
			),
			new Promise<void>((resolve) => setTimeout(resolve, Timeout.FIVE_SECONDS)),
		]);

		this.logger.info("[-] Full recording stopped by caller");
		this.fullRecordingProccess = null;
	}
}

export { BaseAudioRecorder };
