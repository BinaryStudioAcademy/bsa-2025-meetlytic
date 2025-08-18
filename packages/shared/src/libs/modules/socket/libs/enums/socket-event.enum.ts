const SocketEvent = {
	CONNECT: "connect",
	CONNECTION: "connection",
	DISCONNECT: "disconnect",
	ERROR: "error",
	GENERATE_SUMMARY_ACTION_ITEMS: "generateSummaryActionItems",
	JOIN_ROOM: "joinRoom",
	RECORDING_STOPPED: "recordingStopped",
	SAVE_SUMMARY_ACTION_ITEMS: "saveSummaryActionItems",
	STOP_RECORDING: "stopRecording",
	JOIN_MEETING: "join-meeting",
	LEAVE_MEETING: "leave-meeting",
	MESSAGE: "message",
	TRANSCRIBE: "transcribe",
} as const;

export { SocketEvent };
