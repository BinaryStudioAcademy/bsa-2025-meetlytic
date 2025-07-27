import { type FastifyRequest } from "fastify";

import { HTTPCode } from "~/libs/modules/http/http.js";
import { MeetingErrorMessage } from "~/modules/meetings/libs/enums/enums.js";
import { MeetingError } from "~/modules/meetings/libs/exceptions/exceptions.js";
import { type MeetingRepository } from "~/modules/meetings/meetings.js";

const createMeetingHook = (meetingRepository: MeetingRepository) => {
	return async function (request: FastifyRequest): Promise<void> {
		const { method, params } = request;

		if (method.toUpperCase() === "POST") {
			return;
		}

		const meetingId = Number((params as Record<string, string>)["id"]);
		const meeting = await meetingRepository.find(meetingId);

		if (!meeting) {
			throw new MeetingError({
				message: MeetingErrorMessage.MEETING_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const ownerIdFromDataBase = meeting.toObject().ownerId;
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
