import { type MeetingHostValue } from "./types.js";

type MeetingCreateRequestDto = {
	host: MeetingHostValue;
	instanceId: null | string;
	ownerId: number;
};

export { type MeetingCreateRequestDto };
