type ClientToServerEvents = {
	transcription: (data: { chunkText: string; zoomMeetingId: string }) => void;
};

export { type ClientToServerEvents };
