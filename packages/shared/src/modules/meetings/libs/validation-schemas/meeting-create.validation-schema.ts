import { z } from "zod";

import { type ValueOf } from "../../../../libs/types/types.js";
import {
	MeetingHost,
	MeetingValidationMessage,
	MeetingValidationRule,
} from "../enums/enums.js";

const allowedHosts = Object.values(MeetingHost);

const meetingCreate = z
	.object({
		host: z
			.string()
			.min(MeetingValidationRule.MINIMAL_HOST_LENGTH, {
				message: MeetingValidationMessage.HOST_REQUIRE,
			})
			.refine(
				(value: string): boolean =>
					allowedHosts.includes(value as ValueOf<typeof MeetingHost>),
				{
					message: MeetingValidationMessage.HOST_WRONG,
				},
			),
		meetingLink: z
			.string()
			.min(MeetingValidationRule.MINIMAL_MEETING_ID_LENGTH),
		meetingPassword: z.string().nullable().optional(),
	})
	.required();

export { meetingCreate };
