import { config } from "~/libs/modules/config/config.js";

import { BaseToken } from "./base-token.module.js";
import { type JwtPayload } from "./libs/types/types.js";

const { ALGORITHM, EXPIRES_IN, SECRET } = config.ENV.TOKEN;

const jwt = new BaseToken<JwtPayload>({
	algorithm: ALGORITHM,
	expirationTime: EXPIRES_IN,
	secret: new TextEncoder().encode(SECRET),
});

export { jwt };
export { type BaseToken } from "./base-token.module.js";
export { type JwtPayload } from "./libs/types/types.js";
