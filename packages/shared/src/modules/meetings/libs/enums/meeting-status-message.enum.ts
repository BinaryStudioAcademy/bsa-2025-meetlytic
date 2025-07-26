const MeetingStatusMessage = {
	CANNOT_UPDATE_NON_EXISTENT: "Cannot update non-existent meeting with ID",
	FORBIDDEN: "Access denied",
	MEETING_FAILED_TO_CREATE: "Failed to create a meeting",
	MEETING_NOT_FOUND: "Meeting not found",
	UPDATE_FAILED: "Failed to update meeting",
} as const;

export { MeetingStatusMessage };
