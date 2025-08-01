import convict, { type Config as LibraryConfig } from "convict";
import { config } from "dotenv";

import { AppEnvironment } from "~/libs/enums/enums.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { type Config, type EnvironmentSchema } from "./libs/types/types.js";

class BaseConfig implements Config {
	private logger: Logger;

	public ENV: EnvironmentSchema;

	public constructor(logger: Logger) {
		this.logger = logger;

		config();

		this.envSchema.load({});
		this.envSchema.validate({
			allowed: "strict",
			output: (message) => {
				this.logger.info(message);
			},
		});

		this.ENV = this.envSchema.getProperties();
		this.logger.info(".env file found and successfully parsed!");
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
				HOST: {
					default: null,
					doc: "Host for server app",
					env: "HOST",
					format: String,
				},
				PORT: {
					default: null,
					doc: "Port for incoming connections",
					env: "PORT",
					format: Number,
				},
			},
			AWS: {
				ACCESS_KEY_ID: {
					default: null,
					doc: "AWS Access Key ID",
					env: "ACCESS_KEY_ID",
					format: String,
				},
				AMI_ID: {
					default: null,
					doc: "AWS AMI ID",
					env: "AMI_ID",
					format: String,
				},
				REGION: {
					default: null,
					doc: "AWS Region",
					env: "REGION",
					format: String,
				},
				SECRET_ACCESS_KEY: {
					default: null,
					doc: "AWS Secret Access Key",
					env: "SECRET_ACCESS_KEY",
					format: String,
				},
			},
			DB: {
				CONNECTION_STRING: {
					default: null,
					doc: "Database connection string",
					env: "DB_CONNECTION_STRING",
					format: String,
				},
				DIALECT: {
					default: null,
					doc: "Database dialect",
					env: "DB_DIALECT",
					format: String,
				},
				POOL_MAX: {
					default: null,
					doc: "Database pool max count",
					env: "DB_POOL_MAX",
					format: Number,
				},
				POOL_MIN: {
					default: null,
					doc: "Database pool min count",
					env: "DB_POOL_MIN",
					format: Number,
				},
			},
			ENCRYPT: {
				SALT_ROUNDS: {
					default: null,
					doc: "Salt rounds of bcrypt hashes",
					env: "SALT_ROUNDS",
					format: Number,
				},
			},
			TOKEN: {
				ALGORITHM: {
					default: null,
					doc: "JWT signing algorithm",
					env: "JWT_ALGORITHM",
					format: String,
				},
				EXPIRES_IN: {
					default: null,
					doc: "Token expiration duration in a human-readable format",
					env: "JWT_EXPIRES_IN",
					format: String,
				},
				SECRET: {
					default: null,
					doc: "Secret key of JWT tokens",
					env: "JWT_SECRET",
					format: String,
				},
			},
		});
	}
}

export { BaseConfig };
