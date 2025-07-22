import { HTTPCode } from "~/libs/enums/enums.js";
import { HTTPError } from "~/libs/exceptions/exceptions.js";

import { AuthStatusMessage } from "../enums/enums.js";

class AuthError extends HTTPError {
	constructor() {
		super({
			message: AuthStatusMessage.INVALID_CREDENTIALS,
			status: HTTPCode.UNAUTHORIZED,
		});
	}
}

export { AuthError };
