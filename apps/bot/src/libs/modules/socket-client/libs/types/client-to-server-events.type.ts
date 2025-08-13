type ClientToServerEvents = {
	transcribe: (data: { chunkText: string; zoomMeetingId: number }) => void;
};

export { type ClientToServerEvents };
