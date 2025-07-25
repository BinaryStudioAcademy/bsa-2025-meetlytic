import { HTTPCode } from "../../../libs/modules/http/http.js";
import { MeetingStatusMessage } from "../../../modules/meetings/meetings.js";
import { ValueOf } from "../../types/types.js";
import { HTTPError } from "../http-error/http-error.exception.js";

type Constructor = {
	cause?: unknown;
	message: ValueOf<typeof MeetingStatusMessage>;
	status: ValueOf<typeof HTTPCode>;
};

class MeetingError extends HTTPError {
	public constructor({ cause, message, status }: Constructor) {
		super({
			cause,
			message,
			status,
		});
	}
}

export { MeetingError };
