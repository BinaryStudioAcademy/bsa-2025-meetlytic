import { type FastifyReply, type FastifyRequest } from "fastify";

import { ExceptionMessage, ServerErrorType } from "~/libs/enums/enums.js";
import { HTTPCode } from "~/libs/modules/http/http.js";

import { type ServerApplicationApi } from "../types/types.js";

function createNotFoundHandler(
	apis: ServerApplicationApi[],
	staticPath: string,
) {
	return async function notFoundHandler(
		_request: FastifyRequest,
		response: FastifyReply,
	): Promise<FastifyReply> {
		const method = response.request.method;
		const [url] = response.request.url.split("?");
		const allRoutes = apis.flatMap((api) => api.routes);
		const hasPath = allRoutes.some((route) => route.path === url);
		const hasMethod = allRoutes.some(
			(route) =>
				route.path === url &&
				route.method.toUpperCase() === method.toUpperCase(),
		);

		if (!hasPath) {
			return await response.status(HTTPCode.NOT_FOUND).send({
				errorType: ServerErrorType.COMMON,
				message: ExceptionMessage.ROUTE_NOT_FOUND,
			});
		}

		if (!hasMethod) {
			return await response.status(HTTPCode.METHOD_NOT_ALLOWED).send({
				errorType: ServerErrorType.COMMON,
				message: ExceptionMessage.METHOD_NOT_ALLOWED,
			});
		}

		return await response.sendFile("index.html", staticPath);
	};
}

export { createNotFoundHandler };
