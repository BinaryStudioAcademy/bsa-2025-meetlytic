const ZoomBotMessage = {
	AUDIO_RECORDING_STARTED: "Audio recording started.",
	AUDIO_RECORDING_STOPPED: "Audio recording stopped.",
	COOKIES_ACCEPTED: "Cookies accepted.",
	FAILED_TO_ACCEPT_COOKIES: "Failed to accept cookies: ",
	FAILED_TO_ACCEPT_TERMS: "Failed to accept terms and conditions: ",
	FAILED_TO_CLICK_SELECTOR: "Failed to click selector",
	FAILED_TO_ENTER_PASSWORD: "Failed to enter password:",
	FAILED_TO_FINALIZE_AUDIO_RECORDING: "Failed to finalize audio recording:",
	FAILED_TO_GET_PARTICIPANTS_COUNT: "Failed to get participants count:",
	FAILED_TO_JOIN_MEETING: "Failed to join the meeting:",
	FAILED_TO_LEAVE_MEETING: "Failed to leave meeting:",
	FOUND_PASSCODE: "Passcode extracted from link:",
	JOINED_MEETING: "Joined Zoom meeting successfully",
	JOINING_MEETING: "is joining the meeting...",
	LEFT_MEETING: "Bot has left the meeting.",
	NAVIGATION_TO_ZOOM: "Navigating to Zoom meeting:",
	ONLY_ONE_PARTICIPANT_DETECTED: "Only 1 participant detected. Leaving...",
	PAGE_NOT_INITIALIZED: "Page not initialized.",
	SPINNER_NOT_FOUND: "Spinner not found or already removed.",
	TERM_AND_CONDITIONS_ACCEPTED: "Terms and conditions accepted.",
	ZOOM_MEETING_ID_MISSING:
		"Zoom meeting ID is missing in environment variables.",
	ZOOM_PASSWORD_NOT_FOUND:
		"No passcode found in link, joining meeting without password",
} as const;

export { ZoomBotMessage };
