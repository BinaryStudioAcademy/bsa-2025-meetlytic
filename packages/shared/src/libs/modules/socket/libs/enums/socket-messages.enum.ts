const SocketMessages = {
	CLIENT_CONNECTED: "Client connected:",
	CLIENT_DISCONNECTED: "Client disconnected:",
	CLIENT_ERROR: "Client error:",
	CONNECTED_TO_SOCKET: "Connected to socket:",
	DISCONNECTED_FROM_SOCKET: "Disconnected from socket",
	SOCKET_EVENT_RECEIVED: "Socket event: transcription received",
	TRANSCRIPTION_ERROR: "Error with transcription:",
	TRANSCRIPTION_RECEIVED: "Received chunk from bot:",
} as const;

export { SocketMessages };
