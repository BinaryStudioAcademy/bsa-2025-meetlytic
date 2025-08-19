const MeetingsApiPath = {
	$ID: "/:id",
	$ID_MEETING_TRANSCRIPTIONS: "/:id/transcriptions",
	$ID_PDF: "/:id/pdf",
	$ID_PUBLIC: "/:id/public",
	$ID_STOP_RECORDING: "/:id/stop-recording",
	$ID_URL: "/:id/url",
	ROOT: "/",
} as const;

export { MeetingsApiPath };
