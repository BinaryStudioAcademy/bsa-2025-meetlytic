const MeetingErrorMessage = {
	CANNOT_UPDATE_NON_EXISTENT: "Meeting was not found",
	DELETE_FAILED: "Failed to delete meeting",
	FORBIDDEN: "Access denied",
	MEETING_FAILED_TO_CREATE: "Failed to create a meeting",
	MEETING_NOT_FOUND: "Meeting not found",
	UPDATE_FAILED: "Failed to update meeting",
} as const;

export { MeetingErrorMessage };
