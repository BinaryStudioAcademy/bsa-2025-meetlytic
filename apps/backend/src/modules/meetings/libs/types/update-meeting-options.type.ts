import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";

import { type MeetingUpdateRequestDto } from "./types.js";

type UpdateMeetingOptions = APIHandlerOptions<{
	body: MeetingUpdateRequestDto;
	params: { id: string };
}>;

export { type UpdateMeetingOptions };
