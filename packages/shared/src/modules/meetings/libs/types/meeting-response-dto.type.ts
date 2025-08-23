import { type ValueOf } from "../../../../libs/types/types.js";
import { type MeetingHost, type MeetingStatus } from "../enums/enums.js";

type MeetingResponseDto = {
	audioFileId: null | number;
	createdAt: string;
	host: ValueOf<typeof MeetingHost>;
	id: number;
	meetingId: string;
	ownerId: number;
	status: ValueOf<typeof MeetingStatus>;
	title: null | string;
};

export { type MeetingResponseDto };
