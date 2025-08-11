import { z } from "zod";

const PATH_REGEX = /^\/(j|wc\/join)\/(\d{9,11})$/;

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
			.nonempty("Zoom meeting link is required")
			.url()
			.refine(
				(url) => {
					try {
						const parsedUrl = new URL(url);

						if (!parsedUrl.hostname.endsWith("zoom.us")) {
							return false;
						}

						const match = PATH_REGEX.exec(parsedUrl.pathname);

						return match !== null;
					} catch {
						return false;
					}
				},
				{
					message: "Invalid Zoom meeting link",
				},
			),
		meetingPassword: z.string().nullable().optional(),
	})
	.required();

export { meetingCreate };
