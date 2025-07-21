type APIHandlerOptions<
	T extends Partial<DefaultApiHandlerOptions> &
		Record<string, unknown> = DefaultApiHandlerOptions,
> = Omit<T, keyof DefaultApiHandlerOptions> & {
	body: T["body"];
	params: T["params"];
	query: T["query"];
};
type DefaultApiHandlerOptions = {
	body?: unknown;
	params?: unknown;
	query?: unknown;
};

export { type APIHandlerOptions };
