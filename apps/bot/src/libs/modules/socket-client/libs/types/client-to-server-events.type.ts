type ClientToServerEvents = {
	transcription: (data: { chunkText: string; zoomMeetingId: number }) => void;
};

export { type ClientToServerEvents };
