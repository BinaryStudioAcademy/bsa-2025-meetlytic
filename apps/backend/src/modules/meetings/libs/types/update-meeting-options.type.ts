import { APIHandlerOptions } from "~/libs/modules/controller/controller.js";

import { MeetingUpdateRequestDto } from "./types.js";

type UpdateMeetingOptions = APIHandlerOptions<{
	body: MeetingUpdateRequestDto;
	params: { id: string };
}>;

export { UpdateMeetingOptions };
