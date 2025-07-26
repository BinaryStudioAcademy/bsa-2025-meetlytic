import { ValueOf } from "../../../../index.js";
import { MeetingHost } from "../enums/meetings-host.enum.js";

type MeetingUpdateRequestDto = {
	host: ValueOf<typeof MeetingHost>;
	ownerId: number;
};

export { type MeetingUpdateRequestDto };
