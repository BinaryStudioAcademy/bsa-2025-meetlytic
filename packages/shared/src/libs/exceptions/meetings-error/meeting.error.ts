import { HTTPCode } from "../../../libs/modules/http/http.js";
import { MeetingStatusMessage } from "../../../modules/meetings/meetings.js";
import { ValueOf } from "../../types/types.js";
import { HTTPError } from "../http-error/http-error.exception.js";

class MeetingError extends HTTPError {
	public constructor(
		message: (typeof MeetingStatusMessage)[keyof typeof MeetingStatusMessage],
		status: ValueOf<typeof HTTPCode>,
	) {
		super({
			message,
			status,
		});
	}
}

export { MeetingError };
