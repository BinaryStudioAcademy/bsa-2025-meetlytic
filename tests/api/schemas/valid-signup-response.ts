const validsignUpSchema = {
	properties: {
		token: { type: 'string' },
		user: {
			properties: {
				email: { format: 'email', type: 'string' },
				id: { type: 'number' },
			},
			required: ['email', 'id'],
			type: 'object',
		},
	},
	required: ['token', 'user'],
	type: 'object',
};

export { validsignUpSchema };
