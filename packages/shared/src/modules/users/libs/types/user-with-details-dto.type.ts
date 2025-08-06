type UserWithDetailsDto = {
	details: null | {
		firstName: string;
		id: number;
		lastName: string;
		userId: number;
	};
	user: {
		email: string;
		id: number;
	};
};

export { type UserWithDetailsDto };
