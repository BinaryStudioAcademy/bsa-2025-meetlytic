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
		instanceId: z.string().nullable().optional(),
		ownerId: z
			.number()
			.int()
			.positive({ message: MeetingValidationMessage.OWNER_REQUIRE }),
	})
	.required();

export { meetingCreate };
