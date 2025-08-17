import { s3Instance } from "~/libs/modules/aws/s3.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { FileModel } from "../files/file.model.js";
import { FileRepository } from "../files/file.repository.js";
import { FileService } from "../files/file.service.js";
import { UserAvatarService } from "./user-avatar.service.js";
import { UserDetailsModel } from "./user-details.model.js";
import { UserDetailsRepository } from "./user-details.repository.js";
import { UserController } from "./user.controller.js";
import { UserModel } from "./user.model.js";
import { UserRepository } from "./user.repository.js";
import { UserService } from "./user.service.js";

const fileRepository = new FileRepository({
	fileModel: FileModel,
	userDetailsModel: UserDetailsModel,
});
const userRepository = new UserRepository(UserModel);
const userDetailsRepository = new UserDetailsRepository(UserDetailsModel);
const fileService = new FileService({ fileRepository });

const userService = new UserService(
	userRepository,
	userDetailsRepository,
	fileService,
);
const userAvatarService = new UserAvatarService(
	fileService,
	userService,
	s3Instance,
);

const userController = new UserController({
	fileService,
	logger,
	userAvatarService,
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
