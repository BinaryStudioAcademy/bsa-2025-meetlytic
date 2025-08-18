const SocketEvent = {
	AUDIO_SAVE: "audio:save",
	CONNECT: "connect",
	CONNECT_ERROR: "connect_error",
	CONNECTION: "connection",
	DISCONNECT: "disconnect",
	ERROR: "error",
	TRANSCRIBE_SAVE_CHUNK: "transcribe:save-chunk",
} as const;

export { SocketEvent };
