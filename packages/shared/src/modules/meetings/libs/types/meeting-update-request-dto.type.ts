import { type ValueOf } from "../../../../libs/types/types.js";
import { type MeetingHost, type MeetingStatus } from "../enums/enums.js";

type MeetingUpdateRequestDto = {
	actionItems?: string;
	host?: ValueOf<typeof MeetingHost>;
	status?: ValueOf<typeof MeetingStatus>;
	summary?: string;
};

export { type MeetingUpdateRequestDto };
