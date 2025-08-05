import { type ValueOf } from "../../../../libs/types/types.js";
import { type MeetingHost } from "../enums/enums.js";

type MeetingCreateRequestDto = {
	host: ValueOf<typeof MeetingHost>;
	meetingId: string;
	meetingPassword: null | string;
};

export { type MeetingCreateRequestDto };
