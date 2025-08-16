const ZoomBotMessages = {
	AUDIO_RECORDING_STARTED: "Audio recording started.",
	AUDIO_RECORDING_STOPPED: "Audio recording stopped.",
	COMPLETE_ENTER_EMAIL_STEP: "Complete enter email step.",
	COMPLETE_ENTER_PASSWORD_STEP: "Complete enter password step.",
	COOKIES_ACCEPTED: "Cookies accepted.",
	FAILED_TO_ACCEPT_COOKIES: "Failed to accept cookies: ",
	FAILED_TO_ACCEPT_TERMS: "Failed to accept terms and conditions: ",
	FAILED_TO_CLICK_SELECTOR: "Failed to click selector",
	FAILED_TO_ENTER_PASSWORD: "Failed to enter password:",
	FAILED_TO_GET_PARTICIPANTS_COUNT: "Failed to get participants count:",
	FAILED_TO_JOIN_MEETING: "Failed to join the meeting:",
	FAILED_TO_LEAVE_MEETING: "Failed to leave meeting:",
	FAILED_TO_LOGIN:
		"Failed to authenticate to Zoom (check credentials or 2FA/SSO)",
	FOUND_PASSCODE: "Passcode extracted from link:",
	GO_TO_SIGN_IN_PAGE: "Navigating to Zoom login page:",
	JOINED_MEETING: "Joined Zoom meeting successfully",
	JOINING_MEETING: "is joining the meeting...",
	LOGIN_EMAIL_INPUT_NOT_FOUND: "Login email input not found.",
	LOGIN_PASSWORD_INPUT_NOT_FOUND: "Login password input not found.",
	NAVIGATION_TO_ZOOM: "Navigating to Zoom meeting:",
	ONLY_ONE_PARTICIPANT_DETECTED: "Only 1 participant detected. Leaving...",
	PAGE_NOT_INITIALIZED: "Page not initialized.",
	SKIP_AUTHENTICATE_STEP: "skipping authenticate step.",
	SPINNER_NOT_FOUND: "Spinner not found or already removed.",
	START_ENTER_EMAIL_STEP: "Start enter email step.",
	START_ENTER_PASSWORD_STEP: "Start enter password step.",
	TERM_AND_CONDITIONS_ACCEPTED: "Terms and conditions accepted.",
	ZOOM_MEETING_ID_MISSING:
		"Zoom meeting ID is missing in environment variables.",
	ZOOM_PASSWORD_NOT_FOUND:
		"No passcode found in link, joining meeting without password",
} as const;

export { ZoomBotMessages };
