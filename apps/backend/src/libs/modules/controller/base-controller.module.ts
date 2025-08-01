import { type FastifyReply, type FastifyRequest } from "fastify";

import { ValidationError } from "~/libs/exceptions/exceptions.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type ServerApplicationRouteParameters } from "~/libs/modules/server-application/server-application.js";

import {
	type APIHandler,
	type APIHandlerOptions,
	type Controller,
	type ControllerRouteParameters,
} from "./libs/types/types.js";

class BaseController implements Controller {
	private apiUrl: string;

	private logger: Logger;

	public routes: ServerApplicationRouteParameters[];

	public constructor(logger: Logger, apiPath: string) {
		this.logger = logger;
		this.apiUrl = apiPath;
		this.routes = [];
	}

	private async mapHandler(options: {
		handler: APIHandler;
		reply: FastifyReply;
		request: FastifyRequest;
		validation?: ControllerRouteParameters["validation"];
	}): Promise<void> {
		const { handler, reply, request, validation } = options;
		this.logger.info(`${request.method.toUpperCase()} on ${request.url}`);

		try {
			if (validation?.body) {
				request.body = await validation.body.parseAsync(request.body);
			}
		} catch (error) {
			if (error instanceof ValidationError) {
				return await reply
					.status(HTTPCode.BAD_REQUEST)
					.send({ errors: error.errors });
			}

			throw error;
		}

		const handlerOptions = this.mapRequest(request);
		const { payload, status } = await handler(handlerOptions);

		return await reply.status(status).send(payload);
	}

	private mapRequest(request: FastifyRequest): APIHandlerOptions {
		const { body, params, query, user } = request;

		return {
			body,
			params,
			query,
			user,
		};
	}

	public addRoute(options: ControllerRouteParameters): void {
		const { handler, path, preHandlers, validation } = options;
		const fullPath = this.apiUrl + path;

		this.routes.push({
			...options,
			handler: (request, reply) =>
				this.mapHandler({ handler, reply, request, validation }),
			path: fullPath,
			preHandlers: preHandlers,
		});
	}
}

export { BaseController };
