import { APIHandlerOptions } from "~/libs/modules/controller/controller.js";

import { MeetingCreateRequestDto } from "./types.js";

type CreateMeetingOptions = APIHandlerOptions<{
	body: MeetingCreateRequestDto;
}>;

export { CreateMeetingOptions };
