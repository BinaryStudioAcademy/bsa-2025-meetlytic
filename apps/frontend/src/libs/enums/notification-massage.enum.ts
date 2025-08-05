const NotificationMessage = {
	AUTH_FAILED: "Authentication failed. Please log in again.",
	AVATAR_DELETE_FAILED: "Failed to delete avatar. Please try again.",
	AVATAR_UPLOAD_FAILED: "Failed to upload avatar. Please try again.",
	SIGN_IN_FAILED:
		"We couldn't sign you in. Please check your email and password.",
	SIGN_UP_FAILED: "Something went wrong during sign up. Please try again.",
} as const;

export { NotificationMessage };
