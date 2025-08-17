import { type AppEnvironment } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

type EnvironmentSchema = {
	APP: {
		ENVIRONMENT: ValueOf<typeof AppEnvironment>;
		HOST: string;
		ORIGIN: string;
		PORT: number;
	};
	AWS: {
		ACCESS_KEY_ID: string;
		AMI_ID: string;
		REGION: string;
		S3_BUCKET_NAME: string;
		SECRET_ACCESS_KEY: string;
	};
	BOT: {
		NAME: string;
	};
	DB: {
		CONNECTION_STRING: string;
		DIALECT: string;
		POOL_MAX: number;
		POOL_MIN: number;
	};
	ENCRYPT: {
		SALT_ROUNDS: number;
	};
	OPEN_AI: {
		KEY: string;
		TEXT_GENERATION_MODEL: string;
		TRANSCRIPTION_MODEL: string;
	};
	SHARED_TOKEN: {
		ALGORITHM: string;
		EXPIRES_IN: string;
		SECRET: string;
	};
	TOKEN: {
		ALGORITHM: string;
		EXPIRES_IN: string;
		SECRET: string;
	};
};

export { type EnvironmentSchema };
