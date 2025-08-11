const validAuthenticatedUserSchema = {
	properties: {
		email: { format: 'email', type: 'string' },
		id: { type: 'number' },
	},
	required: ['email', 'id'],
	type: 'object',
};

export { validAuthenticatedUserSchema };
