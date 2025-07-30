import {
	type FastifyReply,
	type FastifyRequest,
	type HookHandlerDoneFunction,
} from "fastify";

import { HTTPCode } from "~/libs/modules/http/http.js";
import { MeetingErrorMessage } from "~/modules/meetings/libs/enums/enums.js";
import { MeetingError } from "~/modules/meetings/libs/exceptions/exceptions.js";
import { type MeetingService } from "~/modules/meetings/meetings.js";

import { type MeetingOwnerHook } from "./libs/types/types.js";

const checkIfMeetingOwner = (
	meetingService: MeetingService,
): MeetingOwnerHook => {
	return (
		request: FastifyRequest,
		reply: FastifyReply,
		done: HookHandlerDoneFunction,
	): void => {
		const { id } = request.params as Record<string, string>;
		const meetingId = Number(id);

		meetingService["find"](meetingId)
			.then((meeting) => {
				if (meeting.ownerId !== request.user?.id) {
					done(
						new MeetingError({
							message: MeetingErrorMessage.FORBIDDEN,
							status: HTTPCode.FORBIDDEN,
						}),
					);

					return;
				}

				done();
			})
			.catch((error: unknown) => {
				done(error as Error);
			});
	};
};

export { checkIfMeetingOwner };
