import { type ValueOf } from "../../../../libs/types/types.js";
import { type FilePublicDto } from "../../../files/files.js";
import { type MeetingHost, type MeetingStatus } from "../enums/enums.js";

type MeetingDetailedResponseDto = {
	actionItems: null | string;
	audioFile: FilePublicDto | null;
	audioFileId: null | number;
	createdAt: string;
	host: ValueOf<typeof MeetingHost>;
	id: number;
	meetingId: string;
	ownerId: number;
	status: ValueOf<typeof MeetingStatus>;
	summary: null | string;
	title: null | string;
};

export { type MeetingDetailedResponseDto };
