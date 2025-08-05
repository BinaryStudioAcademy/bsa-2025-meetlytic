import { HTTPCode } from "../../../libs/modules/http/http.js";
import { type ValueOf } from "../../../libs/types/value-of.type.js";
import { AuthStatusMessage } from "../../../modules/auth/auth.js";
import { HTTPError } from "../http-error/http-error.exception.js";

type Constructor = {
	cause?: unknown;
	message?: string;
	status?: ValueOf<typeof HTTPCode>;
};

class AuthError extends HTTPError {
	public constructor({
		message = AuthStatusMessage.INVALID_CREDENTIALS,
		status = HTTPCode.UNAUTHORIZED,
	}: Constructor = {}) {
		super({
			message,
			status,
		});
	}
}

export { AuthError };
