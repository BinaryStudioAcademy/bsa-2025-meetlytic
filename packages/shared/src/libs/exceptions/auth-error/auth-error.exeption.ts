import { AuthStatusMessage } from "../../../modules/auth/auth.js";
import { HTTPCode } from "../../modules/http/http.js";
import { type ValueOf } from "../../types/value-of.type.js";
import { HTTPError } from "../http-error/http-error.exception.js";

type Constructor = {
	cause?: unknown;
	message?: string;
	status?: ValueOf<typeof HTTPCode>;
};

class AuthError extends HTTPError {
	public constructor({
		cause,
		message = AuthStatusMessage.INVALID_CREDENTIALS,
		status = HTTPCode.UNAUTHORIZED,
	}: Constructor = {}) {
		super({
			cause,
			message,
			status,
		});
	}
}

export { AuthError };
