const NotificationMessage = {
	AUTH_FAILED: "Authentication failed. Please log in again.",
	EDIT_PROFILE_SUCCESS: "Profile was edited successfully",
	MEETING_DATA_IS_NOT_AVAILABLE: "Meeting data is not available for sharing.",
	MEETING_DETAILS_FETCH_FAILED: "Failed to load meeting details.",
	PUBLIC_LINK_COPIED_SUCCESS: "Public link copied to clipboard.",
	SHARE_LINK_GENERATION_FAILED: "Failed to generate share link.",
	SIGN_IN_FAILED:
		"We couldn't sign you in. Please check your email and password.",
	SIGN_UP_FAILED: "Something went wrong during sign up. Please try again.",
} as const;

export { NotificationMessage };
