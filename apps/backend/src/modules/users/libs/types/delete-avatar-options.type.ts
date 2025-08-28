import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";

import { type UserResponseDto } from "../../libs/types/types.js";

type DeleteAvatarOptions = APIHandlerOptions<{
	user: UserResponseDto;
}>;

export { type DeleteAvatarOptions };
