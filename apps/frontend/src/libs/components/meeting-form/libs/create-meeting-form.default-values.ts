import { MeetingHost } from "@meetlytic/shared";

import { type MeetingCreateRequestDto } from "~/libs/types/types.js";

const CREATE_MEETING_FORM_DEFAULT_VALUES: MeetingCreateRequestDto = {
	host: MeetingHost.ZOOM,
	instanceId: "",
};

export { CREATE_MEETING_FORM_DEFAULT_VALUES };
