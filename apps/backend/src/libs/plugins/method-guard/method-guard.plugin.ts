import { type FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";

import { ExceptionMessage, ServerErrorType } from "~/libs/enums/enums.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { matchRoute } from "./libs/match-route.js";

type Options = {
	allRoutes: { method: string; path: string }[];
};

const methodGuardCallback: FastifyPluginCallback<Options> = (
	fastify,
	options,
	done,
) => {
	fastify.addHook("onRequest", (request, response, next) => {
		const isWebSocket =
			request.headers.upgrade &&
			request.headers.upgrade.toLowerCase() === "websocket";
		logger.info(isWebSocket as string);
		const rawUrl = request.raw.url ?? "";
		logger.info(request.raw.url as string);

		if (rawUrl.startsWith("/socket.io")) {
			next();
		}

		const { allRoutes } = options;
		const method = request.method.toUpperCase();
		const [url] = response.request.url.split("?");

		if (!url) {
			return response.status(HTTPCode.NOT_FOUND).send({
				errorType: ServerErrorType.COMMON,
				message: ExceptionMessage.ROUTE_NOT_FOUND,
			});
		}

		const { found, methodAllowed } = matchRoute(url, method, allRoutes);

		if (!found) {
			return response.status(HTTPCode.NOT_FOUND).send({
				errorType: ServerErrorType.COMMON,
				message: ExceptionMessage.ROUTE_NOT_FOUND,
			});
		}

		if (!methodAllowed) {
			return response.status(HTTPCode.METHOD_NOT_ALLOWED).send({
				errorType: ServerErrorType.COMMON,
				message: ExceptionMessage.METHOD_NOT_ALLOWED,
			});
		}

		next();
	});

	done();
};

const methodGuard = fp(methodGuardCallback, {
	name: "methodGuardPlugin",
});

export { methodGuard };
