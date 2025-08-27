import { type FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";

import { ExceptionMessage, FastifyHook } from "~/libs/enums/enums.js";
import { HTTPCode, HTTPError } from "~/libs/modules/http/http.js";

import { matchRoute } from "./libs/match-route.js";

type Options = {
	allRoutes: { method: string; path: string }[];
};

const methodGuardCallback: FastifyPluginCallback<Options> = (
	fastify,
	options,
	done,
) => {
	fastify.addHook(FastifyHook.ON_REQUEST, (request, response, next) => {
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
			throw new HTTPError({
				message: ExceptionMessage.ROUTE_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const { isMethodAllowed, isRouteFound } = matchRoute(
			url,
			method,
			allRoutes,
		);

		if (!isRouteFound) {
			throw new HTTPError({
				message: ExceptionMessage.ROUTE_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		if (!isMethodAllowed) {
			throw new HTTPError({
				message: ExceptionMessage.METHOD_NOT_ALLOWED,
				status: HTTPCode.METHOD_NOT_ALLOWED,
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
