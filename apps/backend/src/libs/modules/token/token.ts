import { config } from "~/libs/modules/config/config.js";

import { BaseToken } from "./base-token.module.js";
import { type JwtPayload } from "./libs/types/types.js";

const jwt = new BaseToken<JwtPayload>({
	algorithm: config.ENV.TOKEN.ALGORITHM,
	expirationTime: config.ENV.TOKEN.EXPIRES_IN,
	secret: new TextEncoder().encode(config.ENV.TOKEN.SECRET),
});

export { jwt };
