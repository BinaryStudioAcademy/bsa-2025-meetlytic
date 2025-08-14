import { logger } from "~/libs/modules/logger/logger.js";
import { jwt } from "~/libs/modules/token/token.js";
import { userService } from "~/modules/users/users.js";

import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";

const authService = new AuthService(userService, jwt);
const authController = new AuthController(logger, authService);

export { authController };
