import { type FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";

import { type WhiteRoute } from "~/libs/constants/libs/types/types.js";
import { FastifyHook } from "~/libs/enums/enums.js";
import { AuthError } from "~/libs/exceptions/exceptions.js";
import { type Config } from "~/libs/modules/config/config.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type BaseToken, type JwtPayload } from "~/libs/modules/token/token.js";
import { type UserService } from "~/modules/users/user.service.js";

type Options = {
	routesWhiteList: WhiteRoute[];
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

		fastify.addHook(FastifyHook.PRE_HANDLER, async (request) => {
			const { method, url } = request;

			if (/^\/api\/v\d+\/documentation/.test(url)) {
				return;
			}

			const apiPrefixRegex = /^\/api\/v\d+(?:\/|$)/;

			if (!apiPrefixRegex.test(url)) {
				return;
			}

			const endpointToCompare = url.replace(apiPrefixRegex, "/");

			const isWhiteRoute = routesWhiteList.some((whiteRoute) => {
				return (
					method.toUpperCase() === whiteRoute.method.toUpperCase() &&
					(whiteRoute.path instanceof RegExp
						? whiteRoute.path.test(endpointToCompare)
						: endpointToCompare === whiteRoute.path)
				);
			});

			if (isWhiteRoute) {
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

				const user = await userService.find(payload.userId);

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
		dependencies: [],
		name: "authorization",
	},
);

export { authorizationPlugin };
