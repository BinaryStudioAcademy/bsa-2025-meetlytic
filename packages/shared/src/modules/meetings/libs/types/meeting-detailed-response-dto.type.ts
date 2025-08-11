import { type ValueOf } from "../../../../libs/types/types.js";
import { type MeetingHost, type MeetingStatus } from "../enums/enums.js";

type MeetingDetailedResponseDto = {
	actionItems: null | string;
	createdAt: string;
	host: ValueOf<typeof MeetingHost>;
	id: number;
	meetingId: string;
	ownerId: number;
	status: ValueOf<typeof MeetingStatus>;
	summary: null | string;
};

export { type MeetingDetailedResponseDto };
