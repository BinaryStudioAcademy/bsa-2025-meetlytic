import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";
import { type UserResponseDto } from "~/modules/users/users.js";

type FindAllMeetingOptions = APIHandlerOptions<{
	user: UserResponseDto;
}>;

export { type FindAllMeetingOptions };
