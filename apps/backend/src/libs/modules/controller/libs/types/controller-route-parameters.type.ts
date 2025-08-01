import { type preHandlerHookHandler } from "fastify";

import { type HTTPMethod } from "~/libs/modules/http/http.js";
import { type ValidationSchema } from "~/libs/types/types.js";

import { type APIHandler } from "./api-handler.type.js";

type ControllerRouteParameters = {
	handler: APIHandler;
	method: HTTPMethod;
	path: string;
	preHandlers?: preHandlerHookHandler | preHandlerHookHandler[] | undefined;
	validation?: {
		body?: ValidationSchema;
	};
};

export { type ControllerRouteParameters };
