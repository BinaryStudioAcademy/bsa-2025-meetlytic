import { type MeetingHostValue } from "./types.js";

type MeetingUpdateRequestDto = {
	host: MeetingHostValue;
	instanceId: null | string;
};

export { type MeetingUpdateRequestDto };
