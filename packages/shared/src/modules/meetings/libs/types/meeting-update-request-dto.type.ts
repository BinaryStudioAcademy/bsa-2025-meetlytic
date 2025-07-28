import { type ValueOf } from "../../../../libs/types/types.js";
import { type MeetingHost, type MeetingStatus } from "../enums/enums.js";

type MeetingUpdateRequestDto = {
	host: ValueOf<typeof MeetingHost>;
	ownerId: number;
	status: ValueOf<typeof MeetingStatus>;
};

export { type MeetingUpdateRequestDto };
