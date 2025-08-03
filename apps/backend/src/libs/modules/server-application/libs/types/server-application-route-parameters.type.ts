import {
	type FastifyReply,
	type FastifyRequest,
	type preHandlerHookHandler,
} from "fastify";

import { type HTTPMethod } from "~/libs/modules/http/http.js";
import { type ValidationSchema } from "~/libs/types/types.js";

type ServerApplicationRouteParameters = {
	handler: (
		request: FastifyRequest,
		reply: FastifyReply,
	) => Promise<void> | void;
	method: HTTPMethod;
	path: string;
	preHandlers?: preHandlerHookHandler | preHandlerHookHandler[] | undefined;
	validation?: {
		body?: ValidationSchema;
		headers?: ValidationSchema;
		params?: ValidationSchema;
		querystring?: ValidationSchema;
	};
};

export { type ServerApplicationRouteParameters };
