import { MeetingHost } from "~/libs/enums/enums.js";
import { type MeetingCreateRequestDto } from "~/modules/meeting/meeting.js";

const CREATE_MEETING_FORM_DEFAULT_VALUES: MeetingCreateRequestDto = {
	host: MeetingHost.ZOOM,
	meetingLink: "",
	meetingPassword: "",
};

export { CREATE_MEETING_FORM_DEFAULT_VALUES };
