const MeetingsApiPath = {
	$ID: "/:id",
	$ID_PUBLIC: "/:id/public",
	$ID_STOP_RECORDING: "/:id/stop-recording",
	$ID_URL: "/:id/url",
	ROOT: "/",
} as const;

export { MeetingsApiPath };
