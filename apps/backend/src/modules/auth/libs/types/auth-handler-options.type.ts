import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";
import { type UserResponseDto } from "~/modules/users/libs/types/types.js";

type AuthHandlerOptions = APIHandlerOptions & {
	user: UserResponseDto;
};

export { type AuthHandlerOptions };
