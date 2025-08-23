import { z } from "zod";

import { isZoomLink } from "../../../../libs/helpers/helpers.js";
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
			.nonempty(MeetingValidationMessage.ZOOM_LINK_REQUIRE)
			.url()
			.refine(isZoomLink, {
				message: MeetingValidationMessage.ZOOM_LINK_INVALID,
			}),
		meetingPassword: z.string().nullable().optional(),
		title: z
			.string()
			.max(MeetingValidationRule.MEETING_TITLE_MAXIMUM_LENGTH, {
				message: MeetingValidationMessage.MEETING_TITLE_MAXIMUM_LENGTH,
			})
			.nullable()
			.optional(),
	})
	.required();

export { meetingCreate };
