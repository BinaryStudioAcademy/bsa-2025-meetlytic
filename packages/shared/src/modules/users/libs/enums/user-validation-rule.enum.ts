const UserValidationRule = {
	EMAIL_MINIMUM_LENGTH: 1,
	FIRST_NAME_MINIMUM_LENGTH: 1,
	LAST_NAME_MINIMUM_LENGTH: 1,
	PASSWORD_MINIMUM_LENGTH: 8,
} as const;

export { UserValidationRule };
