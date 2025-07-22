import { type FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";

import { type Config } from "~/libs/modules/config/config.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type BaseToken } from "~/libs/modules/token/base-token.module.js";
import { type JwtPayload } from "~/libs/modules/token/libs/types/types.js";
import { AuthError } from "~/modules/auth/libs/exceptions/auth.error.js";
import { type UserResponseDto } from "~/modules/users/libs/types/types.js";
import { type UserService } from "~/modules/users/user.service.js";

declare module "fastify" {
	interface FastifyRequest {
		user?: null | UserResponseDto;
	}
}

type Options = {
	routesWhiteList: string[];
	services: {
		config: Config;
		jwt: BaseToken<JwtPayload>;
		logger: Logger;
		userService: UserService;
	};
};

const authorizationPlugin: FastifyPluginCallback<Options> = fp(
	(fastify, options: Options, done) => {
		const { routesWhiteList, services } = options;
		const { jwt, logger, userService } = services;

		fastify.decorateRequest("user", null);

		fastify.addHook("preHandler", async (request) => {
			const { method, url } = request;

			const routeToCheck = `${method.toUpperCase()} ${url}`;

			if (routesWhiteList.includes(routeToCheck)) {
				return;
			}

			const authorizationHeader = request.headers.authorization;

			if (!authorizationHeader) {
				throw new AuthError();
			}

			const [, token] = authorizationHeader.split(" ");

			if (!token) {
				throw new AuthError();
			}

			try {
				const { payload } = await jwt.verify(token);

				const userId = payload.userId;

				const user = await userService.find(userId);

				if (!user) {
					throw new AuthError();
				}

				request.user = user;
			} catch (error: unknown) {
				if (error instanceof Error) {
					logger.error(`[Authorization Error]: ${error.message}`);
				} else {
					logger.error("[Authorization Error]: An unknown error occurred");
				}

				throw new AuthError();
			}
		});

		done();
	},
	{
		dependencies: ["config", "logger"],
		name: "authorization",
	},
);

export { authorizationPlugin };
