import { type AppEnvironment } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

type EnvironmentSchema = {
	APP: {
		ENVIRONMENT: ValueOf<typeof AppEnvironment>;
	};
	OPEN_AI: {
		WHISPER_KEY: string;
	};
};

export { type EnvironmentSchema };
