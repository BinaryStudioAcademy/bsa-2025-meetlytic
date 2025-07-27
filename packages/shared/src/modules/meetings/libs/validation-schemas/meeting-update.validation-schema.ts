import { z } from "zod";

import { type ValueOf } from "../../../../libs/types/types.js";
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
				(value: string): boolean =>
					allowedHosts.includes(value as ValueOf<typeof MeetingHost>),
				{
					message: MeetingValidationMessage.HOST_WRONG,
				},
			),
		instanceId: z.string().nullable().optional(),
	})
	.required();

export { meetingUpdate };
