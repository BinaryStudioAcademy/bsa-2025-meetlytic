import { config } from "~/libs/modules/config/config.js";

import { BaseToken } from "./base-token.module.js";
import { type JwtPayload, type SharedJwtPayload } from "./libs/types/types.js";

const { ALGORITHM, EXPIRES_IN, SECRET } = config.ENV.TOKEN;

const jwt = new BaseToken<JwtPayload>({
	algorithm: ALGORITHM,
	expirationTime: EXPIRES_IN,
	secret: new TextEncoder().encode(SECRET),
});

const sharedJwt = new BaseToken<SharedJwtPayload>({
	algorithm: config.ENV.SHARED_TOKEN.ALGORITHM,
	expirationTime: config.ENV.SHARED_TOKEN.EXPIRES_IN,
	secret: new TextEncoder().encode(config.ENV.SHARED_TOKEN.SECRET),
});

export { jwt, sharedJwt };
export { type BaseToken } from "./base-token.module.js";
export { type JwtPayload } from "./libs/types/types.js";
