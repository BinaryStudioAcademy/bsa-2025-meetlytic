import { HTTPCode } from "../../../libs/modules/http/http.js";
import { UserStatusMessage } from "../../../modules/users/users.js";
import { HTTPError } from "../http-error/http-error.exception.js";

class EmailConflictError extends HTTPError {
	public constructor() {
		super({
			message: UserStatusMessage.EMAIL_ALREADY_EXISTS,
			status: HTTPCode.CONFLICT,
		});
	}
}

export { EmailConflictError };
