const SocketEvent = {
	CONNECT: "connect",
	CONNECTION: "connection",
	DISCONNECT: "disconnect",
	ERROR: "error",
	GENERATE_SUMMARY_ACTION_ITEMS: "generateSummaryActionItems",
	JOIN_ROOM: "joinRoom",
	SAVE_SUMMARY_ACTION_ITEMS: "saveSummaryActionItems",
	STOP_RECORDING: "stopRecording",
	TRANSCRIBE: "transcribe",
} as const;

export { SocketEvent };
