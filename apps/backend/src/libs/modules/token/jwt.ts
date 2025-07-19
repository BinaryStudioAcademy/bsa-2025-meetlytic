import { config } from "~/libs/modules/config/config.js";

import { BaseToken } from "./base-token.js";
import { JwtService } from "./jwt.service.js";
import { type JwtPayload } from "./libs/types/types.js";

const SECRET = new TextEncoder().encode(config.ENV.TOKEN.SECRET);
const ALGORITHM = config.ENV.TOKEN.ALGORITHM;
const EXPIRES_IN = config.ENV.TOKEN.EXPIRES_IN;

const baseToken = new BaseToken<JwtPayload>({
	algorithm: ALGORITHM,
	secret: SECRET,
});

const jwt = new JwtService(baseToken, EXPIRES_IN);

export { jwt };
