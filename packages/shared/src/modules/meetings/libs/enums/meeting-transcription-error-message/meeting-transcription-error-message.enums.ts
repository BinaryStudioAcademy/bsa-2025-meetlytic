const MeetingTranscriptionErrorMessage = {
	CANNOT_UPDATE_NON_EXISTENT: "Meeting transcription was not found",
	DELETE_FAILED: "Failed to delete meeting transcription",
	NOT_FOUND: "No transcriptions found for the given meeting",
	UPDATE_FAILED: "Failed to update meeting transcription",
} as const;

export { MeetingTranscriptionErrorMessage };
