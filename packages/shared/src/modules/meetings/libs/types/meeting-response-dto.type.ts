import { type ValueOf } from "../../../../libs/types/types.js";
import { type MeetingHost, type MeetingStatus } from "../enums/enums.js";

type MeetingResponseDto = {
	createdAt: string;
	host: ValueOf<typeof MeetingHost>;
	id: number;
	instanceId: null | string;
	meetingId: string;
	ownerId: number;
	status: ValueOf<typeof MeetingStatus>;
};

export { type MeetingResponseDto };
