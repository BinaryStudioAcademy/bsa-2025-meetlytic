import { ValueOf } from "../../../../index.js";
import { MeetingHost } from "../enums/meetings-host.enum.js";

type MeetingCreateRequestDto = {
	host: ValueOf<typeof MeetingHost>;
	instanceId: null | string;
	ownerId: number;
};

export { type MeetingCreateRequestDto };
