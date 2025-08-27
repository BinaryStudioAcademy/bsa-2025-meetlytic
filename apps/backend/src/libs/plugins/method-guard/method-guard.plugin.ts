import { type FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";

import { ExceptionMessage, ServerErrorType } from "~/libs/enums/enums.js";
import { HTTPCode } from "~/libs/modules/http/http.js";

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
		const rawUrl = request.raw.url ?? "";
		const upgradeHeader = request.headers.upgrade?.toLowerCase();

		const isWebSocket = upgradeHeader === "websocket";
		const isSocketIO = rawUrl.startsWith("/socket.io");

		if (isWebSocket || isSocketIO) {
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

		const { isMethodAllowed, isRouteFound } = matchRoute(
			url,
			method,
			allRoutes,
		);

		if (!isRouteFound) {
			return response.status(HTTPCode.NOT_FOUND).send({
				errorType: ServerErrorType.COMMON,
				message: ExceptionMessage.ROUTE_NOT_FOUND,
			});
		}

		if (!isMethodAllowed) {
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
