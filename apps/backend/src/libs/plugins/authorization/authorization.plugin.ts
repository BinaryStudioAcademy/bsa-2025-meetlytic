import { type FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";

import { type Config } from "~/libs/modules/config/config.js";
import { HTTPCode, HTTPError } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type BaseToken } from "~/libs/modules/token/base-token.module.js";
import { type JwtPayload } from "~/libs/modules/token/libs/types/types.js";
import { type UserSignUpResponseDto } from "~/modules/users/libs/types/types.js";
import { type UserService } from "~/modules/users/user.service.js";

declare module "fastify" {
	interface FastifyRequest {
		user?: null | UserSignUpResponseDto;
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
			const { url } = request;

			if (routesWhiteList.includes(url)) {
				return;
			}

			const authorizationHeader = request.headers.authorization;

			if (!authorizationHeader) {
				throw new HTTPError({
					message: "No authorization header.",
					status: HTTPCode.UNAUTHORIZED,
				});
			}

			const [, token] = authorizationHeader.split(" ");

			if (!token) {
				throw new HTTPError({
					message: "No token provided.",
					status: HTTPCode.UNAUTHORIZED,
				});
			}

			try {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const { payload } = await jwt.verify(token);

				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				const userId = payload.userId;

				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				const user = await userService.findById(userId);

				if (!user) {
					throw new HTTPError({
						message: "User not found.",
						status: HTTPCode.UNAUTHORIZED,
					});
				}

				request.user = user;
			} catch (error: unknown) {
				if (error instanceof Error) {
					logger.error(`[Authorization Error]: ${error.message}`);
				} else {
					logger.error("[Authorization Error]: An unknown error occurred");
				}

				throw new HTTPError({
					message: "Invalid token.",
					status: HTTPCode.UNAUTHORIZED,
				});
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