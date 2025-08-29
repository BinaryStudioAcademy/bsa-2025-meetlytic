import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";

import {
	type UserResponseDto,
	type UserUpdateResponseDto,
} from "../../libs/types/types.js";

type UpdateProfileOptions = APIHandlerOptions<{
	body: UserUpdateResponseDto;
	user: UserResponseDto;
}>;

export { type UpdateProfileOptions };
