import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";
import { type UserResponseDto } from "~/modules/users/users.js";

import { type MeetingCreateRequestDto } from "./types.js";

type CreateMeetingOptions = APIHandlerOptions<{
	body: MeetingCreateRequestDto;
	user: UserResponseDto;
}>;

export { type CreateMeetingOptions };
