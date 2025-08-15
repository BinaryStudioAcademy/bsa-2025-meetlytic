type UserWithDetailsDto = {
	details?: {
		avatarFile?: null | { key: string; url: string };
	};
	email: string;
	firstName: string;
	id: number;
	lastName: string;
};

export { type UserWithDetailsDto };
