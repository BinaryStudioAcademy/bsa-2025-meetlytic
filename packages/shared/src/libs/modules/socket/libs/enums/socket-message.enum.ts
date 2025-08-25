const SocketMessage = {
	AUDIO_SAVE_ERROR: "Error with audio save:",
	AUDIO_SAVE_RECEIVED: "Received audio save from bot:",
	CLIENT_CONNECTED: "Client connected:",
	CLIENT_DISCONNECTED: "Client disconnected:",
	CLIENT_ERROR: "Client error:",
	CONNECTED_TO_SOCKET: "Connected to socket:",
	DISCONNECTED_FROM_SOCKET: "Disconnected from socket",
	FAILED_TO_JOIN_MEETING_ERROR: "Failed to join meeting error:",
	FAILED_TO_JOIN_MEETING_RECEIVED: "Failed to join meeting received",
	JOINING_MEETING_RECEIVED: "Received join meeting from bot",
	JOINING_TO_MEETING_ERROR: "Error with join meeting:",
	RECORDING_RECEIVED: "Received recording from bot",
	SOCKET_EVENT_RECEIVED: "Socket event: transcription received",
	TRANSCRIPTION_ERROR: "Error with transcription:",
	TRANSCRIPTION_RECEIVED: "Received chunk from bot:",
} as const;

export { SocketMessage };
