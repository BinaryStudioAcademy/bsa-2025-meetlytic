export const validAuthenticatedUserSchema = {
	type: 'object',
	properties: {
		email: { type: 'string', format: 'email' },
		id: { type: 'number' },
	},
	required: ['email', 'id'],
};
