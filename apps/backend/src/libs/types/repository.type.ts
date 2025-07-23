type Repository<T = unknown> = {
	create(payload: unknown): Promise<T>;
	delete(id: number): Promise<boolean>;
	find(id: number): Promise<null | T>;
	findAll(): Promise<T[]>;
	update(
		id: number,
		payload: Partial<Record<string, unknown>>,
	): Promise<null | T>;
};

export { type Repository };
