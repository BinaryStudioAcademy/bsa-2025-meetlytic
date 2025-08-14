const UserAvatarErrorMessage = {
	BUCKET_NOT_DEFINED: "BUCKET_NAME is not defined",
	FILE_TOO_LARGE: "File too large.",
	INVALID_FILE_TYPE:
		"Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed",
} as const;

export { UserAvatarErrorMessage };
