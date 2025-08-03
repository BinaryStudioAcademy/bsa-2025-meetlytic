import { type ValueOf } from "../../../../libs/types/types.js";
import { type MeetingHost } from "../enums/enums.js";

type MeetingCreateRequestDto = {
	host: ValueOf<typeof MeetingHost>;
	instanceId: null | string;
	meetingId: string;
	meetingPassword: null | string;
};

export { type MeetingCreateRequestDto };
