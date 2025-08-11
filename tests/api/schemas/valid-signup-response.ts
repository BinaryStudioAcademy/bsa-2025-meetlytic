export const validsignUpSchema = {
	type: 'object',
	properties: {
		token: { type: 'string' },
		user: {
			type: 'object',
			properties: {
				email: { type: 'string', format: 'email' },
				id: { type: 'number' },
			},
			required: ['email', 'id'],
		},
	},
	required: ['token', 'user'],
};
