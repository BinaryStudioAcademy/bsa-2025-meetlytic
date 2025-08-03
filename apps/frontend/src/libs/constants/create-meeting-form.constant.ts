import { MeetingHost } from "~/libs/enums/enums.js";
import { type MeetingCreateRequestDto } from "~/libs/types/types.js";

const CREATE_MEETING_FORM_DEFAULT_VALUES: MeetingCreateRequestDto = {
	host: MeetingHost.ZOOM,
	instanceId: "",
	meetingId: "",
	meetingPassword: "",
};

export { CREATE_MEETING_FORM_DEFAULT_VALUES };
