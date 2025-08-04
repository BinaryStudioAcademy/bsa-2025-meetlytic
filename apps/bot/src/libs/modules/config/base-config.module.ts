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
		});
	}

	public getLaunchOptions(): LaunchOptions {
		const isProduction = this.ENV.APP.ENVIRONMENT === AppEnvironment.PRODUCTION;

		return {
			enableExtensions: true,
			headless: isProduction,
			...(isProduction && {
				args: ["--no-sandbox", "--disable-setuid-sandbox"],
			}),
		};
	}
}

export { BaseConfig };
