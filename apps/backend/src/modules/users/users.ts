import { s3Instance } from "~/libs/modules/aws/s3.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { FileModel } from "../files/file.model.js";
import { FileRepository } from "../files/files.repository.js";
import { FileService } from "../files/files.service.js";
import { UserDetailsModel } from "./user-details.model.js";
import { UserDetailsRepository } from "./user-details.repository.js";
import { UserController } from "./user.controller.js";
import { UserModel } from "./user.model.js";
import { UserRepository } from "./user.repository.js";
import { UserService } from "./user.service.js";

const fileRepository = new FileRepository(FileModel);
const userRepository = new UserRepository(UserModel);
const userDetailsRepository = new UserDetailsRepository(UserDetailsModel);
const fileService = new FileService({
	fileRepository,
});

const userService = new UserService({
	fileService,
	s3: s3Instance,
	userDetailsModel: UserDetailsModel,
	userDetailsRepository,
	userRepository,
});

const userController = new UserController({
	fileService,
	logger,
	userService,
});

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
