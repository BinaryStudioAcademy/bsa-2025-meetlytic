const UserErrorMessage = {
	DETAILS_NOT_FOUND: "User details not found",
	USER_EMAIL_IN_USE:
		"This email address is already associated with another account.",
	USER_NOT_FOUND: "We couldn't find an account with this email address.",
	USER_NOT_PROVIDED: "User not provided",
	USER_REQUIRED: "User is required",
} as const;

export { UserErrorMessage };
