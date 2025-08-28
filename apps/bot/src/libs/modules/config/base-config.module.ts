import convict, { type Config as LibraryConfig } from "convict";
import { config } from "dotenv";
import { type LaunchOptions } from "puppeteer";

import { AppEnvironment } from "~/libs/enums/enums.js";

import { type Config, type EnvironmentSchema } from "./libs/types/types.js";

class BaseConfig implements Config {
	public ENV: EnvironmentSchema;

	public constructor() {
		config();

		this.envSchema.load({});
		this.envSchema.validate({
			allowed: "strict",
		});

		this.ENV = this.envSchema.getProperties();
	}

	private get envSchema(): LibraryConfig<EnvironmentSchema> {
		return convict<EnvironmentSchema>({
			APP: {
				ENVIRONMENT: {
					default: null,
					doc: "Application environment",
					env: "NODE_ENV",
					format: Object.values(AppEnvironment),
				},
				ORIGIN: {
					default: null,
					doc: "Origin URL",
					env: "ORIGIN",
					format: String,
				},
			},
			AUDIO_RECORDER: {
				CHUNK_DURATION: {
					default: null,
					doc: "Duration of audio chunks",
					env: "CHUNK_DURATION",
					format: Number,
				},
				FFMPEG_PATH: {
					default: null,
					doc: "Location of ffmpeg",
					env: "FFMPEG_PATH",
					format: String,
				},
				OUTPUT_DIRECTORY: {
					default: null,
					doc: "Path to the audio output directory",
					env: "OUTPUT_DIRECTORY",
					format: String,
				},
			},
			AWS: {
				ACCESS_KEY_ID: {
					default: null,
					doc: "AWS Access Key ID",
					env: "AWS_ACCESS_KEY_ID",
					format: String,
				},
				REGION: {
					default: null,
					doc: "AWS Region",
					env: "AWS_REGION",
					format: String,
				},
				SECRET_ACCESS_KEY: {
					default: null,
					doc: "AWS Secret Access Key",
					env: "AWS_SECRET_ACCESS_KEY",
					format: String,
				},
			},
			OPEN_AI: {
				KEY: {
					default: null,
					doc: "OpenAI API key",
					env: "OPEN_AI_KEY",
					format: String,
				},
				TEXT_GENERATION_MODEL: {
					default: null,
					doc: "OpenAI text generation model",
					env: "TEXT_GENERATION_MODEL",
					format: String,
				},
				TRANSCRIPTION_MODEL: {
					default: null,
					doc: "OpenAI transcription model",
					env: "TRANSCRIPTION_MODEL",
					format: String,
				},
			},
			S3: {
				BUCKET_NAME: {
					default: null,
					doc: "S3 Bucket Name",
					env: "S3_BUCKET_NAME",
					format: String,
				},
				PREFIX_AUDIO: {
					default: null,
					doc: "S3 Prefix for audio files",
					env: "S3_PREFIX_AUDIO",
					format: String,
				},
			},
			ZOOM: {
				BOT_NAME: {
					default: "Meetlytic Bot",
					doc: "Name of the bot in the Zoom meeting",
					env: "BOT_NAME",
					format: String,
				},
				MEETING_ID: {
					default: null,
					doc: "Meeting ID primary key",
					env: "MEETING_ID",
					format: Number,
				},
				MEETING_LINK: {
					default: null,
					doc: "Zoom meeting link",
					env: "MEETING_LINK",
					format: String,
				},
				MEETING_PASSWORD: {
					default: "",
					doc: "Zoom meeting password",
					env: "MEETING_PASSWORD",
				},
			},
		});
	}

	public getLaunchOptions(): LaunchOptions {
		const sharedArguments = [
			"--no-sandbox",
			"--disable-setuid-sandbox",
			"--autoplay-policy=no-user-gesture-required",
			"--use-fake-ui-for-media-stream",
			"--headless=true",
		];

		return {
			args: sharedArguments,
			defaultViewport: { height: 700, width: 1200 },
			enableExtensions: true,
			executablePath: "/usr/bin/chromium-browser",
			headless: false,
		};
	}
}

export { BaseConfig };
