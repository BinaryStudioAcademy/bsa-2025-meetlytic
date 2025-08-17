import { z } from "zod";

import { type ValueOf } from "../../../../libs/types/types.js";
import {
	MeetingHost,
	MeetingStatus,
	MeetingValidationMessage,
	MeetingValidationRule,
} from "../enums/enums.js";

const allowedHosts = Object.values(MeetingHost);
const allowedStatus = Object.values(MeetingStatus);

const meetingUpdate = z
	.object({
		actionItems: z.string(),
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
		status: z
			.string()
			.refine(
				(value: string): boolean =>
					allowedStatus.includes(value as ValueOf<typeof MeetingStatus>),
				{
					message: MeetingValidationMessage.STATUS_WRONG,
				},
			),
		summary: z.string(),
	})
	.required();

export { meetingUpdate };
