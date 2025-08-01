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
					default: null,
					doc: "Zoom meeting password",
					env: "MEETING_PASSWORD",
					format: String,
				},
			},
		});
	}

	public getLaunchOptions(): LaunchOptions {
		const isProduction = this.ENV.APP.ENVIRONMENT === AppEnvironment.PRODUCTION;
		const isDevelopment =
			this.ENV.APP.ENVIRONMENT === AppEnvironment.DEVELOPMENT;

		return {
			enableExtensions: true,
			headless: isProduction,
			...(isDevelopment && {
				args: [
					"--use-fake-ui-for-media-stream",
					"--use-fake-device-for-media-stream",
					"--no-sandbox",
					"--disable-setuid-sandbox",
					"--mute-audio",
				],
			}),
			...(isProduction && {
				args: ["--no-sandbox", "--disable-setuid-sandbox"],
			}),
		};
	}
}

export { BaseConfig };
