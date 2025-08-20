const SocketEvent = {
	CONNECT: "connect",
	CONNECTION: "connection",
	DISCONNECT: "disconnect",
	ERROR: "error",
	GENERATE_SUMMARY_ACTION_ITEMS: "generateSummaryActionItems",
	GET_PUBLIC_URL: "getPublicUrl",
	JOIN_MEETING: "joinRoom",
	JOIN_ROOM: "joinRoom",
	LEAVE_ROOM: "leaveRoom",
	MESSAGE: "message",
	RECORDING_STOPPED: "recordingStopped",
	SAVE_SUMMARY_ACTION_ITEMS: "saveSummaryActionItems",
	STOP_RECORDING: "stopRecording",
	TRANSCRIBE: "transcribe",
	UPDATE_MEETING_DETAILS: "updateMeetingDetails",
} as const;

export { SocketEvent };
