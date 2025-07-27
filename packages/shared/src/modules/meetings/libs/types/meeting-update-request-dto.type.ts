import { type ValueOf } from "../../../../libs/types/types.js";
import { type MeetingHost } from "../enums/meetings-host.enum.js";

type MeetingUpdateRequestDto = {
	host: ValueOf<typeof MeetingHost>;
	ownerId: number;
};

export { type MeetingUpdateRequestDto };
