const SocketEvent = {
	CONNECT: "connect",
	CONNECTION: "connection",
	DISCONNECT: "disconnect",
	ERROR: "error",
	JOIN_MEETING: "join-meeting",
	LEAVE_MEETING: "leave-meeting",
	MESSAGE: "message",
	TRANSCRIBE: "transcribe",
} as const;

export { SocketEvent };
