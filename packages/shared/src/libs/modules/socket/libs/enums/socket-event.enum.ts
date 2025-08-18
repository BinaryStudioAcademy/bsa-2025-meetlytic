const SocketEvent = {
	AUDIO_SAVE: "audio:save",
	CONNECT: "connect",
	CONNECT_ERROR: "connect_error",
	CONNECTION: "connection",
	DISCONNECT: "disconnect",
	ERROR: "error",
	JOIN_MEETING: "join-meeting",
	LEAVE_MEETING: "leave-meeting",
	MESSAGE: "message",
	TRANSCRIBE: "transcribe",
} as const;

export { SocketEvent };
