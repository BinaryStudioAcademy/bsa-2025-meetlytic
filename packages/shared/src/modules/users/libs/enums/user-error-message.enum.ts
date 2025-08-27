const UserErrorMessage = {
	AVATAR_DELETED_SUCCESSFULLY: "Avatar deleted successfully",
	AVATAR_DELETION_FAILED: "Failed to delete avatar",
	AVATAR_NOT_SET: "Avatar not set",
	AVATAR_UPLOAD_FAILED: "Failed to upload avatar",
	BUCKET_NOT_DEFINED: "BUCKET_NAME is not defined",
	DETAILS_NOT_FOUND: "User details not found",
	FILE_RECORD_CREATION_FAILED: "Failed to create file record",
	FILE_TOO_LARGE: "File too large.",
	INVALID_FILE_TYPE:
		"Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed",
	USER_EMAIL_IN_USE:
		"This email address is already associated with another account.",
	USER_NOT_FOUND: "We couldn't find an account with this email address.",
	USER_NOT_PROVIDED: "User not provided",
	USER_REQUIRED: "User is required",
} as const;

export { UserErrorMessage };
