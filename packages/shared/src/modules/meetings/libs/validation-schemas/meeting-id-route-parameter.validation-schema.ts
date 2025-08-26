import { z } from "zod";

import {
	MeetingValidationMessage,
	MeetingValidationRule,
} from "../enums/enums.js";

const meetingIdRouteParameter = z.object({
	id: z.coerce
		.number({
			invalid_type_error: MeetingValidationMessage.MMETING_ID_MUST_BE_NUMBER,
		})
		.int(MeetingValidationMessage.MMETING_ID_MUST_BE_INTEGER)
		.positive(MeetingValidationMessage.MMETING_ID_MUST_BE_POSITIVE)
		.max(MeetingValidationRule.MEETING_ID_MAXIMUM_NUMBER, {
			message: MeetingValidationMessage.MMETING_ID_TOO_LARGE,
		}),
});

export { meetingIdRouteParameter };
