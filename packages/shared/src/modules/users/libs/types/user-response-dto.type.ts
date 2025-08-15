type UserResponseDto = {
	details?: null | {
		avatarFile?: null | {
			key: string;
			url: string;
		};
		id: number;
	};
	email: string;
	firstName?: string;
	id: number;
	lastName?: string;
};

export { type UserResponseDto };
