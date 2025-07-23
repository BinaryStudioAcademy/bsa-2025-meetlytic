import { HTTPCode } from "../../../libs/modules/http/http.js";
import { AuthStatusMessage } from "../../../modules/auth/auth.js";
import { HTTPError } from "../http-error/http-error.exception.js";

class AuthError extends HTTPError {
	constructor() {
		super({
			message: AuthStatusMessage.INVALID_CREDENTIALS,
			status: HTTPCode.UNAUTHORIZED,
		});
	}
}

export { AuthError };
