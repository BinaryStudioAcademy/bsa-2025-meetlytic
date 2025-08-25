const ZoomBotMessage = {
	AUDIO_RECORDING_STARTED: "Audio recording started.",
	AUDIO_RECORDING_STOPPED: "Audio recording stopped.",
	BOT_CHAT_MESSAGE:
		"Hello! This meeting is being recorded by Meetlytic AI Bot. To check the meeting transcription you can follow the link:",
	COOKIES_ACCEPTED: "Cookies accepted.",
	FAILED_TO_ACCEPT_COOKIES: "Failed to accept cookies: ",
	FAILED_TO_ACCEPT_TERMS: "Failed to accept terms and conditions: ",
	FAILED_TO_CLICK_SELECTOR: "Failed to click selector",
	FAILED_TO_ENTER_PASSWORD: "Failed to enter password:",
	FAILED_TO_FINALIZE_AUDIO_RECORDING: "Failed to finalize audio recording:",
	FAILED_TO_GET_PARTICIPANTS_COUNT: "Failed to get participants count:",
	FAILED_TO_JOIN_MEETING: "Failed to join the meeting:",
	FAILED_TO_LEAVE_MEETING: "Failed to leave meeting:",
	FAILED_TO_SEND_MESSAGE_TO_CHAT:
		"Failed to send meeting public url to the chat",
	FOUND_PASSCODE: "Passcode extracted from link:",
	GENERATING_SUMMARY_ACTION_ITEMS:
		"Generating summary/action items of the meeting",
	GETTING_PUBLIC_URL: "Getting public URL",
	JOINED_MEETING: "Joined Zoom meeting successfully",
	JOINING_MEETING: "is joining the meeting...",
	LEFT_MEETING: "Bot has left the meeting.",
	NAVIGATION_TO_ZOOM: "Navigating to Zoom meeting:",
	ONLY_ONE_PARTICIPANT_DETECTED: "Only 1 participant detected. Leaving...",
	PAGE_NOT_INITIALIZED: "Page not initialized.",
	SENDING_PUBLIC_URL: "Sending public url for the meeting",
	SPINNER_NOT_FOUND: "Spinner not found or already removed.",
	STOPPING_RECORDING: "Stopping recording of the meeting",
	TERM_AND_CONDITIONS_ACCEPTED: "Terms and conditions accepted.",
	ZOOM_MEETING_ID_MISSING:
		"Zoom meeting ID is missing in environment variables.",
	ZOOM_PASSWORD_NOT_FOUND:
		"No passcode found in link, joining meeting without password",
} as const;

export { ZoomBotMessage };
