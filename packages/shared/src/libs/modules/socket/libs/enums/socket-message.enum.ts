const SocketMessage = {
	AUDIO_SAVE_ERROR: "Error with audio save:",
	AUDIO_SAVE_RECEIVED: "Received audio save from bot:",
	CLIENT_CONNECTED: "Client connected:",
	CLIENT_DISCONNECTED: "Client disconnected:",
	CLIENT_ERROR: "Client error:",
	CONNECTED_TO_SOCKET: "Connected to socket:",
	DISCONNECTED_FROM_SOCKET: "Disconnected from socket",
	ENDED_RECEIVED: "Received end of meeting from bot",
	FAILED_TO_JOIN_MEETING_RECEIVED: "Failed to join meeting received",
	JOINING_MEETING_RECEIVED: "Received join meeting from bot",
	RECORDING_RECEIVED: "Received recording from bot",
	SOCKET_EVENT_RECEIVED: "Socket event: transcription received",
	TRANSCRIPTION_ERROR: "Error with transcription:",
	TRANSCRIPTION_RECEIVED: "Received chunk from bot:",
} as const;

export { SocketMessage };
