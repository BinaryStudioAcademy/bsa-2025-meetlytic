import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { UserAvatarService } from "./user-avatar.service.js";
import { UserDetailsModel } from "./user-details.model.js";
import { UserDetailsRepository } from "./user-details.repository.js";
import { UserController } from "./user.controller.js";
import { UserModel } from "./user.model.js";
import { UserRepository } from "./user.repository.js";
import { UserService } from "./user.service.js";

const userRepository = new UserRepository(UserModel);
const userDetailsRepository = new UserDetailsRepository(UserDetailsModel);
const userService = new UserService(userRepository, userDetailsRepository);
const userAvatarService = new UserAvatarService(config);
const userController = new UserController(
	logger,
	userService,
	userAvatarService,
);

export { userController, userService };
export {
	type AuthResponseDto,
	type UserResponseDto,
	type UserSignInRequestDto,
	type UserSignUpRequestDto,
} from "./libs/types/types.js";
export {
	userSignInValidationSchema,
	userSignUpValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";
