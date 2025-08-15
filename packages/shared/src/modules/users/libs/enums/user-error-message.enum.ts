const UserErrorMessage = {
	AVATAR_NOT_SET: "Avatar not set",
	AVATAR_UPLOAD_FAILED: "Failed to upload avatar",
	DETAILS_NOT_FOUND: "User details not found",
	FILE_RECORD_CREATION_FAILED: "Failed to create file record",
	USER_EMAIL_IN_USE:
		"This email address is already associated with another account.",
	USER_NOT_FOUND: "We couldn't find an account with this email address.",
} as const;

export { UserErrorMessage };
