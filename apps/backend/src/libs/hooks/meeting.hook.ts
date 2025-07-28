import { type FastifyRequest } from "fastify";

import { HTTPCode } from "~/libs/modules/http/http.js";
import { MeetingErrorMessage } from "~/modules/meetings/libs/enums/enums.js";
import { MeetingError } from "~/modules/meetings/libs/exceptions/exceptions.js";
import { type MeetingService } from "~/modules/meetings/meetings.js";

const createMeetingHook = (meetingService: MeetingService) => {
	return async function (request: FastifyRequest): Promise<void> {
		const { params } = request;

		const meetingId = Number((params as Record<string, string>)["id"]);
		const meeting = await meetingService.find(meetingId);

		const ownerIdFromDataBase = meeting.ownerId;
		const ownerIdFromUser = request.user?.id;

		if (ownerIdFromDataBase !== ownerIdFromUser) {
			throw new MeetingError({
				message: MeetingErrorMessage.FORBIDDEN,
				status: HTTPCode.FORBIDDEN,
			});
		}
	};
};

export { createMeetingHook };
