import { logger } from "~/libs/modules/logger/logger.js";

import { UserDetailsModel } from "./user-details.model.js";
import { UserDetailsRepository } from "./user-details.repository.js";
import { UserController } from "./user.controller.js";
import { UserModel } from "./user.model.js";
import { UserRepository } from "./user.repository.js";
import { UserService } from "./user.service.js";

const userRepository = new UserRepository(UserModel);
const userDetailsRepository = new UserDetailsRepository(UserDetailsModel);
const userService = new UserService(userRepository, userDetailsRepository);
const userController = new UserController(logger, userService);

export { userController, userService };
export {
	type AuthResponseDto,
	type UserSignUpRequestDto,
} from "./libs/types/types.js";
export { userSignUpValidationSchema } from "./libs/validation-schemas/validation-schemas.js";
