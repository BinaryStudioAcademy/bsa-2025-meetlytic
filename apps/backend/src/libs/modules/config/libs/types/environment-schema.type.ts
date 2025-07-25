import { type AppEnvironment } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

type EnvironmentSchema = {
	APP: {
		ENVIRONMENT: ValueOf<typeof AppEnvironment>;
		HOST: string;
		PORT: number;
	};
	AWS: {
		ACCESS_KEY_ID: string;
		AMI_ID: string;
		REGION: string;
		SECRET_ACCESS_KEY: string;
		SECURITY_GROUP_ID: string;
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
	TOKEN: {
		ALGORITHM: string;
		EXPIRES_IN: string;
		SECRET: string;
	};
};

export { type EnvironmentSchema };
