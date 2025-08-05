import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";

import { type MeetingCreateRequestDto } from "./types.js";

type CreateMeetingOptions = APIHandlerOptions<{
	body: MeetingCreateRequestDto;
}>;

export { type CreateMeetingOptions };
