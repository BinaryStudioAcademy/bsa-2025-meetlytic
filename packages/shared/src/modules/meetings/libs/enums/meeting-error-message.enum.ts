const MeetingErrorMessage = {
	CANNOT_UPDATE_NON_EXISTENT: "Meeting was not found",
	DELETE_FAILED: "Failed to delete meeting",
	DUPLICATED_MEETING:
		"This link has already been used. Please send a unique link to the meeting.",
	FORBIDDEN: "Access denied",
	INVALID_MEETING_LINK: "Invalid Zoom meeting link",
	JOIN_THE_MEETING: "Failed to join a meeting, trying again",
	MEETING_ACTION_ITEMS_NOT_AVAILABLE: "Meeting action items not available",
	MEETING_FAILED_TO_CREATE: "Failed to create a meeting",
	MEETING_NOT_FOUND: "Meeting not found",
	MEETING_SUMMARY_NOT_AVAILABLE: "Meeting summary not available.",
	SEARCH_NOT_EMPTY: "Search input cannot be empty.",
	UPDATE_FAILED: "Failed to update meeting",
} as const;

export { MeetingErrorMessage };
