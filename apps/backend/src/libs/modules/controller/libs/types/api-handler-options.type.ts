import { type FastifyRequest } from "fastify";

type APIHandlerOptions<
	T extends DefaultApiHandlerOptions = DefaultApiHandlerOptions,
> = {
	body: T["body"];
	params: T["params"];
	query: T["query"];
	request: FastifyRequest;
	user: T["user"];
};

type DefaultApiHandlerOptions = {
	body?: unknown;
	params?: unknown;
	query?: unknown;
	request?: unknown;
	user?: unknown;
};

export { type APIHandlerOptions };
