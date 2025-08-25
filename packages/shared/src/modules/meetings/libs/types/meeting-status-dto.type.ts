import { type ValueOf } from "../../../../libs/types/types.js";
import { type MeetingStatus } from "../enums/meeting-status.enum.js";

type MeetingStatusDto = {
	meetingId: number;
	status: ValueOf<typeof MeetingStatus>;
};

export { type MeetingStatusDto };
