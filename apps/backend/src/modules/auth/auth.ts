import { logger } from "~/libs/modules/logger/logger.js";

import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";

const authService = new AuthService();
const authController = new AuthController(logger, authService);

export { authController };
