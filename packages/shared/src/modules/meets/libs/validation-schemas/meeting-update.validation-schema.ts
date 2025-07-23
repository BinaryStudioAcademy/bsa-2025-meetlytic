import { z } from "zod";

import {
	MeetingHost,
	MeetingValidationMessage,
	MeetingValidationRule,
} from "../enums/enums.js";

const allowedHosts = Object.values(MeetingHost);

const meetingUpdate = z
	.object({
		host: z
			.string()
			.min(MeetingValidationRule.MINIMAL_HOST_LENGTH, {
				message: MeetingValidationMessage.HOST_REQUIRE,
			})
			.refine(
				(
					value: string,
				): value is (typeof MeetingHost)[keyof typeof MeetingHost] =>
					allowedHosts.includes(
						value as (typeof MeetingHost)[keyof typeof MeetingHost],
					),
				{
					message: MeetingValidationMessage.HOST_WRONG,
				},
			),
		instanceId: z.string().nullable().optional(),
	})
	.required();

export { meetingUpdate };
