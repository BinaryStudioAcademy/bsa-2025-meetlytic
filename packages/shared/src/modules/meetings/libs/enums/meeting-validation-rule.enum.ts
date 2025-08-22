const MeetingValidationRule = {
	MEETING_TITLE_MAXIMUM_LENGTH: 20,
	MINIMAL_HOST_LENGTH: 1,
	MINIMAL_MEETING_ID_LENGTH: 1,
	SEARCH_MINIMUM_LENGTH: 1,
} as const;

export { MeetingValidationRule };
