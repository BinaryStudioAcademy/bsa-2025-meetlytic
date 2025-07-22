type Repository<T = unknown> = {
	create(payload: unknown): Promise<T>;
	delete(id: number): Promise<boolean>;
	find(id: number): Promise<null | T>;
	findAll(): Promise<T[]>;
	update(): Promise<T>;
};

export { type Repository };
