import {
	type FastifyReply,
	type FastifyRequest,
	type preHandlerHookHandler,
} from "fastify";

import { type HTTPMethod } from "~/libs/modules/http/http.js";
import { type ValidationSchema, type ValueOf } from "~/libs/types/types.js";

type ServerApplicationRouteParameters = {
	handler: (
		request: FastifyRequest,
		reply: FastifyReply,
	) => Promise<void> | void;
	method: ValueOf<typeof HTTPMethod>;
	path: string;
	preHandlers?: preHandlerHookHandler[];
	validation?: {
		body?: ValidationSchema;
		headers?: ValidationSchema;
		params?: ValidationSchema;
		querystring?: ValidationSchema;
	};
};

export { type ServerApplicationRouteParameters };
