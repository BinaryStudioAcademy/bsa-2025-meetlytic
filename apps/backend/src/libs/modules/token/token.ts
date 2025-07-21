import { config } from "~/libs/modules/config/config.js";

// eslint-disable-next-line import/no-unresolved
import { BaseToken } from "./base-token.module.js";
// eslint-disable-next-line import/no-unresolved
import { type JwtPayload } from "./libs/types/types.js";

const jwt = new BaseToken<JwtPayload>({
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
	algorithm: config.ENV.TOKEN.ALGORITHM,
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
	expirationTime: config.ENV.TOKEN.EXPIRES_IN,
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
	secret: new TextEncoder().encode(config.ENV.TOKEN.SECRET),
});

export { jwt };
