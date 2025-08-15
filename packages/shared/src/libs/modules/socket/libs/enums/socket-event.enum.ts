const SocketEvent = {
	AUDIO_SAVE: "audio:save",
	CONNECT: "connect",
	CONNECTION: "connection",
	DISCONNECT: "disconnect",
	ERROR: "error",
	TRANSCRIBE: "transcribe",
} as const;

export { SocketEvent };
