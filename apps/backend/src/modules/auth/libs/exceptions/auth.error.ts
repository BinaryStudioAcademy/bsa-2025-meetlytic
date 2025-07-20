import { HTTPCode } from "~/libs/enums/enums.js";
import { HTTPError } from "~/libs/exceptions/exceptions.js";

import { AuthStausMessage } from "../enums/enums.js";

class AuthError extends HTTPError {
	constructor() {
		super({
			message: AuthStausMessage.INVALID_CREDENTIALS,
			status: HTTPCode.UNAUTHORIZED,
		});
	}
}

export { AuthError };
