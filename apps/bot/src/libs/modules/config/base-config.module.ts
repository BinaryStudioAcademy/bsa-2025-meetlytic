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
			},
			AUDIO_RECORDER: {
				CHUNK_DURATION: {
					default: null,
					doc: "Duration of audio chunks",
					env: "AUDIO_CHUNK_DURATION",
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
					env: "AUDIO_OUTPUT_DIRECTORY",
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
				TRANSCRIPTION_MODEL: {
					default: null,
					doc: "OpenAI transcription model",
					env: "TRANSCRIPTION_MODEL",
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
					doc: "meeting ID",
					env: "MEETING_ID",
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
		const environment = this.ENV.APP.ENVIRONMENT;
		const isProduction = environment === AppEnvironment.PRODUCTION;
		const isDevelopment = environment === AppEnvironment.DEVELOPMENT;

		const sharedArguments = [
			"--use-fake-ui-for-media-stream",
			"--use-fake-device-for-media-stream",
			"--no-sandbox",
			"--disable-setuid-sandbox",
		];

		return {
			args: sharedArguments,
			enableExtensions: true,
			headless: isProduction,
			...(isDevelopment && {
				defaultViewport: { height: 700, width: 1200 },
				headless: false,
			}),
		};
	}
}

export { BaseConfig };
