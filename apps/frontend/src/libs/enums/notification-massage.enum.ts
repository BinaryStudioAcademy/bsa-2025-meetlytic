const NotificationMessage = {
	AUTH_FAILED: "Authentication failed. Please log in again.",
	EDIT_PROFILE_FAILED: "Failed to edit profile",
	EDIT_PROFILE_SUCCESS: "Profile was edited successfully",
	SIGN_IN_FAILED:
		"We couldn't sign you in. Please check your email and password.",
	SIGN_UP_FAILED: "Something went wrong during sign up. Please try again.",
} as const;

export { NotificationMessage };
