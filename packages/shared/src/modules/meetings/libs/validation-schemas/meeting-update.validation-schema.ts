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
		instanceId: z.string().nullable().optional(),
		status: z
			.string()
			.refine(
				(value: string): boolean =>
					allowedStatus.includes(value as ValueOf<typeof MeetingStatus>),
				{
					message: MeetingValidationMessage.STATUS_WRONG,
				},
			),
	})
	.required();

export { meetingUpdate };
