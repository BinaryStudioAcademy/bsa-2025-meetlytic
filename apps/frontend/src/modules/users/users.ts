import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";

import { UsersApi } from "./users.api.js";

const userApi = new UsersApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { userApi };
export {
	type UserResponseDto,
	type UserSignInRequestDto,
	type UserSignUpRequestDto,
	type UserUpdateResponseDto,
	type UserWithDetailsDto,
} from "./libs/types/types.js";
export {
	userSignInValidationSchema,
	userSignUpValidationSchema,
	userUpdateValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";
export { actions, reducer } from "./slices/users.js";
